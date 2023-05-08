export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })

	// await page.locator('//article/div[2]/div/div[1]/div/button[2]').click()
	const block = await page
		.locator(`//*[@id="content"]/div[1]/div[2]/div[1]`)
		.elementHandle()

	const address = await (await block.$('.address')).innerText()
	const hotelId = crawlInfo['hotelId']
	return {
		hotelId,
		address,
	}
}
