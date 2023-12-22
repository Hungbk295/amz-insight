import {scroll, sleep} from "../../../utils/util.js"
import {SUPPLIERS} from "../../../config/suppliers.js";

export class Hotels {
    async crawl(page, crawlInfo) {
        await page.goto(crawlInfo["link"], {timeout: 60000});
        await sleep(30)
        await page.evaluate(scroll, {direction: "down", speed: "slow"});
        try {
            await page.locator(`//button[contains(@data-stid,'show-more-results')]`).click()
            await sleep(10)
        } catch (e) {
        }

        let hotel_infos = await page.locator(`//div[contains(@class, 'uitk-spacing-margin-blockstart-three')]`).elementHandles();

        const hotels = [];
        for (const info of hotel_infos) {
            const hotel = {};
            try {
                const hotel_name = await (await info.$(`//div/h3[contains(@class, 'uitk-heading')]`)).innerText();
                let hotel_price = (await info.innerText()).match(
                    /(₩((\d|,)+)\/1박)|(총 요금: ₩((\d|,)+))/gi
                )
                hotel_price = hotel_price && hotel_price.length > 0 ? hotel_price[0] : '0'

                const hotel_link = await (await info.$(`//a[contains(@data-stid,'open-hotel-information')]`)).getAttribute('href');
                const hotel_unique = hotel_link.split('/')[2]
                hotel.name = hotel_name;
                hotel.price = hotel_price.replace('1박', '').replace(/[^0-9]/g, '')
                hotel.identifier = hotel_unique;
                hotel.tag = hotel_unique
                hotel.link = hotel_link;
                hotel.supplierId = SUPPLIERS.Hotels.id
                hotel.checkinDate = crawlInfo["checkinDate"]
                hotel.checkoutDate = crawlInfo["checkoutDate"]
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