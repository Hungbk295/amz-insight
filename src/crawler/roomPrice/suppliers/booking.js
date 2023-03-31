import { sleep, swapTimeUrl } from '../../../utils/util.js'

export const crawl = async (page, crawlInfo) => {
	try {
		const OPT = {
			lang: 'en',
			money: 'KRW',
		}

		let baseUrl = `${crawlInfo.url}?lang=${OPT.lang}&selected_currency=${OPT.money}`
		await page.goto(
			swapTimeUrl({
				baseUrl,
				startTime: crawlInfo.target_date,
				endTime: crawlInfo.next_date,
			}),
			{
				timeout: 60000,
			}
		)

		await sleep(4)

		const row = await page
			.locator(`//*[@id="hprt-table"]/tbody/tr[1]`)
			.elementHandle()

		const room_name = await (
			await row.$(`//td[1]/div/div[1]/a[2]/span`)
		).innerText()
		const room_price = await (
			await row.$(`//td[3]/div/div[1]/div[1]/div[2]/div/span[1]`)
		).innerText()

		const room_breakfast = await (
			await row.$(`//td[4]/div/ul/li[1]/div/div`)
		).innerText()

		let room_cancelable
		try {
			await (await row.$(`//td[4]/div/ul/li[2]/div/div/strong`)).innerText()

			room_cancelable = 'n'
		} catch {
			room_cancelable = 'y'
		}

		const hotel_address = await page
			.locator(`//*[@id="showMap2"]/span[1]`)
			.innerText()

		return {
			hotel_address,
			supplier_name: 'Booking',
			room_name,
			room_price: room_price.trim(),
			room_breakfast: room_breakfast.includes('included') ? 'y' : 'n',
			room_cancelable,
		}
	} catch (err) {
		console.log(err)
	}
}
