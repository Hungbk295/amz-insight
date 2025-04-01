import {createSqsMessages, deleteSqsMessage, readSqsMessages} from "../../utils/awsSdk.js";
import {getContext} from "../../utils/browserManager.js";
import {convertCrawlResult} from "../../utils/crawling.js";
import {Agoda, Booking, Expedia, Hotels, Kyte, Naver, Privia, Tourvis, Trip} from './suppliers/index.js'
import { getConfigBySupplierId, INTERNAL_SUPPLIER_IDS, SUPPLIERS } from '../../config/suppliers.js'
import {sleep} from "../../utils/util.js";
import {generateAdditionalHotelDetailTasks} from "../../linkGenerator/additionalHotelDetail.js";
import {SUPPLIERS_WITH_DETAIL_PRICE} from "../../config/app.js";
import _ from "lodash";
import {read as getKeywords} from "../../api/keyword.js";
import Sentry from '../../utils/sentry.js'

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

export const run = async (queueUrl) => {
    while (true) {
        const data = await readSqsMessages(queueUrl, 5)
        if (data.Messages) {
            for (const msg of data.Messages) {
                const task = JSON.parse(msg.Body);
                console.log('task',task);
                if (task['isLastTask']) {
                    await deleteSqsMessage(queueUrl, msg.ReceiptHandle);
                    await sleep(5 * 60);
                    await generateAdditionalHotelDetailTasks();
                    break;
                }
                const supplierId = task["supplierId"]
                task['keyword'] = keywords.find(keyword => keyword.id === task['keywordId'])
                const configSupplier = getConfigBySupplierId(supplierId)
                const browser = await getContext(configSupplier);
                const page = await (INTERNAL_SUPPLIER_IDS.includes(configSupplier.id) ? browser.pages()[0] : (await browser.contexts()[0]).pages()[0])
                try {
                    const crawlResult = await crawlers[supplierId].crawl(page, task);
                    const resultData = convertCrawlResult(crawlResult, task);
                    console.log('Example Result: ', resultData[0]);
                    console.log('Result Length: ', resultData.length);
                    await createSqsMessages(process.env.QUEUE_RESULTS_URL, _.chunk(resultData, 10));
                    if (SUPPLIERS_WITH_DETAIL_PRICE.map(item => item.id).includes(supplierId))
                        await crawlers[supplierId].generateHotelDetailTasks(resultData, task['keyword'])
                    await deleteSqsMessage(queueUrl, msg.ReceiptHandle);
                } catch (e) {
                    console.log("Error", msg.Body);
                    console.log(e);
                    Sentry.captureMessage(e, {
                        level: 'error',
                        extra: {
                            json: msg.Body
                        }
                    });
                    try {
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

await run(process.env.QUEUE_TASKS_URL)
