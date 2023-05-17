import { sleep } from '../../../utils/util.js'
import _ from 'lodash'
import {Suppliers} from "../../../constants/suppliers.js";

export const crawl = async (page, crawlInfo) => {
	let data = []
	// const client = await page.context().newCDPSession(page);
	// await client.send('Page.setLifecycleEventsEnabled', { enabled: true });
	// await client.send('Network.enable', {
	// 	maxResourceBufferSize: 1024 * 1204 * 100,
	// 	maxTotalBufferSize: 1024 * 1204 * 200,
	// });
	await page.on('response', async response => {
		const urls = await response.url()
		if (urls.includes('price?') &&
			response.status() === 200) {
			let res = await response.json()
			data = data.concat(res.hotelFareList)
		}
	})

	await page.goto(crawlInfo['url'], { timeout: 300000 })

	// await sleep(2)
	await sleep(60)

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
			supplierId: Suppliers.Priviatravel.id,
			identifier: htlMasterId + "",
			tag: htlNameEn,
			checkinDate: crawlInfo['checkinDate'],
			checkoutDate: crawlInfo['checkoutDate'],
			link: link,
		}
	}

	return _.map(data.slice(0, 30), handle)
}

