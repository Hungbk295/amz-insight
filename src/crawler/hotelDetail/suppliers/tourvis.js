import { sleep } from '../../../utils/util.js'
import {Privia} from "./privia.js";
import { SUPPLIERS } from '../../../config/suppliers.js'
import {disableLoadImage} from "../../../utils/browserManager.js";

export class Tourvis extends Privia {
    async crawlHelper(page, task) {
        await disableLoadImage(page)
        await page.goto(SUPPLIERS.Tourvis.link + task['link'], {timeout: 60000})

        await sleep(15)
        let discountPrice = '0'
        let detailPrice = '0'
        try{
            discountPrice = await page.locator(`.content.detail.room .cost`).innerText();
        }
        catch{}
        try {
            discountPrice = await (await page.locator(`.detail-top-sec .product-info-item .top .sale span`)).innerText();
        } catch (e) {
        }
        try {
            detailPrice = await(await page.locator(`.detail-top-sec .product-info-item .top .price span:nth-child(2)`)).innerText();
        } catch (e) {
            
        }
        try {
            detailPrice = (await page.locator(`.content.detail.room .ori-price`).innerText()).replace('원', '');
        } catch (e) {
            
        }

        return {discountPrice, detailPrice}
    }

    getHotelDetailLink(task) {
        return `hotels/${task['identifier']}`;
    }
}
