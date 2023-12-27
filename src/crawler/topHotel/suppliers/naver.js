import {SUPPLIERS} from "../../../config/suppliers.js";
import {sleep, scroll} from "../../../utils/util.js";

export class Naver {
    async crawl(page, task) {
        await page.goto(SUPPLIERS.Naver.link + task["link"], {timeout: 60000});
        await sleep(8)
        await page.locator("(//button[contains(@class, 'SearchBox_btn_location')])[1]").click()
        await sleep(3)
        await page.locator("(//input[contains(@class, 'Autocomplete_txt')])[1]").fill(task.keyword['keyword'])
        await sleep(3)
        await page.locator("(//*[contains(@class, 'SearchResults_item')])[1]").click()
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
            const hotelUnique = hotelLink.split('&')[0].split('%3A')[1];

            hotel.name = hotelName
            hotel.price = hotelPrice.replace(/[^0-9]/g, '');
            hotel.link = hotelLink.substring(1)
            hotel.supplierId = SUPPLIERS.Naver.id
            hotel.identifier = hotelUnique
            hotel.tag = hotelUnique
            hotel.checkinDate = task.checkinDate
            hotel.checkoutDate = task.checkoutDate
            hotels.push(hotel)
        }
        return hotels
    }
}