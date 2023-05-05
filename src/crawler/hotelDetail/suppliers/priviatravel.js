import { getNumberInString } from '../../../utils/stringHandle.js'
import { sleep } from '../../../utils/util.js'

export const crawl = async (page, crawlInfo) => {
	await page.goto(crawlInfo['url'], { timeout: 60000 })

	await sleep(8)
	const block = await page
		.locator(`//*[@id="o-view-tab-detail"]`)
		.elementHandle()

	const address = await (await block.$(`.htp-loca`)).innerText()
	const phone = await (await block.$(`.hs-info`)).innerText()
	return {
		address,
		phone: getNumberInString(phone).trim(),
	}
}

export const getIdentifier = url => {
	return {
		identifier: url.split('&')[0].split('%3A')[1],
		identifier_id: null
	}
}
