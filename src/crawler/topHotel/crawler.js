import {createSqsMessages, deleteSqsMessage, readSqsMessages} from "../../utils/awsSdk.js";
import {getBrowser} from "../../utils/browserManager.js";
import {convertCrawlResult} from "../../utils/crawling.js";
import {Agoda, Booking, Expedia, Hotels, Kyte, Naver, Privia, Tourvis, Trip} from './suppliers/index.js'
import DaoTranClient from "daotran-client";
import {getConfigBySupplierId, SUPPLIERS} from "../../config/suppliers.js";
import {sleep} from "../../utils/util.js";
import {generateAdditionalHotelDetailLinks} from "../../linkGenerator/additionalHotelDetail.js";
import {SUPPLIERS_WITH_DETAIL_PRICE} from "../../config/app.js";
import _ from "lodash";

const server = process.env.PROXY_MANAGEMENT_API_URL
const crawlers = {
    [SUPPLIERS.Naver.id]: new Naver(),
    [SUPPLIERS.Expedia.id]: new Expedia(),
    [SUPPLIERS.Agoda.id]: new Agoda(),
    [SUPPLIERS.Booking.id]: new Booking(),
    [SUPPLIERS.Trip.id]: new Trip(),
    [SUPPLIERS.Hotels.id]: new Hotels(),
    [SUPPLIERS.Privia.id]: new Privia(),
    [SUPPLIERS.Tourvis.id]: new Tourvis(),
    [SUPPLIERS.Kyte.id]: new Kyte()
}

export const run = async (queueUrl, workerName) => {
    const client = new DaoTranClient(workerName, server);
    await client.register();
    while (true) {
        const data = await readSqsMessages(queueUrl, 5)
        if (data.Messages) {
            for (const msg of data.Messages) {
                const crawlInfo = JSON.parse(msg.Body);
                if (crawlInfo['isLastTask']) {
                    await deleteSqsMessage(queueUrl, msg.ReceiptHandle);
                    await sleep(5 * 60);
                    await generateAdditionalHotelDetailLinks();
                    break;
                }
                await client.waitUntilServerAvailable();
                await client.updateClientStatus(workerName, client.CLIENT_STATUS.WORKING);
                const supplierId = crawlInfo["supplierId"]
                const browser = await getBrowser(getConfigBySupplierId(supplierId));
                const page = await browser.contexts()[0].newPage();
                try {
                    const crawlResult = await crawlers[supplierId].crawl(page, crawlInfo);
                    const resultData = convertCrawlResult(crawlResult, crawlInfo);
                    console.log(resultData);
                    console.log('length: ', resultData.length);
                    await createSqsMessages(process.env.QUEUE_RESULTS_URL, _.chunk(resultData, 10));
                    if (SUPPLIERS_WITH_DETAIL_PRICE.map(item => item.id).includes(supplierId))
                        await crawlers[supplierId].generateDetailTasks(crawlResult)
                    await deleteSqsMessage(queueUrl, msg.ReceiptHandle);
                    await client.updateClientStatus(workerName, client.CLIENT_STATUS.IDLE);
                } catch (e) {
                    console.log("Error", msg.Body);
                    console.log(e);
                    try {
                        await client.requestChangeLocation();
                        await sleep(5)
                    } catch (e) {
                    }
                }
                await browser.close();
            }
        }
        await sleep(5)
    }
}
