import { scroll, sleep } from '../../../utils/util.js'
import _ from 'lodash'

export const crawl = async (page, crawlInfo) => {
	let data = []
	await page.on('response', async response => {
		const urls = await response.url()
		if (
			urls.includes('https://kr.trip.com/htls/getHotelList') &&
			response.status() === 200
		) {
			let res = await response.json()

			data = data.concat(res.hotelList)
		}
	})

	await page.goto(crawlInfo['url'], { timeout: 60000 })
	await sleep(8)

	try {
		await page.locator('//*[@type="ic_popups_close"]').click()
	} catch {}
	await page.evaluate(scroll, { direction: 'down', speed: 'slow' })
	await sleep(3)
	await page.evaluate(scroll, { direction: 'down', speed: 'slow' })
	await sleep(3)
	await page.evaluate(scroll, { direction: 'down', speed: 'slow' })
	await sleep(20)

	const handle = item => {
		const { hotelBasicInfo } = item

		return {
			name: hotelBasicInfo.hotelName,
			nameEn: hotelBasicInfo.hotelEnName,
			phone: null,
			price: hotelBasicInfo.price,
			supplierId: 3,
			identifier: hotelBasicInfo.hotelId,
			checkinDate: crawlInfo['checkinDate'],
			checkoutDate: crawlInfo['checkoutDate'],
			address: hotelBasicInfo.hotelAddress,
			link: `/detail/?hotelId=${hotelBasicInfo.hotelId}`,
		}
	}

	return _.map(data.slice(0, 30), handle)
}
