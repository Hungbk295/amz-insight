import {Sites} from "../../../config/suppliers.js";
import {sleep} from "../../../utils/util.js";

export class Privia {
    async crawl(page, crawlInfo) {
        let {link, ...common} = crawlInfo
        const path = this.getPath(link)
        const {discountPrice, detailPrice} = await this.crawlHelper(page, crawlInfo)

        return [{...common, link: path, price: parseInt(discountPrice.replaceAll(',', '')), siteId: Sites.detailDiscount.id},
            {...common, link: path, price: parseInt(detailPrice.replaceAll(',', '')), siteId: Sites.detail.id}]
    }

    async crawlLoggedIn(page, crawlInfo) {
        let {link, ...common} = crawlInfo
        const path = this.getPath(link)

        const {discountPrice, detailPrice} = await this.crawlHelper(page, crawlInfo)

        return [{
            ...common, link: path, price: parseInt(discountPrice.replaceAll(',', '')), siteId: Sites.discountDetailLoggedIn.id
        }, {...common, link: path, price: parseInt(detailPrice.replaceAll(',', '')), siteId: Sites.detailLoggedIn.id}]
    }

    getPath(link) {
        return link.split('.com/')[1]
    }

    async crawlHelper(page, crawlInfo) {
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

        return {discountPrice, detailPrice}
    }
}
