import '../../config/env.js'
import {sleep} from "../utils/util.js";
import {deleteSqsMessages, readSqsMessages} from "../utils/awsSdk.js";
import Sentry from "../utils/sentry.js";
import {create} from "../api/hotelData.js";

while (true) {
    const data = await readSqsMessages(process.env.AWS_SQS_HOTELFLY_RESULT, 10)
    if (data.Messages) {
        const receiptHandles = []
        for (const msg of data.Messages) {
            try {
                await create(JSON.parse(msg.Body))
                receiptHandles.push(msg.ReceiptHandle)
            } catch (error) {
                Sentry.captureMessage(error, {
                    level: 'error', extra: {
                        json: JSON.stringify(msg)
                    },
                });
            }
        }
        await deleteSqsMessages(process.env.AWS_SQS_HOTELFLY_RESULT, receiptHandles)
    }
    await sleep(10)
}