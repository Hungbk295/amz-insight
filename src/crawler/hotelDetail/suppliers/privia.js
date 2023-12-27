import {SITES, SUPPLIERS} from "../../../config/suppliers.js";
import {sleep} from "../../../utils/util.js";

export class Privia {
    async crawl(page, crawlInfo) {
        const {discountPrice, detailPrice} = await this.crawlHelper(page, crawlInfo)
        const link = this.getHotelDetailLink(crawlInfo)

        return [{...crawlInfo, link, price: parseInt(discountPrice.replaceAll(',', '')), siteId: SITES.detailDiscount.id},
            {...crawlInfo, link, price: parseInt(detailPrice.replaceAll(',', '')), siteId: SITES.detail.id}]
    }

    async crawlLoggedIn(page, crawlInfo) {
        const {discountPrice, detailPrice} = await this.crawlHelper(page, crawlInfo)
        const link = this.getHotelDetailLink(crawlInfo)

        return [{
            ...crawlInfo, link, price: parseInt(discountPrice.replaceAll(',', '')), siteId: SITES.discountDetailLoggedIn.id
        }, {...crawlInfo, link, price: parseInt(detailPrice.replaceAll(',', '')), siteId: SITES.detailLoggedIn.id}]
    }

    getHotelDetailLink(crawlInfo) {
        return crawlInfo['link'].split('?')[0]
    }

    async crawlHelper(page, crawlInfo) {
        await page.goto(SUPPLIERS.Privia.link + crawlInfo['link'], {timeout: 60000})
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

        return {discountPrice, detailPrice}
    }
}
