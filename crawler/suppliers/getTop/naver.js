import {scroll, sleep} from "../../../utils/util.js"

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"],{ timeout: 60000 });
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    await sleep(2)

    const result = {}
    const hotel_infos = await page.locator(`//*[@id="__next"]/div/div/div/div[1]/div[3]/ul/li`).elementHandles()
    const count_elements_page = hotel_infos.length;
    const remain_elements = 30 - count_elements_page
    const hotel_info = []
    for (const hotel of hotel_infos){
        const dict_raw = {};
        const hotel_name = await (await hotel.$(`//div[1]/div[2]/h4`)).innerText()
        const hotel_price = await (await hotel.$(`//div[2]/em`)).innerText()
        const hotel_link = await (await hotel.$(`//a`)).getAttribute('href')

        dict_raw["hotel_name"] = hotel_name
        dict_raw["hotel_price"] = hotel_price
        dict_raw["hotel_link"] = hotel_link
        hotel_info.push(dict_raw)
    }
    if(remain_elements > 0 ){
        const next_page = await page.locator(`//*[@id="__next"]/div/div/div/div[1]/div[3]/div[2]/button[7]`)
        await next_page.click();
    }
    await sleep(10)
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    const hotel_infos2 = await page.locator(`//*[@id="__next"]/div/div/div/div[1]/div[3]/ul/li`).elementHandles()

    for (let i = 0 ; i < remain_elements; i+= 1){
        const dict_raw = {};
        const hotel_name = await (await hotel_infos2[i].$(`//div[1]/div[2]/h4`)).innerText();
        const hotel_price = await (await hotel_infos2[i].$(`//div[2]/em`)).innerText();
        const hotel_link = await (await hotel_infos2[i].$(`//a`)).getAttribute('href');
        const hotel_unique = hotel_link.split('&')[0].split('%3')[1];
        dict_raw["supplier_name"] = 'Naver'
        dict_raw["hotel_name"] = hotel_name;
        dict_raw["hotel_price"] = hotel_price.replace(/[^0-9]/g, '');
        dict_raw["hotel_link"] = hotel_link;
        dict_raw["hotel_unique"] = hotel_unique;
        hotel_info.push(dict_raw);
    }

    result["hotel_info"] = hotel_info;
    return result;
}