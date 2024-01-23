import {scroll, sleep} from "../../../utils/util.js"
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Booking {
    async crawl(page, task) {
        await page.goto(SUPPLIERS.Booking.link + task["link"], {timeout: 60000});
        await sleep(8)
        await page.mouse.click(1, 2);
        await page.evaluate(scroll, {direction: "down", speed: "slow"});

        const hotelInfos = await page.locator(`//div[contains(@data-testid,'property-card-content')]`).elementHandles()
        const hotels = []
        for (const info of hotelInfos) {
            try {
                const hotel = {};
                const hotelName = await (await info.$(`//h2`)).innerText()
                const hotelPrice = await (await info.$(`//span[contains(@data-testid,'price-and-discounted-price')]`)).innerText()
                const hotelLink = (await (await info.$(`//a[contains(@data-testid,'title')]`)).getAttribute('href')).replace(SUPPLIERS.Booking.link, "/")
                const hotelIdentifier = hotelLink.split('/')[3].split('.')[0]
                const hotelTag = hotelIdentifier

                hotel.name = hotelName
                hotel.price = hotelPrice.replace(/[^0-9]/g, '')
                hotel.link = hotelLink.substring(1)
                hotel.identifier = hotelIdentifier
                hotel.tag = hotelTag
                hotel.supplierId = SUPPLIERS.Booking.id
                hotel.checkIn = task['checkIn']
                hotel.checkOut = task['checkOut']
                hotels.push(hotel)
            } catch (e) {
            }
        }

        hotels.forEach((item, index) => {
            item.rank = index + 1;
        })
        return hotels
    }
}