import {deleteSqsMessage, readSqsMessage} from "../../utils/awsSdk.js";
import {getBrowser} from "../../utils/playwright_browser.js";
import {classify, convertCrawlResult, uploadResultData} from "../../utils/crawling.js";
import {sleep} from "../../utils/util.js";
import dotenv from "dotenv";
import {internalSupplier, Suppliers} from "../../constants/suppliers.js";

import {crawl as crawlPrivia} from './suppliers/priviatravel.js'
import {crawl as crawlTourvis} from './suppliers/tourvis.js'
import {crawl as crawlKyte} from './suppliers/kyte.js'
import DaoTranClient from "daotran-client";

dotenv.config({path: '../../../.env'})
const crawlers = {
    // Naver: crawlNaver,
    // Expedia: crawlExpedia,
    // Agoda: crawlAgoda,
    // Booking: crawlBooking,
    // Trip: crawlTrip,
    // Hotels: crawlHotels,
    [Suppliers.Priviatravel.id]: crawlPrivia,
    [Suppliers.Tourvis.id]: crawlTourvis,
    [Suppliers.Kyte.id]: crawlKyte
}

const server = process.env.VPN_PROXY_SERVER
export const run = async (queueUrl, workerName) => {
    const client = new DaoTranClient(workerName, server);
    await client.register();
    while (true) {
        try {
            const data = await readSqsMessage(queueUrl)
            if (data.Messages) {
                for (const msg of data.Messages) {
                    await client.updateClientStatus(workerName, client.CLIENT_STATUS.WORKING);
                    const crawlInfo = JSON.parse(msg.Body);
                    const useProxy = !internalSupplier.includes(classify(crawlInfo["link"]).id)
                    const browser = await getBrowser({devices: crawlInfo.devices}, useProxy);
                    const context = await browser.contexts()[0]
                    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
                    try {
                        const crawlResult = await crawlers[classify(crawlInfo["link"]).id](page, crawlInfo);
                        const resultData = convertCrawlResult(crawlResult, crawlInfo);
                        console.log(resultData);
                        console.log('length: ', resultData.length);
                        await uploadResultData(resultData, crawlInfo);
                        await deleteSqsMessage(queueUrl, msg.ReceiptHandle);
                    } catch (e) {
                        console.log("Error", msg.Body);
                        console.log(e);
                    }
                    await browser.close();
                }
            }
        } catch (error) {
        }
        await client.updateClientStatus(workerName, client.CLIENT_STATUS.IDLE);
        await sleep(3)
    }
}

