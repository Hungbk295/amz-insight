import {deleteSqsMessage, readSqsMessage} from "../../utils/awsSdk.js";
import {getBrowser} from "../../utils/playwright_browser.js";
import {classify, convertCrawlResult, uploadResultData} from "../../utils/crawling.js";

import {crawl as crawlNaver} from './suppliers/naver.js'
import {crawl as crawlExpedia} from './suppliers/expedia.js'
import {crawl as crawlAgoda} from './suppliers/agoda.js'
import {crawl as crawlBooking} from './suppliers/booking.js'
import {crawl as crawlTrip} from './suppliers/trip.js'
import {crawl as crawlHotels} from './suppliers/hotels.js'
import {crawl as crawlPrivia} from './suppliers/priviatravel.js'
import {crawl as crawlTourvis} from './suppliers/tourvis.js'
import {crawl as crawlKyte} from './suppliers/kyte.js'

import dotenv from "dotenv";
import DaoTranClient from "daotran-client";
import {internalSupplier, Suppliers} from "../../constants/suppliers.js";
import {sleep} from "../../utils/util.js";
import {generateAdditionalHotelDetailLinks} from "../../linkGenerator/additionalHotelDetail.js";

dotenv.config({path: '../../../.env'})
const server = process.env.VPN_PROXY_SERVER

const crawlers = {
    [Suppliers.Naver.id]: crawlNaver,
    [Suppliers.Expedia.id]: crawlExpedia,
    [Suppliers.Agoda.id]: crawlAgoda,
    [Suppliers.Booking.id]: crawlBooking,
    [Suppliers.Trip.id]: crawlTrip,
    [Suppliers.Hotels.id]: crawlHotels,
    [Suppliers.Priviatravel.id]: crawlPrivia,
    [Suppliers.Tourvis.id]: crawlTourvis,
    [Suppliers.Kyte.id]: crawlKyte
}

export const run = async (queueUrl, workerName) => {
    const client = new DaoTranClient(workerName, server);
    await client.register();
    while (true) {
        try {
            const data = await readSqsMessage(queueUrl)
            if (data.Messages) {
                for (const msg of data.Messages) {
                    const crawlInfo = JSON.parse(msg.Body);
                    if (crawlInfo['isLastTask']) {
                        await sleep(10 * 60)
                        await generateAdditionalHotelDetailLinks()
                        break
                    }
                    await client.waitUntilServerAvailable();
                    await client.updateClientStatus(workerName, client.CLIENT_STATUS.WORKING);
                    const useProxy = !internalSupplier.includes(classify(crawlInfo["url"]).id)
                    const browser = await getBrowser({devices: crawlInfo.devices}, useProxy);
                    const context = await browser.contexts()[0]
                    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
                    try {
                        const crawlResult = await crawlers[classify(crawlInfo["url"]).id](page, crawlInfo);
                        const resultData = convertCrawlResult(crawlResult, crawlInfo);
                        console.log(resultData);
                        console.log('length: ', resultData.length);
                        await uploadResultData(resultData, crawlInfo);
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
