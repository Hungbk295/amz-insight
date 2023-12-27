import {scroll, sleep} from "../../../utils/util.js"
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Booking {
    async crawl(page, crawlInfo) {
        await page.goto(SUPPLIERS.Booking.link + crawlInfo["link"], {timeout: 60000});
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
                const hotelIdentifier = hotel_link.split('/')[3].split('.')[0]
                const hotel_tag = hotel_identifier

                hotel.name = hotel_name
                hotel.price = hotel_price.replace(/[^0-9]/g, '');
                hotel.link = hotel_link
                hotel.identifier = hotel_identifier
                hotel.tag = hotel_tag
                hotel.supplierId = SUPPLIERS.Booking.id
                hotel.checkinDate = crawlInfo['checkinDate']
                hotel.checkoutDate = crawlInfo['checkoutDate']
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