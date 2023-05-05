export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })
	const block = await page
		.locator(`//*[@id="property-main-content"]`)
		.elementHandle()

	const address = await (
		await block.$(`.HeaderCerebrum__Location`)
	).innerText()
	return {
		address,
	}
}

export const getIdentifier = url => {
	return {
		identifier: link.split('/')[2],
		identifier_id: null
	}
}
