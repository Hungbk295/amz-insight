import {checkBreakfast, checkCancelable, scroll, sleep} from "../../utils/util.js"

export const crawl = async (page, crawlInfo) => {
    await page.goto(crawlInfo["url"],{ timeout: 60000 });
    await sleep(15)
    await page.evaluate(scroll, {direction: "down", speed: "slow"});
    await page.evaluate(scroll, {direction: "up", speed: "slow"});
    const result = {}
    let hotel_addr_tag = null
    hotel_addr_tag = await page.locator(`//div[contains(@data-stid,'content-hotel-address')]`).elementHandle();
    const hotel_addr = (hotel_addr_tag !== null) ? await hotel_addr_tag.innerText() : ''
    const rooms_info = []
    const list_room = await page.locator(`//div[contains(@data-stid,'section-room-list')]/div/div`).elementHandles()
    for (const room of list_room) {
        let room_breakfast = "N"
        let room_cancelable = "N"
        const dict_raw = {}
        const room_name = await (await room.$(`//h3[contains(@class,'uitk-heading')]`)).innerText()
        const room_price_tag = await room.$(`//div[contains(@data-stid,'price-summary')]/div/div/div/span/div`)
        const room_price = (room_price_tag != null) ? (await room_price_tag.innerText()) : ""
        const list_option = await room.$$(`//div/div/div[2]/ul/li`)
        for (const option of list_option) {
            if (option != null) {
                room_breakfast = checkBreakfast(await option.innerText(), 'Free breakfast')
            }
        }
        const option_refund = await room.$(`//button[contains(@class,'uitk-link-align-left')]/div`)
        if (option_refund != null) {
            room_cancelable = checkCancelable(await option_refund.innerText(), 'Fully refundable')
        }
        dict_raw["supplier_name"] = 'Expedia'
        dict_raw["hotel_address"] = hotel_addr
        dict_raw['room_name'] = room_name
        dict_raw['room_price'] = room_price === ""? "0" : room_price.substring(1).replaceAll(",","")
        dict_raw['room_breakfast'] = room_breakfast
        dict_raw['room_cancelable'] = room_cancelable
        rooms_info.push(dict_raw)
    }
    result["rooms_info"] = rooms_info
    return result;
}