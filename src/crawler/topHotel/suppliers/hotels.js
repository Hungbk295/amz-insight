import {scroll, sleep} from "../../../utils/util.js"

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"],{ timeout: 60000 });
    await sleep(15)
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    page.locator(`//button[contains(@data-stid,'show-more-results')]`).click()
    await sleep(2);

    let hotel_infos = await page.locator(`//div[contains(@class, 'uitk-spacing-margin-blockstart-three')]`).elementHandles();

    const hotels = [];
    for (const info of hotel_infos){
        const hotel = {};
        try {
            const content = (await info.innerText())
            const hotel_name = await (await info.$(`//div/h4`)).innerText();
            let hotel_price = content.matchAll(/(총 요금: ₩)((\d|,)+)/gi);
            hotel_price = [...hotel_price]
            hotel_price = hotel_price.length > 0 ? hotel_price[0][2] : '0'

            const hotel_link = await (await info.$(`//a[contains(@data-stid,'open-hotel-information')]`)).getAttribute('href');
            const hotel_unique = hotel_link.split('/')[2]
            const hotel_tag = hotel_link.split('/')[3]
            hotel.name = hotel_name;
            hotel.price = hotel_price.replace(/[^0-9]/g, '');
            hotel.identifier = hotel_unique;
            hotel.tag = hotel_tag
            hotel.link = hotel_link;
            hotel.supplierId = 6
            hotel.checkinDate = crawlInfo["checkinDate"]
            hotel.checkoutDate = crawlInfo["checkoutDate"]
            hotels.push(hotel);
        }
        catch (e){
            console.log(e)
        }

    }
    return hotels.slice(0, 40);
}