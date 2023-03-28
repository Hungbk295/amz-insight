import {scroll, sleep} from "../../../utils/util.js"

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"],{ timeout: 60000 });
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    await sleep(1)
    await page.evaluate(scroll, {direction: "up", speed: "fast"});
    await sleep(2)



    const result = {};
    const hotel_infos = await page.locator(`//div[contains(@class,'hotel-info')]`).elementHandles();
    const hotel_info = [];
    for (const hotel of hotel_infos){
        try {
            const dict_raw = {};
            const hotel_name = await (await hotel.$(`//div[contains(@class,'list-card-title')]/span`)).innerText();
            const hotel_price = await (await hotel.$(`//div[contains(@id,'meta-real-price')]/span/div`)).innerText();
            dict_raw["hotel_name"] = hotel_name;
            dict_raw["hotel_price"] = hotel_price.replace(/[^0-9]/g, '');
            hotel_info.push(dict_raw);
        } catch (e) {
        }
    }
    result["hotel_info"] = hotel_info;
    return result;
}