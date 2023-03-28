import {
	deleteSqsMsg,
	getRandom,
	sleep,
	sqs,
	takeScreenshot,
} from '../../utils/util.js'
import { crawlerList, classify } from '../crawler.js'
import { getBrowser } from '../../utils/playwright_browser.js'
import { execSync } from 'child_process'
import { SERVERS } from '../config/expressvpn.js'

const crawl = async (page, crawlInfo) => {
	return crawlerList[classify(crawlInfo['url'])](page, crawlInfo)
}

const tasks = [
	{
		id: '74669',
		target_date: '2023-03-23',
		next_date: '2023-03-24',
		url: 'https://www.booking.com/hotel/vn/dai-an-phu-villa.ko.html',
	},
	{
		id: '74669',
		target_date: '2023-03-23',
		next_date: '2023-03-24',
		url: 'https://www.booking.com/hotel/vn/green-hill-thanh-pho-hoi-an.ko.html',
	},
]
const main = async () => {
	let browser = await getBrowser()
	const context = browser.contexts()[0]
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()

	for (const crawlInfo of tasks) {
		let data = []
		try {
			let crawlResult = await crawl(page, crawlInfo)
			console.log(crawlResult)
		} catch (e) {
			console.log("Can't crawl", crawlInfo)
			console.log(e)
			await sleep(10)
			await browser.close()
			const stdout = execSync(
				`expressvpn disconnect && expressvpn connect ${getRandom(SERVERS)}`
			)
			console.log(stdout)
			await sleep(5)
			browser = await getBrowser()
			await sleep(5)
		}
	}
	// await sleep(400)
	await browser.close()
	console.log('Finish crawling')
}
main()
