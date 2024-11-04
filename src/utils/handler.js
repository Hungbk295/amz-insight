import {getContext} from "./browserManager.js";
import { getConfigBySupplierId, INTERNAL_SUPPLIER_IDS, SUPPLIERS } from '../config/suppliers.js'

export const handle = async (task, crawlInstance) => {
    let browser = await getContext(getConfigBySupplierId(task.supplierId))
    const page =
        browser.contexts()[0].pages()[0]

	const res = await crawlInstance.crawl(page, task)
	await browser.close()
	return res
}
