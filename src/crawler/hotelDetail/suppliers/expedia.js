export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })
	const block = await page
		.locator(`//*[@data-stid="content-hotel-address"]`)
		.elementHandle()
	const address = await block.innerText()
	const hotelId = crawlInfo['hotelId']
	return {
		hotelId,
		address,
	}
}

