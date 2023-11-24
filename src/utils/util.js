import AWS from 'aws-sdk'
import {Upload} from '@aws-sdk/lib-storage'
import {PutObjectCommand, S3} from '@aws-sdk/client-s3'
import {DeleteMessageCommand, ReceiveMessageCommand, SendMessageBatchCommand, SendMessageCommand, SQSClient} from '@aws-sdk/client-sqs'
import fs from 'fs'
import {randomUUID} from 'crypto'
import parseUrl from 'parse-url'
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

export const sleep = s => new Promise(r => setTimeout(r, s * 1000))
export const getRandomInt = (min, max) => Math.random() * (max - min) + min
export const getRandom = list => list[Math.floor(Math.random() * list.length)]

export const uploadFile = async file => {
    const fileContent = fs.readFileSync(file)
    return new Upload({
        client: s3,
        params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            ACL: 'private',
            Key: file,
            Body: fileContent,
        },
    }).done()
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

export const scroll = async args => {
    const {direction, speed} = args
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    const scrollHeight = () => document.body.scrollHeight / 10
    const start = direction === 'down' ? 0 : scrollHeight()
    const shouldStop = position =>
        direction === 'down' ? position > scrollHeight() - 500 : position < 0
    const increment = direction === 'down' ? 200 : -50
    const delayTime = speed === 'slow' ? 100 : 10
    console.error(start, shouldStop(start), increment)
    for (let i = start; !shouldStop(i); i += increment) {
        window.scrollTo(0, i)
        await delay(delayTime)
    }
}

export const scroll_step = async args => {
    const {direction, speed, step} = args
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    const scrollHeight = (step) => step * 400
    const start = direction === 'down' ? 0 : scrollHeight(step)
    const shouldStop = position =>
        direction === 'down' ? position > scrollHeight(step) : position < 0
    const increment = direction === 'down' ? 101 : -50
    const delayTime = speed === 'slow' ? 50 : 10
    console.error(start, shouldStop(start), increment)
    for (let i = start; !shouldStop(i); i += increment) {
        window.scrollTo(0, i)
        await delay(delayTime)
    }
}

export const takeScreenshot = async page => {
    let currentDate = new Date().toString().trim()
    await page.screenshot({
        path: 'temp/' + currentDate + '.jpeg',
        fullPage: true,
        quality: 20,
        type: 'jpeg',
    })
    await uploadFile('temp/' + currentDate + '.jpeg')
    let html = await page.innerHTML('//body')
    fs.writeFileSync('temp/' + currentDate + '.html', html)
    await uploadFile('temp/' + currentDate + '.html')
}

export const swapTimeUrl = ({baseUrl, startTime, endTime}) => {
    const urlRaw = parseUrl(baseUrl)
    const {checkout, checkin} = urlRaw.query
    let urlCrawl = baseUrl
    checkin
        ? (urlCrawl = urlCrawl.replace(checkin, startTime))
        : (urlCrawl = urlCrawl + `&checkin=${startTime}`)
    checkout
        ? (urlCrawl = urlCrawl.replace(checkout, startTime))
        : (urlCrawl = urlCrawl + `&checkout=${endTime}`)
    return urlCrawl
}

 const res = await readSqsMessages('https://sqs.ap-northeast-2.amazonaws.com/836881754257/detail-hotel-fly-dev',1)
console.log(res.Messages)
