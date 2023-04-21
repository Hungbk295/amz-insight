import { scroll, sleep } from '../../../utils/util.js'
import _ from 'lodash'

export const crawl = async (page, crawlInfo) => {
	let data = []
	await page.on('response', async response => {
		const urls = await response.url()
		if (urls.includes('getSearchList') && response.status() === 200) {
			let res = await response.json()

			data = data.concat(res.data.itemlist)
		}
	})

	await page.goto(crawlInfo['url'], { timeout: 60000 })
	await sleep(5)
	await page.mouse.wheel(0, 15000)
	await sleep(5)
	await page.mouse.wheel(15000, 45000)

	// await page.evaluate(scroll, { direction: 'down', speed: 'fas' })
	// await sleep(3)
	// await page.evaluate(scroll, { direction: 'down', speed: 'fas' })
	// await sleep(3)

	// await sleep(3)
	// await page.evaluate(scroll, { direction: 'down', speed: 'slow' })
	await sleep(15)

	// console.log(data.length)
	const handle = item => {
		const { goodsname, price, id, mobile_coupon_price } = item

		return {
			name: goodsname,
			nameEn: null,
			phone: null,
			price: mobile_coupon_price,
			supplierId: 8,
			identifier: id,
			checkinDate: crawlInfo['checkinDate'],
			checkoutDate: crawlInfo['checkoutDate'],
			address: null,
			link: `/checkinnow/goods/${id}`,
		}
	}

	return _.map(data, handle)
}
