import {deleteSqsMessage, readSqsMessages} from "../../utils/awsSdk.js";
import {getBrowser} from "../../utils/browserManager.js";
import {classify, convertCrawlResult, uploadResultData} from "../../utils/crawling.js";
import {Agoda, Booking, Expedia, Hotels, Kyte, Naver, Privia, Tourvis, Trip} from 'suppliers/index.js'
import dotenv from "dotenv";
import DaoTranClient from "daotran-client";
import {internalSupplier, Suppliers} from "../../config/suppliers.js";
import {sleep} from "../../utils/util.js";
import {generateAdditionalHotelDetailLinks} from "../../linkGenerator/additionalHotelDetail.js";

dotenv.config({path: '../../../.env'})
const server = process.env.VPN_PROXY_SERVER

const crawlers = {
    [Suppliers.Naver.id]: new Naver(),
    [Suppliers.Expedia.id]: new Expedia(),
    [Suppliers.Agoda.id]: new Agoda(),
    [Suppliers.Booking.id]: new Booking(),
    [Suppliers.Trip.id]: new Trip(),
    [Suppliers.Hotels.id]: new Hotels(),
    [Suppliers.Priviatravel.id]: new Privia(),
    [Suppliers.Tourvis.id]: new Tourvis(),
    [Suppliers.Kyte.id]: new Kyte()
}

export const run = async (queueUrl, workerName) => {
    const client = new DaoTranClient(workerName, server);
    await client.register();
    while (true) {
        try {
            const data = await readSqsMessages(queueUrl, 5)
            if (data.Messages) {
                for (const msg of data.Messages) {
                    const crawlInfo = JSON.parse(msg.Body);
                    if (crawlInfo['isLastTask']) {
                        await sleep(10 * 60);
                        await generateAdditionalHotelDetailLinks();
                        await deleteSqsMessage(queueUrl, msg.ReceiptHandle);
                        break;
                    }
                    await client.waitUntilServerAvailable();
                    await client.updateClientStatus(workerName, client.CLIENT_STATUS.WORKING);
                    const supplierId = classify(crawlInfo["url"]).id
                    const browser = await getBrowser(supplierId);
                    const page = await browser.contexts()[0].newPage();
                    try {
                        const crawlResult = await crawlers[supplierId].crawl(page, crawlInfo);
                        const resultData = convertCrawlResult(crawlResult, crawlInfo);
                        console.log(resultData);
                        console.log('length: ', resultData.length);
                        await uploadResultData(resultData, crawlInfo);
                        if(internalSupplier.includes(supplierId))
                            await crawlers[supplierId].generateDetailTasks(crawlResult)
                        await deleteSqsMessage(queueUrl, msg.ReceiptHandle);
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
        } catch (error) {
        }
        await client.updateClientStatus(workerName, client.CLIENT_STATUS.IDLE);
        await sleep(5)
    }
}
