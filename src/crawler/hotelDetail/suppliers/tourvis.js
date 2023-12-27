import {sleep} from "../../../utils/util.js";
import {Privia} from "./privia.js";
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Tourvis extends Privia {
    async crawlHelper(page, task) {
        await page.goto(SUPPLIERS.Tourvis.link + task['link'], {timeout: 60000})
        await sleep(20)
        let discountPrice = '0'
        try {
            discountPrice = await page.locator(`.content.detail.room .cost`).innerText();
        } catch (e) {
        }
        let detailPrice = '0'
        try {
            detailPrice = await page.locator(`.content.detail.room .ori-price`).innerText();
            detailPrice = detailPrice.replace('원', '')
        } catch (e) {
        }

        return {discountPrice, detailPrice}
    }

    getHotelDetailLink(task) {
        return `hotels/${task['identifier']}`;
    }
}
