import { scroll, sleep } from '../../../utils/util.js'
import _ from 'lodash'

export const crawl = async (page, crawlInfo) => {
	let data = []
	await page.on('response', async response => {
		const urls = await response.url()
		if (urls.includes('search?advert=KEYWORD') && response.status() === 200) {
			let res = await response.json()
			data = data.concat(res.motels.lists)
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
			// nameEn: null,
			// phone: null,
			price: displayPrices[0].rawDiscountPrice,
			supplierId: 10,
			identifier: key,
			checkinDate: crawlInfo['checkinDate'],
			checkoutDate: crawlInfo['checkoutDate'],
			// address: null,
			link: `https://place-site.yanolja.com/places/${key}`,
		}
	}

	return _.map(data, handle).slice(0, 30)
}
