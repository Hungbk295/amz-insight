import {scroll, sleep} from "../../../utils/util.js"

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"],{ timeout: 60000 });

    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    await sleep(5);

    const result = {};
    let hotel_infos = await page.locator(`//div[contains(@data-stid,'property-listing-results')]/div`).elementHandles();
    if(hotel_infos.length < 30){
        const hotel_infos_added = await page.locator(`//div[contains(@class,'lazyload-wrapper')]/div`).elementHandles();
        hotel_infos.push(...hotel_infos_added)
    }

    const hotel_info = [];
    for (const hotel of hotel_infos){
        const dict_raw = {};
        try {
            const hotel_name = await (await hotel.$(`//div/div[2]/div/div/h4`)).innerText();
            const hotel_price = await (await hotel.$(`//div[contains(@data-test-id,'price-summary-message-line')]/div/span/div`)).innerText();
            const hotel_link = await (await hotel.$(`//a[contains(@data-stid,'open-hotel-information')]`)).getAttribute('href');
            const hotel_unique = hotel_link.split('/')[2]
            dict_raw["supplier_name"] = 'hotels.com'
            dict_raw["hotel_name"] = hotel_name;
            dict_raw["hotel_price"] = hotel_price.replace(/[^0-9]/g, '');
            dict_raw['hotel_unique'] = hotel_unique;
            dict_raw["hotel_link"] = hotel_link;
            dict_raw["hotel_address"] = 'Seoul'
            hotel_info.push(dict_raw);
        }
        catch (e){
        }

    }
    result["hotel_info"] = hotel_info.slice(0,40);
    return result;
}