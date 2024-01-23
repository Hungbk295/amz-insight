import {scroll, sleep} from "../../../utils/util.js"
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Hotels {
    async crawl(page, task) {
        await page.goto(SUPPLIERS.Hotels.link + task["link"], {timeout: 60000});
        await sleep(30)
        await page.evaluate(scroll, {direction: "down", speed: "slow"});
        try {
            await page.locator(`//button[contains(@data-stid,'show-more-results')]`).click()
            await sleep(10)
        } catch (e) {
        }

        let hotelInfos = await page.locator(`//div[contains(@class, 'uitk-spacing-margin-blockstart-three')]`).elementHandles();

        const hotels = [];
        for (const info of hotelInfos) {
            const hotel = {};
            try {
                const hotelName = await (await info.$(`//div/h3[contains(@class, 'uitk-heading')]`)).innerText();
                let hotelPrice = (await info.innerText()).match(
                    /(₩((\d|,)+)\/1박)|(총 요금: ₩((\d|,)+))/gi
                )
                hotelPrice = hotelPrice && hotelPrice.length > 0 ? hotelPrice[0] : '0'

                const hotelLink = await (await info.$(`//a[contains(@data-stid,'open-hotel-information')]`)).getAttribute('href');
                const hotelUnique = hotelLink.split('/')[2] ? hotelLink.split('/')[2] : hotelLink.match(/h[0-9]+/g)[0]
                hotel.name = hotelName;
                hotel.price = hotelPrice.replace('1박', '').replace(/[^0-9]/g, '')
                hotel.identifier = hotelUnique;
                hotel.tag = hotelUnique
                hotel.link = hotelLink.substring(1);
                hotel.supplierId = SUPPLIERS.Hotels.id
                hotel.checkIn = task["checkIn"]
                hotel.checkOut = task["checkOut"]
                hotels.push(hotel);
            } catch (e) {
                console.log(e)
            }
        }
        hotels.forEach((item, index) => {
            item.rank = index + 1;
        })
        return hotels.slice(0, 100);
    }
}