import { addCookieTourvis, sleep } from '../../../utils/util.js'
import _ from 'lodash'
import { SUPPLIERS } from '../../../config/suppliers.js'
import { Privia } from './privia.js'
import { Tourvis as TourvisGenerator } from '../../../linkGenerator/suppliers/tourvis.js'
import { disableLoadImage } from '../../../utils/browserManager.js'

export class Tourvis extends Privia {
	constructor() {
		super()
		this.detailTasksGenerator = new TourvisGenerator()
	}

	async crawl(page, task) {
		await disableLoadImage(page)
		let data = []
		await page.route('**/hotel/api/search/price', async route => {
			const response = await route.fetch()
			const json = await response.json()
			data = data.concat(json.hotelFareList)
			await route.fulfill({ response, json })
		})
		await addCookieTourvis(page)
		await page.goto(SUPPLIERS.Tourvis.link + task['link'], { timeout: 60000 })
		await sleep(50)
		const handle = item => {
			const { htlMasterId, htlNameKr, htlNameEn, salePrice, addr } = item
			return {
				name: htlNameKr,
				nameEn: htlNameEn,
				price: salePrice,
				supplierId: SUPPLIERS.Tourvis.id,
				identifier: htlMasterId + '',
				checkIn: task['checkIn'],
				checkOut: task['checkOut'],
				address: addr,
				link: `hotels/${htlMasterId}`,
			}
		}

		const hotels = _.map(data.slice(0, 100), handle)
		hotels.forEach((item, index) => {
			item.rank = index + 1
		})
		return hotels
	}
}