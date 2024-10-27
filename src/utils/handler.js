import {getContext} from "./browserManager.js";
import {getConfigBySupplierId} from "../config/suppliers.js";

export const handle = async (task, crawlInstance) => {
	const browser = await getContext(getConfigBySupplierId(task.supplierId));
	const context = browser.contexts()[0]
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()
	const res = await crawlInstance.crawl(page, task)
	// await context.close()
	return res
}
