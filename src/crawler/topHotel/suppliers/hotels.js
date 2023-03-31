import {scroll, sleep} from "../../../utils/util.js"

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"],{ timeout: 60000 });
    await sleep(15)
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    await sleep(5);

    let hotel_infos = await page.locator(`//div[contains(@data-stid,'property-listing-results')]/div`).elementHandles();
    if(hotel_infos.length < 30){
        const hotel_infos_added = await page.locator(`//div[contains(@class,'lazyload-wrapper')]/div`).elementHandles();
        hotel_infos.push(...hotel_infos_added)
    }

    const hotels = [];
    for (const info of hotel_infos){
        const hotel = {};
        try {
            const hotel_name = await (await info.$(`//div/div[2]/div/div/h4`)).innerText();
            const hotel_price = await (await info.$(`//div[contains(@data-test-id,'price-summary-message-line')]/div/span/div`)).innerText();
            const hotel_link = await (await info.$(`//a[contains(@data-stid,'open-hotel-information')]`)).getAttribute('href');
            const hotel_unique = hotel_link.split('/')[2]
            hotel.name = hotel_name;
            hotel.price = hotel_price.replace(/[^0-9]/g, '');
            hotel.identifier = hotel_unique;
            hotel.link = hotel_link;
            hotel.supplierId = 6
            hotel.checkinDate = crawlInfo["checkinDate"]
            hotel.checkoutDate = crawlInfo["checkoutDate"]
            hotels.push(hotel);
        }
        catch (e){
        }

    }
    const result = hotels.slice(0,40);
    return result;
}