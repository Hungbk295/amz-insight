import AWS from 'aws-sdk'
import fs from 'fs'
import { randomUUID } from 'crypto'
import parseUrl from 'parse-url'
const s3Config = {
	apiVersion: '2006-03-01',
	region: 'ap-northeast-2',
}
const s3 = new AWS.S3(s3Config)
AWS.config.update({ region: 'ap-northeast-2' })
export const sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

export const sleep = s => new Promise(r => setTimeout(r, s * 1000))
export const getRandomInt = (min, max) => Math.random() * (max - min) + min
export const getRandom = list => list[Math.floor(Math.random() * list.length)]
export const checkBreakfast = (text, key) => {
	return text.includes(key) ? 'Y' : `N`
}
export const checkCancelable = (text, key) => {
	return text.includes(key) ? 'N' : 'Y'
}

export const uploadFile = file => {
	const fileContent = fs.readFileSync(file)
	return s3
		.upload({
			Bucket: 'airticket-daily-fly',
			ACL: 'private',
			Key: file,
			Body: fileContent,
		})
		.promise()
}
export const scroll = async args => {
	const { direction, speed } = args
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
	const scrollHeight = () => document.body.scrollHeight / 3
	const start = direction === 'down' ? 0 : scrollHeight()
	const shouldStop = position =>
		direction === 'down' ? position > scrollHeight() : position < 0
	const increment = direction === 'down' ? 100 : -100
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

export async function sendMessages(tasks) {
	for (let i = 0; i < tasks.length; i += 10) {
		const messages = tasks.slice(i, i + 10).map(task => {
			return {
				Id: randomUUID(),
				MessageBody: JSON.stringify(task),
			}
		})

		const params = {
			Entries: messages,
			QueueUrl: process.env.AWS_SQS_HOTELFLY_LINK_URL,
		}

		await sqs.sendMessageBatch(params, () => {})
	}
}

export async function deleteSqsMsg(receiptHandle) {
	const params = {
		ReceiptHandle: receiptHandle,
		QueueUrl: process.env.AWS_SQS_HOTELFLY_LINK_URL,
	}
	await sqs.deleteMessage(params, () => {})
}

export const swapTimeUrl = ({ baseUrl, startTime, endTime }) => {
	const urlRaw = parseUrl(baseUrl)
	const { checkout, checkin } = urlRaw.query
	let urlCrawl = baseUrl
	checkin
		? (urlCrawl = urlCrawl.replace(checkin, startTime))
		: (urlCrawl = urlCrawl + `&checkin=${startTime}`)
	checkout
		? (urlCrawl = urlCrawl.replace(checkout, startTime))
		: (urlCrawl = urlCrawl + `&checkout=${endTime}`)
	return urlCrawl
}
