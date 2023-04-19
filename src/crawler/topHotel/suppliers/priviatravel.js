import { scroll, sleep } from '../../../utils/util.js'
import _ from 'lodash'

export const crawl = async (page, crawlInfo) => {
	let data = []
	await page.on('response', async response => {
		const urls = await response.url()
		if (
			urls.includes('price?loginYn=N&hccAuthYn') &&
			response.status() === 200
		) {
			let res = await response.json()

			// console.log(res.hotelFareList.length)

			data = data.concat(res.hotelFareList)
		}
	})

	await page.goto(crawlInfo['url'], { timeout: 60000 })
	await sleep(20)

	const handle = item => {
		const { htlNameKr, salePrice, htlMasterId } = item

		return {
			name: htlNameKr,
			price: salePrice,
			supplierId: 7,
			identifier: htlMasterId,
			checkinDate: crawlInfo['checkinDate'],
			checkoutDate: crawlInfo['checkoutDate'],
			link: `/view`,
		}
	}
	// console.log(data.length)

	return _.map(data.slice(0, 30), handle)
}
