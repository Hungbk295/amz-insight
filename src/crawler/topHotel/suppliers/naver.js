import {SUPPLIERS} from "../../../config/suppliers.js";
import {sleep, scroll} from "../../../utils/util.js";

export class Naver {
    async crawl(page, task) {
        await page.goto(SUPPLIERS.Naver.link + task["link"], {timeout: 60000});
        await sleep(15)
        await page.evaluate(scroll, {direction: "down", speed: "slow"});
        await sleep(2)
        let hotels = await this.handleSinglePage(task, page)

        while (hotels.length < 100) {
            try {
                await page.locator("(//button[contains(@class, 'Pagination_next')])[1]").click()
            } catch (e) {
                break
            }
            await sleep(15)
            await page.evaluate(scroll, {direction: "down", speed: "slow"});
            hotels = hotels.concat(await this.handleSinglePage(task, page))
        }
        hotels.forEach((item, index) => {
            item.rank = index + 1;
        })
        return hotels;
    }

    async handleSinglePage(task, page) {
        const hotelInfos = await page.locator(`//*[@id="__next"]/div/div/div/div[1]/div[3]/ul/li`).elementHandles()
        const hotels = []
        for (const info of hotelInfos) {
            const hotel = {};
            const hotelName = await (await info.$(`//div[1]/div[2]/h4`)).innerText()
            const hotelPrice = await (await info.$(`//div[2]/em`)).innerText()
            const hotelLink = await (await info.$(`//a`)).getAttribute('href')
            const hotelUnique = hotelLink.split('%3A')[1] ? hotelLink.split('%3A')[1].split('&')[0] : hotelLink.split('/')[2];

            hotel.name = hotelName
            hotel.price = hotelPrice.replace(/[^0-9]/g, '');
            hotel.link = hotelLink.substring(1).split('&')[0]
            hotel.supplierId = SUPPLIERS.Naver.id
            hotel.identifier = hotelUnique
            hotel.tag = hotelUnique
            hotel.checkIn = task.checkIn
            hotel.checkOut = task.checkOut
            hotels.push(hotel)
        }
        return hotels
    }
}