import {createSqsMessages, deleteSqsMessage, readSqsMessages} from "../../utils/awsSdk.js";
import {getContext} from "../../utils/browserManager.js";
import {convertCrawlResult} from "../../utils/crawling.js";
import {sleep,checkSqsPeriodOfTime} from "../../utils/util.js";
import {getConfigBySupplierId, INTERNAL_SUPPLIER_IDS, SUPPLIERS} from "../../config/suppliers.js";
import DaoTranClient from "daotran-client";
import {login} from "../loginHandlers/index.js";
import _ from "lodash";
import {Privia, Tourvis} from "./suppliers/index.js";
import Sentry from "../../utils/sentry.js";
import {COUNT_RECEIVE_MESSAGE} from "../../config/app.js";

const crawlers = {
    [SUPPLIERS.Privia.id]: new Privia(),
    [SUPPLIERS.Tourvis.id]: new Tourvis(),
}
const server = process.env.PROXY_MANAGEMENT_API_URL
export const run = async (queueUrl, workerName) => {
    const client = new DaoTranClient(workerName, server);
    await client.register();
    while (true) {
        const data = await readSqsMessages(queueUrl, COUNT_RECEIVE_MESSAGE)
        
        if (data.Messages) {

            const start = Date.now(); 
            for (const msg of data.Messages) {
                const task = JSON.parse(msg.Body);
                await client.updateClientStatus(workerName, client.CLIENT_STATUS.WORKING);
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
                
                } catch (e) {
                    console.log("Error", msg.Body);
                    Sentry.captureMessage(e, {
                        level: 'error', extra: {
                            json: msg.Body
                        }
                    });
                }
                await client.updateClientStatus(workerName, client.CLIENT_STATUS.IDLE);
                await browser.close();
                const end = Date.now();
                if(checkSqsPeriodOfTime(start,end,data.Messages,"crawl detail")) break
            }
            
            
        } 
        await client.updateClientStatus(workerName, client.CLIENT_STATUS.IDLE);
        await sleep(3)
    }
}

async function finish(crawlResult, task) {
    const resultData = convertCrawlResult(crawlResult, task);
    await createSqsMessages(process.env.QUEUE_RESULTS_URL, _.chunk(resultData, 10));
}

