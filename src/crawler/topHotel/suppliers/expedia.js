import {scroll, sleep} from '../../../utils/util.js'
import {Suppliers} from "../../../constants/suppliers.js";

export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })
	await sleep(30)
	try {
		await page.locator(`//button[contains(@data-stid,'show-more-results')]`).click({timeout: 10000})
		await sleep(10)
	} catch (e) {
	}
	await page.evaluate(scroll, { direction: 'down', speed: 'slow' })
	await sleep(2)

	const hotel_infos = await page
		.locator(`//div[contains(@data-stid,'lodging-card-responsive')]`)
		.elementHandles()
	const hotels = []
	for (const info of hotel_infos) {
		const hotel = {}
		try {
			const hotel_name = await (await info.$(`//div/h3[contains(@class, 'uitk-heading')]`)).innerText();
			let hotel_price = (await info.innerText()).match(
				/(₩((\d|,)+)\/1박)|(총 요금: ₩((\d|,)+))/gi
			)
			hotel_price = hotel_price && hotel_price.length > 0 ? hotel_price[0] : '0'
			const hotel_link = await (
				await info.$(`//a[contains(@data-stid,'open-hotel-information')]`)
			).getAttribute('href')
			const hotel_unique = hotel_link
				.match(/\.(h\d+)\./gi)[0]
				.replaceAll('.', '')
			const hotel_tag = hotel_link.split(".")[0].replace("/", "")

			hotel.name = hotel_name
			hotel.price = hotel_price.replace('1박', '').replace(/[^0-9]/g, '')
			hotel.identifier = hotel_unique
			hotel.link = hotel_link
			hotel.tag = hotel_tag
			hotel.checkinDate = crawlInfo['checkinDate']
			hotel.checkinDate = crawlInfo['checkoutDate']
			hotel.supplierId = Suppliers.Expedia.id
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
