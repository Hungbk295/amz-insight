import {sleep} from "../../../utils/util.js"
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Kyte {
    async crawl(page, crawlInfo) {
        await page.goto(crawlInfo["link"], {timeout: 60000});
        await sleep(10)
        let hotel_infos = []
        let retryTimes = 0;
        let lastHotelCnt = 0
        while (hotel_infos.length < 100 && retryTimes < 10) {
            await page.mouse.wheel(0, 5000)
            await sleep(1)
            hotel_infos = await page.locator(`//div[contains(@class,'infinite-scroll-component')]/div/a`).elementHandles()
            if (lastHotelCnt === hotel_infos.length) retryTimes++
            else retryTimes = 0
            lastHotelCnt = hotel_infos.length
        }
        const hotels = await this.getHomepagePrice(crawlInfo, hotel_infos)
        hotels.forEach((item, index) => {
            item.rank = index + 1;
        })
        return hotels.slice(0, 100);
    }

    async generateDetailTasks(data) {
    }

    async getHomepagePrice(crawlInfo, hotel_infos) {
        const hotels = []
        for (const info of hotel_infos) {
            const indexInfo = hotel_infos.indexOf(info)
            const hotel = {};
            const hotel_name = await (await info.$(`//div[3]/div[1]/div`)).innerText()
            let hotel_price = '';
            try {
                hotel_price = await (await info.$(`//div[3]`)).innerText()
                hotel_price = hotel_price.match('1박 평균 (.*?)원')[1]
            } catch (e) {
                console.log(indexInfo, hotel_name)
            }
            const hotel_link = await (await info.getAttribute('href'))
            const hotel_unique = hotel_link.split('?')[0].split('/')[2];

            hotel.name = hotel_name
            hotel.price = hotel_price.replace(/[^0-9]/g, '');
            hotel.link = hotel_link
            hotel.supplierId = SUPPLIERS.Kyte.id
            hotel.identifier = hotel_unique
            hotel.tag = hotel_unique
            hotel.checkinDate = crawlInfo.checkinDate
            hotel.checkoutDate = crawlInfo.checkoutDate
            hotels.push(hotel)
        }
        return hotels
    }
}