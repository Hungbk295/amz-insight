import {sleep} from '../../../utils/util.js'
import _ from 'lodash'
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Trip {
    async crawl(page, crawlInfo) {
        let data = []
        await page.on('response', async response => {
            const urls = await response.url()
            if (urls.includes('https://kr.trip.com/htls/getHotelList') && response.status() === 200) {
                let res = await response.json()

                data = data.concat(res.hotelList)
            }
        })

        await page.goto(crawlInfo['link'], {timeout: 60000})
        await sleep(15)

        try {
            await page.locator('.htlf-ic_popups_close').click()
        } catch {
        }
        for (let i = 0; i < 15; i++) {
            await page.mouse.wheel(0, 5000)
            await sleep(3)
        }

        const handle = item => {
            const {hotelBasicInfo} = item

            return {
                name: hotelBasicInfo.hotelName,
                nameEn: hotelBasicInfo.hotelEnName, // phone: null,
                price: hotelBasicInfo.price,
                supplierId: SUPPLIERS.Trip.id,
                identifier: hotelBasicInfo.hotelId + '',
                checkinDate: crawlInfo['checkinDate'],
                checkoutDate: crawlInfo['checkoutDate'],
                address: hotelBasicInfo.hotelAddress,
                link: `/detail/?hotelId=${hotelBasicInfo.hotelId}`,
                tag: hotelBasicInfo.hotelEnName
            }
        }

        const hotels = _.map(data.slice(0, 100), handle)
        hotels.forEach((item, index) => {
            item.rank = index + 1;
        })
        return hotels;
    }
}
