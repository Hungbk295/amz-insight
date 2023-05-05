export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })
	const block = await page
		.locator(`//*[@id="showMap2"]/span[1]`)
		.elementHandle()

	const address = await block.innerText()
	return {
		address,
	}
}

export const getIdentifier = url => {
	return {
		identifier: url.split('/')[5].split('.')[0],
		identifier_id: url.split('aid=')[2].split('&')[0]
	}
}


