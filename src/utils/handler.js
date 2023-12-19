import {getBrowser} from "./browserManager.js";
import {classify} from "./crawling.js";

export const handle = async (crawlInfo, crawlFunction) => {
	let browser = await getBrowser(classify(crawlInfo.url).id)
	const context = await browser.contexts()[0]
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()
	const res = await crawlFunction(page, crawlInfo)
	await browser.close()
	return res
}
