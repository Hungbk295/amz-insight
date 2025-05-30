import {
    DeleteMessageBatchCommand,
    DeleteMessageCommand,
    ReceiveMessageCommand,
    SendMessageBatchCommand,
    SendMessageCommand,
    SQSClient,
    GetQueueAttributesCommand
} from "@aws-sdk/client-sqs";
import {randomUUID} from "crypto";

export const sqsClient = new SQSClient();

export const readSqsMessages = async (QueueUrl, maxMsgReceive) => {
    const command = new ReceiveMessageCommand({QueueUrl: QueueUrl, MaxNumberOfMessages: maxMsgReceive});
    return await sqsClient.send(command);
}
export const readSqsMessage = async (QueueUrl) => {
    return await readSqsMessages(QueueUrl, 1);
}
export const createSqsMessage = async (QueueUrl, message) => {
    const command = new SendMessageCommand({QueueUrl: QueueUrl, MessageBody: message});
    return await sqsClient.send(command);
}

export const createSqsMessages = async (QueueUrl, messages) => {
    for (let i = 0; i < messages.length; i += 10) {
        const batchMsgs = messages.slice(i, i + 10).map(msg => {
            return {Id: randomUUID(), MessageBody: JSON.stringify(msg)}
        })
        const command = new SendMessageBatchCommand({QueueUrl: QueueUrl, Entries: batchMsgs});
        await sqsClient.send(command);
    }
}

export async function deleteSqsMessage(QueueUrl, receiptHandle) {
    try{
        const command = new DeleteMessageCommand({
            ReceiptHandle: receiptHandle,
            QueueUrl: QueueUrl
        });
        return sqsClient.send(command);
    }
    catch(error){
       console.error(error)
    }

}

export async function deleteSqsMessages(QueueUrl, receiptHandles) {
    if(receiptHandles.length > 0) {
        const input = {
            QueueUrl: QueueUrl,
            Entries: receiptHandles.map(receiptHandle => {
                return {
                    Id:  randomUUID(),
                    ReceiptHandle: receiptHandle
                }
            })
        };

        const command = new DeleteMessageBatchCommand(input);
        return sqsClient.send(command);
    }
}

export async function getRemainingMessage(queUrl) {
    try {
        const params = {
            QueueUrl: queUrl,
            AttributeNames: [
                'ApproximateNumberOfMessages',
                'ApproximateNumberOfMessagesNotVisible',
            ],
        }
        const command = new GetQueueAttributesCommand(params)
        const response = await sqsClient.send(command)
        if (response.Attributes) {
            const approximateNumberOfMessages =
                response.Attributes?.ApproximateNumberOfMessages??0
            const approximateNumberOfMessagesNotVisible =
                response.Attributes?.ApproximateNumberOfMessagesNotVisible??0
            return approximateNumberOfMessages+ approximateNumberOfMessagesNotVisible
        }
    } catch (error) {
        console.error(error)
        return Infinity
    }
}