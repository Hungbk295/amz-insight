import {PutObjectCommand, S3} from "@aws-sdk/client-s3";
import AWS from "aws-sdk";
import {DeleteMessageCommand, ReceiveMessageCommand, SendMessageBatchCommand, SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import {randomUUID} from "crypto";
import fs from "fs";
import dotenv from 'dotenv'

dotenv.config({path: '../../.env'})

const s3 = new S3({
    apiVersion: '2006-03-01',
    region: 'ap-northeast-2',
})

AWS.config.update({region: 'ap-northeast-2'})

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
    const command = new DeleteMessageCommand({
        ReceiptHandle: receiptHandle,
        QueueUrl: QueueUrl
    });
    return sqsClient.send(command);
}

export const uploadFileToS3 = async (key) => {
    const fileContent = fs.readFileSync(key)
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: fileContent,
    });
    try {
        await s3.send(command);
    } catch (err) {
        console.error(err);
    }
}