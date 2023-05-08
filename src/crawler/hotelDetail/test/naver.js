import { getBrowser } from '../../../utils/playwright_browser.js'
import { crawl } from '../suppliers/naver.js'


const crawlInfo = {
	url: 'https://hotels.naver.com/list?placeFileName=place%3AGuam&adultCnt=2&checkIn=2023-06-24&checkOut=2023-06-25&includeTax=false&sortField=popularityKR&sortDirection=descending'
}

export const handle = async (crawlInfo, crawlFunction) => {
	let browser = await getBrowser({ devices: crawlInfo.devices })
	const context = browser.contexts()[0]
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()
	return await crawlFunction(page, crawlInfo)
}

console.log(await handle(crawlInfo, crawl))
