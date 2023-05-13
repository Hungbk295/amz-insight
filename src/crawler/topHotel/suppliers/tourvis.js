import { scroll, sleep } from '../../../utils/util.js'
import _ from 'lodash'

export const crawl = async (page, crawlInfo) => {
	let data = []
	await page.on('response', async response => {
		const urls = await response.url()
		if (
			urls.includes('supplier/hotels/price?searchType') &&
			response.status() === 200
		) {
			let res = await response.json()

			data = data.concat(res.hotelFareList)
		}
	})

	await page.goto(crawlInfo['url'], { timeout: 60000 })

	await sleep(6)
	const handle = item => {
		const { htlMasterId, htlNameKr, htlNameEn, salePrice, addr } = item
		return {
			name: htlNameKr,
			nameEn: htlNameEn,
			// phone: null,
			price: salePrice,
			supplierId: 8,
			identifier: htlMasterId + '',
			checkinDate: crawlInfo['checkinDate'],
			checkoutDate: crawlInfo['checkoutDate'],
			address: addr,
			link: `/hotels/${htlMasterId}`,
		}
	}

	return _.map(data.slice(0, 30), handle)
}
