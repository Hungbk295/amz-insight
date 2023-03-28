import {scroll, sleep} from "../../../utils/util.js"

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"],{ timeout: 60000 });
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    await sleep(5);

    const result = {};
    const hotel_infos = await page.locator(`//ol[contains(@class,'hotel-list-container')]/li`).elementHandles();
    const hotel_info = [];
    for (const hotel of hotel_infos){
        const dict_raw = {};
        try {
            const hotel_name = await (await hotel.$(`//h3[contains(@data-selenium,'hotel-name')]`)).innerText();
            const hotel_price = await (await hotel.$(`//span[contains(@data-selenium,'display-price')]`)).innerText();
            const hotel_link = await (await hotel.$(`//div/a`)).getAttribute('href');
            const hotel_unique = hotel_link.split('/')[2]
            dict_raw["supplier_name"] = 'agoda';
            dict_raw["hotel_name"] = hotel_name;
            dict_raw["hotel_price"] = hotel_price.replace(/[^0-9]/g, '');
            dict_raw['hotel_unique'] = hotel_unique;
            dict_raw["hotel_link"] = hotel_link;
            dict_raw["hotel_address"] = 'Seoul'
            hotel_info.push(dict_raw);
        }
        catch (e){}

    }

    result['hotel_info'] = hotel_info.slice(0,40)

    return result;
}