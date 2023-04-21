import { scroll, sleep } from '../../../utils/util.js'
import _ from 'lodash'
import { getNumberInString } from '../../../utils/stringHandle.js'

export const crawl = async (page, crawlInfo) => {
	let data = []

	await page.goto(crawlInfo['url'], { timeout: 60000 })
	await sleep(5)
	await page.mouse.wheel(0, 45000)
	await sleep(2)
	const hotelRoot = await page
		.locator(`//*[@id="poduct_list_area"]`)
		.elementHandle()

	const listHotel = await hotelRoot.$$('li')
	for (const item of listHotel) {
		const name = await (await item.$('.name strong')).innerText()
		const price = await (await item.$('.price p>b')).innerText()
		const link = await (await item.$('a')).getAttribute('href')
		const identifier = await (await item.$('a')).getAttribute('data-ano')

		// console.log(price)

		data.push({
			name,
			// nameEn: null,
			price: getNumberInString(price),
			checkinDate: crawlInfo['checkinDate'],
			checkoutDate: crawlInfo['checkoutDate'],
			link,
			// phone: null,
			supplierId: 9,
			// address: null,
			identifier,
		})
	}
	await sleep(15)

	return data.slice(0, 30)
}
