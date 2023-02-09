import {deleteSqsMsg, getRandom, sleep, sqs, takeScreenshot} from "../../utils/util.js";
import axios from "axios";
import {crawlerList, classify} from "../crawler.js";
import {getBrowser} from "../../utils/playwright_browser.js";
import {execSync} from "child_process"
import {SERVERS} from "../config/expressvpn.js";

const crawl = async (page, crawlInfo) => {
    return crawlerList[classify(crawlInfo["url"])](page, crawlInfo)
}

function insertItem(item, data) {
    let isThisRoomExisted = false
    for (const dt of data) {
        if (item["hotel_id"] === dt["hotel_id"] && item["name"] === dt["name"] && item["supplier_name"] === dt["supplier_name"]) {
            if (item["price"] < dt["price"]) {
                dt["price"] = item["price"]
            }
            isThisRoomExisted = true
        }
    }
    if (!isThisRoomExisted) data.push(item)
}

const tasks = [{
    id: '74669',
    target_date: '2023-03-04',
    next_date: '2023-03-05',
    url: 'https://www.expedia.co.kr/Fukuoka-Hotels-Solaria-Nishitetsu-Hotel-Fukuoka.h9777175.Hotel-Information?chkin=2023-03-04&chkout=2023-03-05'
}, {
        id: '216043',
        target_date: '2023-03-04',
        next_date: '2023-03-05',
        url: 'https://www.expedia.co.kr/en/Tokyo-Hotels-Kimpton-Shinjuku-Tokyo.h42600519.Hotel-Information?chkin=2023-03-04&chkout=2023-03-05'
    }]
const main = async () => {
    let browser = await getBrowser();
    const context = await browser.contexts()[0]
    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
    for (const crawlInfo of tasks) {
        let data = []
        try {
            let crawlResult = await crawl(page, crawlInfo)
            for (const room of crawlResult["rooms_info"]) {
                let item = {}
                item["url"] = parseInt(crawlInfo['url'])
                item["name"] = room["room_name"]
                item["price"] = parseInt(room["room_price"])
                item["is_break_fast"] = room["room_breakfast"]
                item["is_cancelable"] = room["room_cancelable"]
                item["check_in"] = crawlInfo["target_date"]
                item["check_out"] = crawlInfo["next_date"]
                item["supplier_name"] = room["supplier_name"]
                item["hotel_address"] = room["hotel_address"]
                insertItem(item, data)
            }
            console.log(data)
        } catch (e) {
            // await takeScreenshot(page)
            console.log("Can't crawl", crawlInfo)
            console.log(e)
            await sleep(10)
            await browser.close()
            const stdout = execSync(`expressvpn disconnect && expressvpn connect ${getRandom(SERVERS)}`);
            console.log(stdout)
            await sleep(5)
            browser = await getBrowser();
            await sleep(5)
        }
        const context = browser.contexts()[0];
        const allPages = context.pages();
        for (let i = 1; i < allPages.length; i++) {
            await allPages[1].close()

        }
    }
    await browser.close()
    console.log("Finish crawling")
}
await main()







