import {getContext} from "./browserManager.js";
import { getConfigBySupplierId, INTERNAL_SUPPLIER_IDS, SUPPLIERS } from '../config/suppliers.js'

export const handle = async (task, crawlInstance) => {
	const browser = await getContext(getConfigBySupplierId(task.supplierId))
	const page = await (INTERNAL_SUPPLIER_IDS.includes(getConfigBySupplierId(task.supplierId).id) ? browser.pages()[0] : (await browser.contexts()[0]).pages()[0])
	const res = await crawlInstance.crawl(page, task)
	await browser.close()
	return res
}
