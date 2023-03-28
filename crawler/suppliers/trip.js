
import { sleep, swapTimeUrl } from '../../utils/util.js'
import parseUrl from 'parse-url'

export const crawl = async (page, crawlInfo) => {
	try {
		const OPT = {
			locale: 'en_xx',
			money: 'KRW',
		}
		let baseUrl = crawlInfo.url
		const { curr, locale } = parseUrl(crawlInfo.url).query

		curr
			? (baseUrl = baseUrl.replace(curr, OPT.money))
			: (baseUrl = baseUrl + `&${OPT.money}`)
		locale
			? (baseUrl = baseUrl.replace(locale, OPT.locale))
			: (baseUrl = baseUrl + `&${OPT.locale}`)
		// console.log({
		// 	curr,
		// 	locale,
		// })

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
		await sleep(10)
		await page.click(`//*[@id="hotel_searchBox"]/ul/li[5]/div`)
		await sleep(4)

		const room = await page
			.locator(`//html/body/div[3]/section/article/div/div[5]/div[4]/div[2]`)
			.elementHandle()
		const hotel_address = await page
			.locator(
				`//*[@id="ibu-hotel-detail-head"]/div/div[1]/div[1]/div[2]/div[1]/span[1]`
			)
			.innerText()
		const room_name = await (await room.$(`.room-name`)).innerText()

		const room_breakfast = await (
			await room.$(`//div[2]/div[2]/div[2]/div[1]/div[2]/span`)
		).innerText()

		const room_price = await (
			await room.$(`//div[2]/div[2]/div[2]/div[3]/div[1]/div[2]/div[2]`)
		).innerText()

		const room_cancelable = await (
			await room.$(`//div[2]/div[2]/div[2]/div[1]/div[2]/span`)
		).innerText()
		return {
			hotel_address,
			supplier_name: 'trip',
			room_name,
			room_price,
			room_breakfast: room_breakfast.includes('Includes') ? 'y' : 'n',
			room_cancelable: room_cancelable.includes('Free cancellation')
				? 'y'
				: 'n',
		}
	} catch (err) {
		console.log(err)
	}
}

