export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })
	const block = await page
		.locator(`//*[@data-stid="content-hotel-address"]`)
		.elementHandle()
	const address = await block.innerText()
	return {
		address,
	}
}

export const getIdentifier = url => {
	return {
		identifier: url.split('/')[3].split('.')[0],
		identifier_id: url.split('/')[3].split('.')[1],
	}
}

