import {scroll, sleep} from '../../../utils/util.js'
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Agoda {
    async crawl(page, crawlInfo) {
        await page.goto(SUPPLIERS.Agoda.link + crawlInfo['link'], {timeout: 60000})
        await sleep(15)

        await page.evaluate(scroll, {direction: 'down', speed: 'slow'})

        for (let i = 0; i < 30; i += 1) {
            await page.mouse.wheel(0, 600)
            await sleep(1)
        }
        const hotels = []
        const hotel_infos = await page
            .locator(`//ol[contains(@class,'hotel-list-container')]/li`)
            .elementHandles()
        for (const info of hotel_infos) {
            const hotel = {}
            try {
                const hotel_name = await (
                    await info.$(`//h3[contains(@data-selenium,'hotel-name')]`)
                ).innerText()
                let hotel_price = ''
                try {
                    hotel_price = await (
                        await info.$(`//*[contains(@data-selenium,'display-price')]`)
                    ).innerText()
                } catch (e) {
                }
                const hotel_link = await (await info.$(`//div/a`)).getAttribute('href')
                const hotel_identifier = hotel_link.split('/')[2]
                const hotel_tag = hotel_identifier
                hotel.name = hotel_name
                hotel.price = hotel_price.replace(/[^0-9]/g, '')
                hotel.identifier = hotel_identifier
                hotel.tag = hotel_tag
                hotel.link = hotel_link
                hotel.supplierId = SUPPLIERS.Agoda.id
                hotel.checkinDate = crawlInfo.checkinDate
                hotel.checkoutDate = crawlInfo.checkoutDate
                hotels.push(hotel)
            } catch (e) {
            }
        }
        hotels.forEach((item, index) => {
            item.rank = index + 1;
        })
        return hotels.slice(0, 100)
    }
}