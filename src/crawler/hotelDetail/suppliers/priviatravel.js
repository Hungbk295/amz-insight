import {Sites} from "../../../constants/suppliers.js";
import {sleep} from "../../../utils/util.js";

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo['link'], {timeout: 60000})
    await sleep(30)
    let discountPrice = '0'
    try {
        discountPrice = await page.locator(`//span[contains(@class,'card-sale')]`).locator('xpath=..').locator(`em`).innerText();
    } catch (e) {
    }
    let detailPrice = '0'
    try {
        const lowestPriceRoom = await (await page
            .locator(`//div[contains(@class,'room-tbl-cont')]/table/tbody/tr`)
            .elementHandles())[0]
        detailPrice = await (await lowestPriceRoom.$(`//div[contains(@class,'total-price-cnt')]/ul/li[2]/p[2]/em`)).innerText()
    } catch (e) {
    }
    return [
        {...crawlInfo, price: parseInt(discountPrice.replaceAll(',', '')), siteId: Sites.detailDiscount.id},
        {...crawlInfo, price: parseInt(detailPrice.replaceAll(',', '')), siteId: Sites.detail.id}
    ]
}

