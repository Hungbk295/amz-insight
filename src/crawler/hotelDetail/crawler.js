import {createSqsMessages, deleteSqsMessage, readSqsMessages} from "../../utils/awsSdk.js";
import {getContext} from "../../utils/browserManager.js";
import {convertCrawlResult} from "../../utils/crawling.js";
import {sleep} from "../../utils/util.js";
import {getConfigBySupplierId, INTERNAL_SUPPLIER_IDS, SUPPLIERS} from "../../config/suppliers.js";
import DaoTranClient from "daotran-client";
import {login} from "../loginHandlers/index.js";
import _ from "lodash";
import {Privia, Tourvis} from "./suppliers/index.js";
import Sentry from "../../utils/sentry.js";
import moment from 'moment'

const crawlers = {
    [SUPPLIERS.Privia.id]: new Privia(),
    [SUPPLIERS.Tourvis.id]: new Tourvis(),
}

const server = process.env.PROXY_MANAGEMENT_API_URL
export const run = async (queueUrl, workerName) => {
    const client = new DaoTranClient(workerName, server);
    await client.register();
    while (true) {
        const data = await readSqsMessages(queueUrl, 5)
        if (data.Messages) {
            for (const msg of data.Messages) {
                await client.updateClientStatus(workerName, client.CLIENT_STATUS.WORKING);
                const task = JSON.parse(msg.Body);
                const supplierId = task.supplierId
                const supplyIdConfig = getConfigBySupplierId(supplierId)
                const browser = await getContext(supplyIdConfig);
                const page = await (INTERNAL_SUPPLIER_IDS.includes(supplyIdConfig.id) ? browser.pages()[0] : (await browser.contexts()[0]).pages()[0])
                try {
                    const crawlResult = await crawlers[supplierId].crawl(page, task);
                    await finish(crawlResult, task)
                    await browser.clearCookies()
                    if (INTERNAL_SUPPLIER_IDS.includes(supplierId)) {
                        await login(supplierId, page)
                        const crawlResultAfterLogin = await crawlers[supplierId].crawlLoggedIn(page, task);
                        await finish(crawlResultAfterLogin, task)
                        await browser.clearCookies()
                    }
                    await deleteSqsMessage(queueUrl, msg.ReceiptHandle);
                    await client.updateClientStatus(workerName, client.CLIENT_STATUS.IDLE);
                } catch (e) {
                    console.log("Error", msg.Body);
                    Sentry.captureMessage(e, {
                        level: 'error', extra: {
                            json: msg.Body
                        }
                    });
                }
                await browser.close();
            }
        } else
            await sleep(60)
        await client.updateClientStatus(workerName, client.CLIENT_STATUS.IDLE);
        await sleep(3)
    }
}

async function finish(crawlResult, task) {
    const resultData = convertCrawlResult(crawlResult, task);
    if(resultData.length){
        const currentTime = new Date()
        const durationHour = Math.abs(currentTime - moment(resultData[0].createdAt))/ (1000 * 60 * 60);
        if(durationHour > 6) {
            console.log('Alert Deadlock Here')
        }
    }
    // console.log('length: ', resultData.length);
    await createSqsMessages(process.env.QUEUE_RESULTS_URL, _.chunk(resultData, 10));
}
