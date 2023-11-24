export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })

	const minPrice = await page
		.locator(`//span[contains(@class,'card-sale')]`).locator('xpath=..').locator(`em`)
		.innerText();

	const min_room_info = await (await page
		.locator(`//div[contains(@class,'room-tbl-cont')]/table/tbody/tr`)
		.elementHandles())[0]
	const minDetail = await (await min_room_info.$(`//div[contains(@class,'total-price-cnt')]/ul/li[2]/p[2]/em`)).innerText()

	console.log(minDetail)
	console.log(minPrice)

}
