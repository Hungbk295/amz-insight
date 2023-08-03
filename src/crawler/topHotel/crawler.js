import { crawl as crawlAgoda } from './suppliers/agoda.js'
import { crawl as crawlExpedia } from './suppliers/expedia.js'
import { crawl as crawlBooking } from './suppliers/booking.js'
import { crawl as crawlTrip } from './suppliers/trip.js'
import { crawl as crawlNaver } from './suppliers/naver.js'
import { crawl as crawlHotels } from './suppliers/hotels.js'
import { crawl as crawlPrivia } from './suppliers/priviatravel.js'
import { crawl as crawlTourvis } from './suppliers/tourvis.js'
import { crawl as crawlKyte } from './suppliers/kyte.js'
import dotenv from "dotenv";
import {deleteSqsMsg, getRandom, sleep, sqs, uploadFileToS3} from "../../utils/util.js";
import {getBrowser} from "../../utils/playwright_browser.js";
import fs from "fs";
import * as yaml from "js-yaml";
import {execSync} from "child_process";
import {SERVERS} from "../../constants/expressvpn.js";
import {Suppliers} from "../../constants/suppliers.js";
dotenv.config({path: '../../../.env'})

const crawlDefault = (url) => {
	return []
}

const classify = link => {
	if (!link) return crawlDefault
	if (link.includes(Suppliers.Naver.url)) return crawlNaver
	if (link.includes(Suppliers.Expedia.url)) return crawlExpedia
	if (link.includes(Suppliers.Agoda.url)) return crawlAgoda
	if (link.includes(Suppliers.Booking.url)) return crawlBooking
	if (link.includes(Suppliers.Trip.url)) return crawlTrip
	if (link.includes(Suppliers.Hotels.url)) return crawlHotels
	if (link.includes(Suppliers.Priviatravel.url)) return crawlPrivia
	if (link.includes(Suppliers.Tourvis.url)) return crawlTourvis
	if (link.includes(Suppliers.Kyte.url)) return crawlKyte
}

const crawl = async (page, crawlInfo) => {
	return classify(crawlInfo["url"])(page, crawlInfo)
}

export const run = async (queueUrl) => {
	await sqs.receiveMessage({
		MaxNumberOfMessages: 1,
		QueueUrl: queueUrl,
	}, async (err, data) => {
		if (err) {
			console.log("Receive Error", err);
		} else if (data.Messages) {
			for (const msg of data.Messages) {
				let resultData = []
				const crawlInfo = JSON.parse(msg.Body)
				console.log(crawlInfo)
				let browser = await getBrowser({devices: crawlInfo.devices});
				const context = await browser.contexts()[0]
				const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
				try {
					let crawlResult = await crawl(page, crawlInfo)
					for (let idx = 0; idx < crawlResult.length; idx++) {
						const hotel = crawlResult[idx]
						let item = {}
						item["rank"] = hotel["rank"] || null
						item["name"] = hotel["name"]
						item["price"] = parseInt(hotel["price"])
						item["identifier"] = hotel["identifier"]
						item["link"] = hotel["link"]
						item["checkinDate"] = crawlInfo["checkinDate"]
						item["checkoutDate"] = crawlInfo["checkoutDate"]
						item["keywordId"] = crawlInfo["keywordId"]
						item["createdAt"] = crawlInfo["createdAt"]
						item["supplierId"] = hotel["supplierId"]
						item["siteId"] = hotel['siteId']
						item["tag"] = hotel["tag"]
						item["price"] = !isNaN(item["price"]) ? item["price"] : 0;
						resultData.push(item)
					}
					console.log(resultData)
					console.log('length: ', resultData.length)
					if (resultData.length > 0){
						const fileName = crawlInfo["checkinDate"] + "_" + crawlInfo["keywordId"] + "_" + crawlResult[0]["supplierId"] + ".yaml";
						await fs.writeFileSync(fileName, yaml.dump(resultData), 'utf8');
						await uploadFileToS3(fileName)
						await fs.unlinkSync(fileName)
					}
					try {
						await deleteSqsMsg(msg.ReceiptHandle, queueUrl)
					} catch (e) {
						console.log(e)
					}
				} catch (e) {
					console.log("Error", msg.Body)
					console.log(e)
					if (queueUrl === process.env.AWS_SQS_HOTELFLY_LINK_URL){
						const stdout = execSync(`expressvpn disconnect && expressvpn connect ${getRandom(SERVERS)}`);
						console.log(stdout.toString())
					}
					await sleep(5)
				}
				const allPages = context.pages();
				for (let i = 1; i < allPages.length; i++) {
					await allPages[i].close()
				}
				// await browser.contexts()[0].clearCookies()
				await browser.close()
			}
		}
		await sleep(5)
		await run(queueUrl)
	})
}