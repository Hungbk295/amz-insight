export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })

	await page.locator('//article/div[2]/div/div[1]/div/button[2]').click()
	const block = await page
		.locator(`//*[@data-testid="sub-content"]/div[2]`)
		.elementHandle()

	// const address = await block.$('font')

	const address = await block.innerText()
	const hotelId = crawlInfo['hotelId']
	return {
		hotelId,
		address,
	}
}
