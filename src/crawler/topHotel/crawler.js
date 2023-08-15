import {crawl as crawlNaver} from './suppliers/naver.js'
import {crawl as crawlExpedia} from './suppliers/expedia.js'
import {crawl as crawlAgoda} from './suppliers/agoda.js'
import {crawl as crawlBooking} from './suppliers/booking.js'
import {crawl as crawlTrip} from './suppliers/trip.js'
import {crawl as crawlHotels} from './suppliers/hotels.js'
import {crawl as crawlPrivia} from './suppliers/priviatravel.js'
import {crawl as crawlTourvis} from './suppliers/tourvis.js'
import {crawl as crawlKyte} from './suppliers/kyte.js'

import {deleteSqsMessage, readSqsMessage, sleep, uploadFileToS3} from "../../utils/util.js";
import {getBrowser} from "../../utils/playwright_browser.js";
import fs from "fs";
import * as yaml from "js-yaml";
import dotenv from "dotenv";
import DaoTranClient from "daotran-client";
import {internalSupplier, Suppliers} from "../../constants/suppliers.js";

dotenv.config({path: '../../../.env'})

const crawlDefault = (url) => {
    return []
}

const classify = link => {
    if (!link) return crawlDefault
    if (link.includes(Suppliers.Naver.url)) return [Suppliers.Naver.id, crawlNaver];
    if (link.includes(Suppliers.Expedia.url)) return [Suppliers.Expedia.id, crawlExpedia];
    if (link.includes(Suppliers.Agoda.url)) return [Suppliers.Agoda.id, crawlAgoda];
    if (link.includes(Suppliers.Booking.url)) return [Suppliers.Booking.id, crawlBooking];
    if (link.includes(Suppliers.Trip.url)) return [Suppliers.Trip.id, crawlTrip];
    if (link.includes(Suppliers.Hotels.url)) return [Suppliers.Hotels.id, crawlHotels];
    if (link.includes(Suppliers.Priviatravel.url)) return [Suppliers.Priviatravel.id, crawlPrivia];
    if (link.includes(Suppliers.Tourvis.url)) return [Suppliers.Tourvis.id, crawlTourvis];
    if (link.includes(Suppliers.Kyte.url)) return [Suppliers.Kyte.id, crawlKyte];
}

const crawl = async (page, crawlInfo) => {
    return classify(crawlInfo["url"])[1](page, crawlInfo)
}

const convertCrawlResult = (crawlResult, crawlInfo) => {
    const resultData = [];
    for (let idx = 0; idx < crawlResult.length; idx++) {
        const resultItem = crawlResult[idx];
        const item = {};
        item["rank"] = resultItem["rank"] || null;
        item["name"] = resultItem["name"];
        item["price"] = parseInt(resultItem["price"]);
        item["identifier"] = resultItem["identifier"];
        item["link"] = resultItem["link"];
        item["checkinDate"] = crawlInfo["checkinDate"];
        item["checkoutDate"] = crawlInfo["checkoutDate"];
        item["keywordId"] = crawlInfo["keywordId"];
        item["createdAt"] = crawlInfo["createdAt"];
        item["supplierId"] = resultItem["supplierId"];
        item["siteId"] = resultItem['siteId'];
        item["tag"] = resultItem["tag"];
        item["price"] = !isNaN(item["price"]) ? item["price"] : 0;
        resultData.push(item);
    }
    return resultData;
}

const uploadResultData = async (resultData, crawlInfo) => {
    if (resultData.length > 0) {
        const fileName = crawlInfo["checkinDate"] + "_" + crawlInfo["keywordId"] + "_" + resultData[0]["supplierId"] + ".yaml";
        await fs.writeFileSync(fileName, yaml.dump(resultData, {}), 'utf8');
        await uploadFileToS3(fileName)
        await fs.unlinkSync(fileName)
    }
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
                    await client.waitUntilServerAvailable();
                    await client.updateClientStatus(workerName, client.CLIENT_STATUS.WORKING);
                    const crawlInfo = JSON.parse(msg.Body);
                    console.log(crawlInfo);
                    const useProxy = !internalSupplier.includes(classify(crawlInfo["url"])[0])
                    const browser = await getBrowser({devices: crawlInfo.devices}, useProxy);
                    const context = await browser.contexts()[0]
                    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
                    try {
                        const crawlResult = await crawl(page, crawlInfo);
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