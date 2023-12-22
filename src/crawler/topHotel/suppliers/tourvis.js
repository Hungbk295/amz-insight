import {sleep} from '../../../utils/util.js'
import _ from 'lodash'
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Tourvis {
    async crawl(page, crawlInfo) {
        let data = []
        await page.on('response', async response => {
            const urls = await response.url()
            if (urls.includes('supplier/hotels/price?searchType') && response.status() === 200) {
                let res = await response.json()

                data = data.concat(res.hotelFareList)
            }
        })

        await page.goto(crawlInfo['link'], {timeout: 60000})

        await sleep(60)
        const handle = item => {
            const {htlMasterId, htlNameKr, htlNameEn, salePrice, addr} = item
            return {
                name: htlNameKr,
                nameEn: htlNameEn,
                price: salePrice,
                supplierId: SUPPLIERS.Tourvis.id,
                identifier: htlMasterId + '',
                checkinDate: crawlInfo['checkinDate'],
                checkoutDate: crawlInfo['checkoutDate'],
                address: addr,
                link: `/hotels/${htlMasterId}`,
            }
        }

        const hotels = _.map(data.slice(0, 100), handle)
        hotels.forEach((item, index) => {
            item.rank = index + 1;
        })
        return hotels;
    }

    async generateDetailTasks(data) {
    }
}