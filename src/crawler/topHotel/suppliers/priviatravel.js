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

			data = data.concat(res.hotelFareList)
		}
	})

	await page.goto(crawlInfo['url'], { timeout: 60000 })
	// await sleep(2)
	await sleep(20)

	const handle = item => {
		const { htlNameKr, salePrice, htlMasterId, addr, htlNameEn } = item
		let [urlPartInLink, queryPartInLink] = crawlInfo["url"].split("?")
		urlPartInLink = urlPartInLink.replace(/[^/]+$/, `${htlNameEn.replaceAll(" ", "").toLowerCase()}.html`).split(".com/")[1]
		queryPartInLink = queryPartInLink.replace(/destinationType(.*)/g, `htlMasterId=${htlMasterId}`)
		const link = urlPartInLink + "?" + queryPartInLink
		return {
			name: htlNameKr,
			nameEn: htlNameEn,
			// phone: null,
			address: addr,
			price: salePrice,
			supplierId: 7,
			identifier: htlMasterId,
			checkinDate: crawlInfo['checkinDate'],
			checkoutDate: crawlInfo['checkoutDate'],
			link: link,
		}
	}

	return _.map(data.slice(0, 30), handle)
}

