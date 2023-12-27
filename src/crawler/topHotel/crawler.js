import {createSqsMessages, deleteSqsMessage, readSqsMessages} from "../../utils/awsSdk.js";
import {getBrowser} from "../../utils/browserManager.js";
import {convertCrawlResult} from "../../utils/crawling.js";
import {Agoda, Booking, Expedia, Hotels, Kyte, Naver, Privia, Tourvis, Trip} from './suppliers/index.js'
import DaoTranClient from "daotran-client";
import {getConfigBySupplierId, SUPPLIERS} from "../../config/suppliers.js";
import {sleep} from "../../utils/util.js";
import {generateAdditionalHotelDetailTasks} from "../../linkGenerator/additionalHotelDetail.js";
import {SUPPLIERS_WITH_DETAIL_PRICE} from "../../config/app.js";
import _ from "lodash";
import {read as getKeywords} from "../../api/keyword.js";

const server = process.env.PROXY_MANAGEMENT_API_URL
const keywords = await getKeywords()

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
                const task = JSON.parse(msg.Body);
                if (task['isLastTask']) {
                    await deleteSqsMessage(queueUrl, msg.ReceiptHandle);
                    await sleep(5 * 60);
                    await generateAdditionalHotelDetailTasks();
                    break;
                }
                await client.waitUntilServerAvailable();
                await client.updateClientStatus(workerName, client.CLIENT_STATUS.WORKING);
                const supplierId = task["supplierId"]
                task['keyword'] = keywords.find(keyword => keyword.id === task['keywordId'])
                const browser = await getBrowser(getConfigBySupplierId(supplierId));
                const page = await browser.contexts()[0].newPage();
                try {
                    if(!SUPPLIERS_WITH_DETAIL_PRICE.map(item => item.id).includes(supplierId)) {
                        await deleteSqsMessage(queueUrl, msg.ReceiptHandle);
                        await browser.close();
                        continue
                    }
                    const crawlResult = await crawlers[supplierId].crawl(page, task);
                    const resultData = convertCrawlResult(crawlResult, task);
                    console.log(resultData);
                    console.log('length: ', resultData.length);
                    await createSqsMessages(process.env.QUEUE_RESULTS_URL, _.chunk(resultData, 10));
                    if (SUPPLIERS_WITH_DETAIL_PRICE.map(item => item.id).includes(supplierId))
                        await crawlers[supplierId].generateHotelDetailTasks(resultData, task['keyword'])
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
        await client.updateClientStatus(workerName, client.CLIENT_STATUS.IDLE);
        await sleep(5)
    }
}
