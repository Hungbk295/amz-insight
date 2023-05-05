import { scroll, sleep } from '../../../utils/util.js'

export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })
	await sleep(15)

	await page.evaluate(scroll, { direction: 'down', speed: 'slow' })

	const hotels = []
	const hotel_infos = await page
		.locator(`//ol[contains(@class,'hotel-list-container')]/li`)
		.elementHandles()
	for (const info of hotel_infos) {
		const hotel = {}
		try {
			const hotel_name = await (
				await info.$(`//h3[contains(@data-selenium,'hotel-name')]`)
			).innerText()
			const hotel_price = await (
				await info.$(`//span[contains(@data-selenium,'display-price')]`)
			).innerText()
			const hotel_link = await (await info.$(`//div/a`)).getAttribute('href')
			const hotel_unique = hotel_link.split('/')[2]
			hotel.name = hotel_name
			hotel.price = hotel_price.replace(/[^0-9]/g, '')
			hotel.identifier = hotel_unique
			hotel.link = hotel_link
			hotel.supplierId = 2
			hotel.checkinDate = crawlInfo.checkinDate
			hotel.checkoutDate = crawlInfo.checkoutDate
			hotels.push(hotel)
		} catch (e) {}
	}

	return hotels.slice(0, 40)
}
