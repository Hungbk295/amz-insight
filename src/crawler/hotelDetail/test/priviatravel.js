import { getBrowser } from '../../../utils/playwright_browser.js'
import { crawl } from '../suppliers/priviatravel.js'

const crawlInfo = {
	url: 'https://hotel.priviatravel.com/view/us/unitedstates/hawaii-ohau-honolulu/astonwaikikisunset.html?hotelInFlowPath=B32&checkIn=2023-12-11&checkOut=2023-12-12&occupancies=1~1~0&htlMasterId=60990&salePrice=263537&h=10',
}

export const handle = async (crawlInfo, crawlFunction) => {
	let browser = await getBrowser({ devices: crawlInfo.devices })
	const context = browser.contexts()[0]
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()
	return await crawlFunction(page, crawlInfo)
}
console.log(await handle(crawlInfo, crawl))
