import {getBrowser} from "../../utils/playwright_browser.js";
import {crawl} from "../topHotel/suppliers/expedia.js";

export const handle = async (crawlInfo) => {
    let browser = await getBrowser();
    const context = await browser.contexts()[0]
    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage()
    await crawl(page, crawlInfo)
}