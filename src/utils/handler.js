import {getBrowser} from "./browserManager.js";
import {classify} from "./crawling.js";
import {getConfigBySupplierId} from "../config/suppliers.js";

export const handle = async (crawlInfo, crawlInstance) => {
	let browser = await getBrowser(getConfigBySupplierId(classify(crawlInfo.url).id))
	const context = await browser.contexts()[0]
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()
	const res = await crawlInstance.crawl(page, crawlInfo)
	await browser.close()
	return res
}
