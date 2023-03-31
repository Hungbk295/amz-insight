import {scroll, sleep} from "../../../utils/util.js"

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"],{ timeout: 60000 });
    await sleep(15)
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    await sleep(1)
    await page.evaluate(scroll, {direction: "up", speed: "fast"});
    await sleep(2)

    const hotel_infos = await page.locator(`//div[contains(@class,'hotel-info')]`).elementHandles();
    const hotels = [];
    for (const info of hotel_infos){
        try {
            const hotel = {};
            const hotel_name = await (await info.$(`//div[contains(@class,'list-card-title')]/span`)).innerText();
            const hotel_price = await (await info.$(`//div[contains(@id,'meta-real-price')]/span/div`)).innerText();
            const hotel_identifier = crawlInfo['link'].split('&')[0].split('=')[1];
            hotel.name = hotel_name;
            hotel.price = hotel_price.replace(/[^0-9]/g, '');
            hotel.supplierId = 3
            hotel.link = crawlInfo.url
            hotel.checkinDate = crawlInfo.checkinDate
            hotel.checkoutDate = crawlInfo.checkoutDate
            hotel.identifier = hotel_identifier
            hotels.push(hotel);
        } catch (e) {
        }
    }

    const result = hotels;
    return result;
}