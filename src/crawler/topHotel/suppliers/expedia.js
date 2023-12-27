import {scroll, sleep} from '../../../utils/util.js'
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Expedia {
	async crawl(page, task) {
		await page.goto(SUPPLIERS.Expedia.link + task['link'], {timeout: 60000})
		await sleep(30)
		try {
			await page.locator(`//button[contains(@data-stid,'show-more-results')]`).click({timeout: 10000})
			await sleep(10)
		} catch (e) {
		}
		await page.evaluate(scroll, {direction: 'down', speed: 'slow'})
		await sleep(2)

		const hotelInfos = await page
			.locator(`//div[contains(@data-stid,'lodging-card-responsive')]`)
			.elementHandles()
		const hotels = []
		for (const info of hotelInfos) {
			const hotel = {}
			try {
				const hotelName = await (await info.$(`//div/h3[contains(@class, 'uitk-heading')]`)).innerText();
				let hotelPrice = (await info.innerText()).match(
					/(₩((\d|,)+)\/1박)|(총 요금: ₩((\d|,)+))/gi
				)
				hotelPrice = hotelPrice && hotelPrice.length > 0 ? hotelPrice[0] : '0'
				const hotelLink = await (
					await info.$(`//a[contains(@data-stid,'open-hotel-information')]`)
				).getAttribute('href')
				const hotelUnique = hotelLink
					.match(/\.(h\d+)\./gi)[0]
					.replaceAll('.', '')
				const hotelTag = hotelLink.split(".")[0].replace("/", "")

				hotel.name = hotelName
				hotel.price = hotelPrice.replace('1박', '').replace(/[^0-9]/g, '')
				hotel.identifier = hotelUnique
				hotel.link = hotelLink.substring(1)
				hotel.tag = hotelTag
				hotel.checkinDate = task['checkinDate']
				hotel.checkinDate = task['checkoutDate']
				hotel.supplierId = SUPPLIERS.Expedia.id
				hotels.push(hotel)
			} catch (e) {
				console.log(e)
			}
		}

		hotels.forEach((item, index) => {
			item.rank = index + 1;
		})
		return hotels.slice(0, 100)
	}
}