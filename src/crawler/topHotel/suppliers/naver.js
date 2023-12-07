import {Suppliers} from "../../../constants/suppliers.js";
import {sleep, scroll} from "../../../utils/util.js";

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"], {timeout: 60000});
    await sleep(8)
    await page.locator("(//button[contains(@class, 'SearchBox_btn_location')])[1]").click()
    await sleep(3)
    await page.locator("(//input[contains(@class, 'Autocomplete_txt')])[1]").fill(crawlInfo.keyword)
    await sleep(3)
    await page.locator("(//*[contains(@class, 'SearchResults_item')])[1]").click()
    await sleep(15)
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    await sleep(2)
    let hotels = await handleSinglePage(crawlInfo, page)

    if (hotels.length < 30) {
        await page.locator("(//button[contains(@class, 'Pagination_next')])[1]").click()
        await sleep(15)
        await page.evaluate(scroll, {direction: "down", speed: "slow"});
        hotels = hotels.concat(await handleSinglePage(crawlInfo, page))
    }
    hotels.forEach((item, index) => {
        item.rank = index + 1;
    })
    return hotels;
}

const handleSinglePage = async (crawlInfo, page) => {
    const hotel_infos = await page.locator(`//*[@id="__next"]/div/div/div/div[1]/div[3]/ul/li`).elementHandles()
    const hotels = []
    for (const info of hotel_infos) {
        const hotel = {};
        const hotel_name = await (await info.$(`//div[1]/div[2]/h4`)).innerText()
        const hotel_price = await (await info.$(`//div[2]/em`)).innerText()
        const hotel_link = await (await info.$(`//a`)).getAttribute('href')
        const hotel_unique = hotel_link.split('&')[0].split('%3A')[1];

        hotel.name = hotel_name
        hotel.price = hotel_price.replace(/[^0-9]/g, '');
        hotel.link = hotel_link
        hotel.supplierId = Suppliers.Naver.id
        hotel.identifier = hotel_unique
        hotel.tag = hotel_unique
        hotel.checkinDate = crawlInfo.checkinDate
        hotel.checkoutDate = crawlInfo.checkoutDate
        hotels.push(hotel)
    }
    return hotels
}
