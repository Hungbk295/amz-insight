import {getContext} from "./browserManager.js";
import {getConfigBySupplierId} from "../config/suppliers.js";

export const handle = async (task, crawlInstance) => {
	const context = await getContext(getConfigBySupplierId(task.supplierId));
	const page =
		context.pages().length > 0 ? context.pages()[0] : await context.newPage()
	const res = await crawlInstance.crawl(page, task)
	// await context.close()
	return res
}
