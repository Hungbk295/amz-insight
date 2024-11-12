import { SITES, SUPPLIERS } from '../../../config/suppliers.js'
import { sleep } from '../../../utils/util.js'
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
        await page.goto(SUPPLIERS.Privia.link + task['link'], {timeout: 60000})
        await sleep(15)
        let discountPrice = '0'
        let detailPrice = '0'
        try {
            discountPrice=await (await page.$('.rcs-price-box .room-salePrice-cont .price .cost')).innerText()
        } catch (e) {
        }
        
        try {
            detailPrice=await (await page.$('.rcs-price-box .room-price-cont .price .cost')).innerText()
        } catch (e) {
        }

        return {discountPrice, detailPrice}
    }
}
