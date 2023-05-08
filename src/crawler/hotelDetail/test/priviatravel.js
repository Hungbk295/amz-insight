import { getBrowser } from '../../../utils/playwright_browser.js'
import { crawl } from '../suppliers/priviatravel.js'

const crawlInfo = {
	url: 'https://hotel.priviatravel.com/view/kr/korea/seoul/theshillaseoul.html?hotelInFlowPath=B37&checkIn=2023-04-27&checkOut=2023-04-28&occupancies=1~1~0&htlMasterId=55143&salePrice=1085526&h=1',
}

export const handle = async (crawlInfo, crawlFunction) => {
	let browser = await getBrowser({ devices: crawlInfo.devices })
	const context = browser.contexts()[0]
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()
	return await crawlFunction(page, crawlInfo)
}

console.log(await handle(crawlInfo, crawl))
