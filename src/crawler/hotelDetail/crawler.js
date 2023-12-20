import {createSqsMessages, deleteSqsMessage, readSqsMessages} from "../../utils/awsSdk.js";
import {getBrowser} from "../../utils/browserManager.js";
import {classify, convertCrawlResult} from "../../utils/crawling.js";
import {sleep} from "../../utils/util.js";
import {getConfigBySupplierId, internalSupplier, Suppliers} from "../../config/suppliers.js";
import {Privia} from './suppliers/privia.js'
import DaoTranClient from "daotran-client";
import {login} from "../loginHandlers/index.js";
import _ from "lodash";

const crawlers = {
    [Suppliers.Priviatravel.id]: new Privia(),
}

const server = process.env.VPN_PROXY_SERVER
export const run = async (queueUrl, workerName) => {
    const client = new DaoTranClient(workerName, server);
    await client.register();
    while (true) {
        try {
            const data = await readSqsMessages(queueUrl, 10)
            if (data.Messages) {
                for (const msg of data.Messages) {
                    await client.updateClientStatus(workerName, client.CLIENT_STATUS.WORKING);
                    const crawlInfo = JSON.parse(msg.Body);
                    const supplierId = classify(crawlInfo["link"]).id
                    const browser = await getBrowser(getConfigBySupplierId(supplierId));
                    const page = await browser.contexts()[0].newPage();
                    try {
                        const crawlResult = await crawlers[supplierId].crawl(page, crawlInfo);
                        await finish(crawlResult, crawlInfo)
                        if(internalSupplier.includes(supplierId)) {
                            await login(supplierId, page)
                            const crawlResultAfterLogin = await crawlers[supplierId].crawlLoggedIn(page, crawlInfo);
                            await finish(crawlResultAfterLogin, crawlInfo)
                        }
                        await deleteSqsMessage(queueUrl, msg.ReceiptHandle);
                        await client.updateClientStatus(workerName, client.CLIENT_STATUS.IDLE);
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

async function finish(crawlResult, crawlInfo) {
    const resultData = convertCrawlResult(crawlResult, crawlInfo);
    console.log(resultData);
    console.log('length: ', resultData.length);
    await createSqsMessages(process.env.AWS_SQS_HOTELFLY_RESULT, _.chunk(resultData, 10));
}
