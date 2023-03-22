import {
	checkBreakfast,
	checkCancelable,
	scroll,
	sleep,
} from '../../utils/util.js'

export const crawl = async (page, crawlInfo) => {
	const OPT = {
		lang: 'en',
		money: 'KWD',
	}
	await page.goto(
		`${crawlInfo.url}?lang=${OPT.lang}&selected_currency=${OPT.money}&checkin=${crawlInfo.target_date}&checkout=${crawlInfo.next_date}`
	)
	await sleep(4)
	let listRoom = []

	const rows = await page
		.locator(`//*[@id="hprt-table"]/tbody/tr`)
		.elementHandles()

	for (const index in rows) {
		const row = rows[index]
		try {
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
				await (
					await row.$(`//td[4]/div/ul/li[2]/div/div/strong`)
				).innerText()

				room_cancelable = 'no'
			} catch {
				room_cancelable = 'yes'
			}

			const hotel_address = await page
				.locator(`//*[@id="showMap2"]/span[1]`)
				.innerText()
			listRoom = [
				...listRoom,
				{
					hotel_address,
					supplier_name: 'Booking',
					room_name,
					room_price: room_price.trim(),
					room_breakfast: room_breakfast.includes('included')
						? 'yes'
						: 'no',
					room_cancelable,
				},
			]
		} catch {}
	}

	return listRoom

	// return result
}
