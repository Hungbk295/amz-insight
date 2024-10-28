import {scroll, sleep} from '../../../utils/util.js'
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Agoda {
    async crawl(page, task) {
        await page.goto(SUPPLIERS.Agoda.link + task['link'], {timeout: 60000})
        await sleep(15)

        await page.evaluate(scroll, {direction: 'down', speed: 'slow'})

        for (let i = 0; i < 30; i += 1) {
            await page.mouse.wheel(0, 600)
            await sleep(1)
        }
        const hotels = []
        const hotelInfos = await page
            .locator(`//ol[contains(@class,'hotel-list-container')]/li`)
            .elementHandles()
        for (const info of hotelInfos) {
            const hotel = {}
            try {
                const hotelName = await (
                    await info.$(`//h3[contains(@data-selenium,'hotel-name')]`)
                ).innerText()
                let hotelPrice = ''
                try {
                    hotelPrice = await (
                        await info.$(`//*[contains(@data-selenium,'display-price')]`)
                    ).innerText()
                } catch (e) {

                }
                const hotelLink = await (await info.$(`//div/a`)).getAttribute('href')
                const hotelIdentifier = hotelLink.split('/')[2]
                const hotelTag = hotelIdentifier
                hotel.name = hotelName
                hotel.price = hotelPrice.replace(/[^0-9]/g, '')
                hotel.identifier = hotelIdentifier
                hotel.tag = hotelTag
                hotel.link = hotelLink.substring(1)
                hotel.supplierId = SUPPLIERS.Agoda.id
                hotel.checkIn = task.checkIn
                hotel.checkOut = task.checkOut
                hotels.push(hotel)
            } catch (e) {
                console.log(e)
            }
        }
        hotels.forEach((item, index) => {
            item.rank = index + 1;
        })
        return hotels.slice(0, 100)
    }
}