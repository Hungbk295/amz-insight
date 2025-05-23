import '../config/env.js'
import {sleep} from "../utils/util.js";
import {deleteSqsMessages, readSqsMessages} from "../utils/awsSdk.js";
import Sentry from "../utils/sentry.js";
import {create} from "../api/hotelData.js";

while (true) {
    const data = await readSqsMessages(process.env.QUEUE_RESULTS_URL, 10)
    if (data.Messages) {
        const receiptHandles = []
        for (const msg of data.Messages) {
            try {
                await create(JSON.parse(msg.Body))
                receiptHandles.push(msg.ReceiptHandle)
            } catch (error) {
                console.log('Error' + msg.Body)
                Sentry.captureMessage(error, {
                    level: 'error', extra: {
                        json: msg.Body
                    },
                });
            }
        }
        await deleteSqsMessages(process.env.QUEUE_RESULTS_URL, receiptHandles)
    } else {
        await sleep(60)
    }
    await sleep(5)
}