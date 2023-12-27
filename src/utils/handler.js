import {getBrowser} from "./browserManager.js";
import {getConfigBySupplierId} from "../config/suppliers.js";

export const handle = async (task, crawlInstance) => {
	let browser = await getBrowser(getConfigBySupplierId(task.supplierId))
	const context = await browser.contexts()[0]
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()
	const res = await crawlInstance.crawl(page, task)
	await browser.close()
	return res
}
