export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })
	const block = await page
		.locator(`//*[@id="showMap2"]/span[1]`)
		.elementHandle()

	const address = await block.innerText()
	const hotelId = crawlInfo['hotelId']
	return {
		hotelId,
		address,
	}
}


