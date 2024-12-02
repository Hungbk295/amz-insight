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

const crawlers = {
	[SUPPLIERS.Privia.id]: new Privia(),
	[SUPPLIERS.Tourvis.id]: new Tourvis(),
}

export const run = async (queueUrl, workerName) => {
	while (true) {
		const data = await readSqsMessages(queueUrl, 5)
		if (data.Messages) {
			for (const msg of data.Messages) {
				const task = JSON.parse(msg.Body);
				const supplierId = task.supplierId
				const context = await getContext(getConfigBySupplierId(supplierId));
				const page = await context.pages()[0]
				try {
					const crawlResult = await crawlers[supplierId].crawl(page, task);
					await finish(crawlResult, task)
					await context.clearCookies()
					if (INTERNAL_SUPPLIER_IDS.includes(supplierId)) {
						await login(supplierId, page)
						const crawlResultAfterLogin = await crawlers[supplierId].crawlLoggedIn(page, task);
						await finish(crawlResultAfterLogin, task)
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
				finally {
					await context.clearCookies()
				}
				
				await context.close();
			}
		} else
			await sleep(60)
		await sleep(3)
	}
}

async function finish(crawlResult, task) {
	const resultData = convertCrawlResult(crawlResult, task);
	console.log(resultData);
	console.log('length: ', resultData.length);
	await createSqsMessages(process.env.QUEUE_RESULTS_URL, _.chunk(resultData, 10));
}
await run(process.env.QUEUE_TASKS_DETAIL_URL)