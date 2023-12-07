import { sleep } from '../../../utils/util.js'
import _ from 'lodash'

export const crawl = async (page, crawlInfo) => {
	let data = []
	await page.on('response', async response => {
		const urls = await response.url()
		if (urls.includes('search?advert=KEYWORD') && response.status() === 200) {
			let res = await response.json()
			data = data.concat(res.accommodations.items)
		}
	})

	await page.goto(crawlInfo['url'], { timeout: 60000 })
	await sleep(2)
	await page.mouse.wheel(0, 45000)

	await sleep(10)

	const handle = item => {
		const { name, displayPrices, key } = item

		return {
			name,
			price: displayPrices[0].rawDiscountPrice,
			supplierId: 10,
			identifier: key,
			checkinDate: crawlInfo['checkinDate'],
			checkoutDate: crawlInfo['checkoutDate'],
			link: `https://place-site.yanolja.com/places/${key}`,
		}
	}

	const hotels = _.map(data, handle).slice(0, 30)
	hotels.forEach((item, index) => {
		item.rank = index + 1;
	})
	return hotels;
}
