import {checkBreakfast, checkCancelable, sleep} from "../../utils/util.js";
import dayjs from "dayjs";

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"],{ timeout: 60000 });
    await page.goto('https://www.agoda.com/api/cronos/layout/currency/set?currencyId=26');
    await sleep(3)
    await page.goBack({ timeout: 60000 })
    await sleep(10)
    let startDate = dayjs(crawlInfo["target_date"]).format("ddd MMM DD YYYY")
    let endDate = dayjs(crawlInfo["next_date"]).format("ddd MMM DD YYYY")

    await page.click(`//div[contains(@aria-label,"${startDate}")]`)
    await page.click(`//div[contains(@aria-label,"${endDate}")]`)
    await page.click("//button[contains(@data-selenium,'searchButton')]")
    try {
        await page.click('//*[@id="pricefreeze-promo-popup"]//button', {timeout: 6000})
    } catch (e) {
    }
    await sleep(20)
    const hotel_addr_tag = await page.locator(`//span[contains(@data-selenium,'hotel-address-map')]`).elementHandle();
    const hotel_addr = (hotel_addr_tag !== null) ? await hotel_addr_tag.innerText() : '';
    const list_room_group = await page.locator('.MasterRoom').elementHandles();
    const result = {};
    let rooms_info = []
    for (const room_group of list_room_group) {
        const room_name = await (await room_group.$('span.MasterRoom__HotelName')).innerText();
        const list_room = await room_group.$$(`//div[contains(@data-ppapi,'room')]`);
        for (const room of list_room) {
            const room_info = {};
            const room_price = await (await room.$(`//strong[contains(@data-ppapi,'room-price')]`)).innerText();
            const list_option = await room.$('.ChildRoomsList-room-featurebuckets');
            const option_elements = await list_option.$$('.ChildRoomsList-room-featurebucket-Benefits > div');
            const room_breakfast = checkBreakfast(await (await option_elements.at(0)).innerText(), 'Breakfast for 2');
            const room_cancelable = checkCancelable(await (await option_elements.at(-1)).innerText(), 'non-refundable');
            room_info["supplier_name"] = 'Agoda'
            room_info["hotel_address"] = hotel_addr
            room_info["room_name"] = room_name
            room_info["room_price"] = room_price.replaceAll(",", "")
            room_info["room_breakfast"] = room_breakfast
            room_info["room_cancelable"] = room_cancelable
            rooms_info.push(room_info)
        }
    }
    result["rooms_info"] = rooms_info
    return result;
}