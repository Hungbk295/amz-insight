import { SCRIPT_PRIVIA_TOURVIS, SITES, SUPPLIERS } from '../../../config/suppliers.js'
import {sleep} from "../../../utils/util.js";
import {disableLoadImage} from "../../../utils/browserManager.js";

export class Privia {
    async crawl(page, task) {
        const {discountPrice, detailPrice} = await this.crawlHelper(page, task)
        const link = this.getHotelDetailLink(task)

        return [{...task, link, price: parseInt(discountPrice.replaceAll(',', '')), siteId: SITES.detailDiscount.id},
            {...task, link, price: parseInt(detailPrice.replaceAll(',', '')), siteId: SITES.detail.id}]
    }

    async crawlLoggedIn(page, task) {
        const {discountPrice, detailPrice} = await this.crawlHelper(page, task)
        const link = this.getHotelDetailLink(task)

        return [{
            ...task, link, price: parseInt(discountPrice.replaceAll(',', '')), siteId: SITES.discountDetailLoggedIn.id
        }, {...task, link, price: parseInt(detailPrice.replaceAll(',', '')), siteId: SITES.detailLoggedIn.id}]
    }

    getHotelDetailLink(task) {
        return task['link'].split('?')[0]
    }

    async crawlHelper(page, task) {
        await disableLoadImage(page)
        await page.goto(SUPPLIERS.Privia.link + task['link'], {timeout: 120000})
        await page.evaluate((script) => {
            eval(script);
        }, SCRIPT_PRIVIA_TOURVIS);
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
