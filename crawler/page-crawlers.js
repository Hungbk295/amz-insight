import {checkBreakfast, checkCancelable, scroll, sleep} from "./utils/util.js"
import dayjs from "dayjs";

const crawlExpedia = async (page, crawlInfo) => {
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

const crawlAgoda = async (page, crawlInfo) => {
    await page.goto('https://www.agoda.com/api/cronos/layout/currency/set?currencyId=26');
    await sleep(3)
    await page.goto(crawlInfo["url"], { timeout: 60000});

    let startDate = dayjs(crawlInfo["target_date"]).format("ddd MMM D YYYY")
    let endDate = dayjs(crawlInfo["next_date"]).format("ddd MMM D YYYY")

    await page.click(`//div[contains(@aria-label,"${startDate}")]`)
    await page.click(`//div[contains(@aria-label,"${endDate}")]`)
    await page.click("//button[contains(@data-selenium,'searchButton')]")
    await sleep(40)

    // let currency = await page.locator(`//div[contains(@data-value,"KRW")]`).elementHandles()
    // if (currency.length === 0) {
    //     await page.click(`//div[contains(@data-selenium,"currency-container-selected-currency")]`)
    //     // await sleep(10)
    //     await page.click(`(//div[contains(@data-value,"KRW")])[1]`)
    // }

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

const crawlDefault = () => {return null}

export const classify = (link) => {
    if (link === undefined) return null
    if (link.includes("www.agoda.co")) return 'agoda'
    if (link.includes("www.expedia.co")) return 'expedia'
}

export const crawlerList = {
    "": crawlDefault,
    "agoda": crawlAgoda,
    "expedia": crawlExpedia
}
