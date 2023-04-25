export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })
	const block = await page
		.locator(`//table[@class="tableInfo"]/tbody/tr[4]/td`)
		.elementHandle()

	const address = await block.innerText()

	return {
		address,
	}
}
