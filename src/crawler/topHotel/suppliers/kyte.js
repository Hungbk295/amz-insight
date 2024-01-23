import {sleep} from "../../../utils/util.js"
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Kyte {
    async crawl(page, task) {
        await page.goto(SUPPLIERS.Kyte.link + task["link"], {timeout: 60000});
        await sleep(10)
        let hotelInfos = []
        let retryTimes = 0;
        let lastHotelCnt = 0
        while (hotelInfos.length < 100 && retryTimes < 10) {
            await page.mouse.wheel(0, 5000)
            await sleep(1)
            hotelInfos = await page.locator(`//div[contains(@class,'infinite-scroll-component')]/div/a`).elementHandles()
            if (lastHotelCnt === hotelInfos.length) retryTimes++
            else retryTimes = 0
            lastHotelCnt = hotelInfos.length
        }
        const hotels = await this.getHomepagePrice(task, hotelInfos)
        hotels.forEach((item, index) => {
            item.rank = index + 1;
        })
        return hotels.slice(0, 100);
    }

    async getHomepagePrice(task, hotelInfos) {
        const hotels = []
        for (const info of hotelInfos) {
            const indexInfo = hotelInfos.indexOf(info)
            const hotel = {};
            const hotelName = await (await info.$(`//div[3]/div[1]/div`)).innerText()
            let hotelPrice = '';
            try {
                hotelPrice = await (await info.$(`//div[3]`)).innerText()
                hotelPrice = hotelPrice.match('1박 평균 (.*?)원')[1]
            } catch (e) {
                console.log(indexInfo, hotelName)
            }
            const hotelLink = await (await info.getAttribute('href'))
            const hotelUnique = hotelLink.split('?')[0].split('/')[2];

            hotel.name = hotelName
            hotel.price = hotelPrice.replace(/[^0-9]/g, '');
            hotel.link = `hotels/${hotelUnique}`
            hotel.supplierId = SUPPLIERS.Kyte.id
            hotel.identifier = hotelUnique
            hotel.tag = hotelUnique
            hotel.checkIn = task.checkIn
            hotel.checkOut = task.checkOut
            hotels.push(hotel)
        }
        return hotels
    }
}