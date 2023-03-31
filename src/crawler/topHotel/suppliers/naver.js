import {scroll, sleep} from "../../../utils/util.js"

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"],{ timeout: 60000 });
    await sleep(15)
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    await sleep(2)

    const hotel_infos = await page.locator(`//*[@id="__next"]/div/div/div/div[1]/div[3]/ul/li`).elementHandles()
    const count_elements_page = hotel_infos.length;
    const remain_elements = 30 - count_elements_page
    const hotels = []
    for (const info of hotel_infos){
        const hotel = {};
        const hotel_name = await (await info.$(`//div[1]/div[2]/h4`)).innerText()
        const hotel_price = await (await info.$(`//div[2]/em`)).innerText()
        const hotel_link = await (await info.$(`//a`)).getAttribute('href')
        const hotel_unique = hotel_link.split('&')[0].split('%3')[1];

        hotel.name = hotel_name
        hotel.price = hotel_price
        hotel.link = hotel_link
        hotel.supplierId = 5
        hotel.identifier = hotel_unique
        hotel.checkinDate = crawlInfo.checkinDate
        hotel.checkoutDate = crawlInfo.checkoutDate
        hotels.push(hotel)
    }
    if (remain_elements > 0 ){
        const next_page = await page.locator(`//*[@id="__next"]/div/div/div/div[1]/div[3]/div[2]/button[7]`)
        await next_page.click();
    }
    await sleep(10)
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    const hotel_infos2 = await page.locator(`//*[@id="__next"]/div/div/div/div[1]/div[3]/ul/li`).elementHandles()

    for (let i = 0 ; i < remain_elements; i+= 1){
        const hotel = {};
        const hotel_name = await (await hotel_infos2[i].$(`//div[1]/div[2]/h4`)).innerText();
        const hotel_price = await (await hotel_infos2[i].$(`//div[2]/em`)).innerText();
        const hotel_link = await (await hotel_infos2[i].$(`//a`)).getAttribute('href');
        const hotel_unique = hotel_link.split('&')[0].split('%3')[1];
        hotel.name = hotel_name;
        hotel.price = hotel_price.replace(/[^0-9]/g, '');
        hotel.link = hotel_link;
        hotel.identifier = hotel_unique;
        hotel.supplierId = 5
        hotel.checkinDate = crawlInfo['checkinDate']
        hotel.checkoutDate = crawlInfo['checkoutDate']
        hotels.push(hotel);
    }

    const result = hotels
    console.log(crawlInfo['url'])
    console.log(result);
    return result;
}