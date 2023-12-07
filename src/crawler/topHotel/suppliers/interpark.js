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
	await sleep(15)

	const handle = item => {
		const { goodsname, price, id, mobile_coupon_price } = item

		return {
			name: goodsname,
			price: mobile_coupon_price,
			supplierId: 8,
			identifier: id,
			checkinDate: crawlInfo['checkinDate'],
			checkoutDate: crawlInfo['checkoutDate'],
			link: `/checkinnow/goods/${id}`,
		}
	}

	const hotels = _.map(data, handle);
	hotels.forEach((item, index) => {
		item.rank = index + 1;
	})
	return hotels
}
