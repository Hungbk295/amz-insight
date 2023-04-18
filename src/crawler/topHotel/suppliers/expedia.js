import {scroll, sleep} from "../../../utils/util.js"

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"], {timeout: 60000});
    await sleep(15)
    page.locator(`//button[contains(@data-stid,'show-more-results')]`).click()
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    await sleep(2);

    const hotel_infos = await page.locator(`//div[contains(@data-stid,'lodging-card-responsive')]`).elementHandles();
    const hotels = [];
    for (const info of hotel_infos) {
        const hotel = {};
        try {
            const hotel_name = await (await info.$(`//div/h4`)).innerText();
            let hotel_price = (await info.innerText()).matchAll(/(총 요금: ₩)((\d|,)+)/gi);
            hotel_price = [...hotel_price]
            hotel_price = hotel_price.length > 0 ? hotel_price[0][2] : '0'
            const hotel_link = await (await info.$(`//a[contains(@data-stid,'open-hotel-information')]`)).getAttribute('href');
            const hotel_unique = hotel_link.match(/\.(h\d+)\./gi)[0].replaceAll('.', '')

            hotel.name = hotel_name;
            hotel.price = hotel_price.replace(/[^0-9]/g, '');
            hotel.identifier = hotel_unique;
            hotel.link = hotel_link;
            hotel.checkinDate = crawlInfo["checkinDate"]
            hotel.checkinDate = crawlInfo["checkoutDate"]
            hotel.supplierId = 1
            hotels.push(hotel);
        } catch (e) {
            console.log(e);
        }
    }

    const result = hotels.slice(0, 40);
    console.log(result);
    return result
}

