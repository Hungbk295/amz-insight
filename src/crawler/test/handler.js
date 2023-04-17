import {getBrowser} from "../../utils/playwright_browser.js";


export const handle = async (crawlInfo, crawlFunction) => {
    let browser = await getBrowser();
    const context = await browser.contexts()[0]
    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage()
    return await crawlFunction(page, crawlInfo)
}