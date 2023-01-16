import {FingerprintGenerator} from "fingerprint-generator";
import {sleep, takeScreenshot} from "./utils/util.js";
import {FingerprintInjector} from "fingerprint-injector";
import {chromium} from "playwright";
import axios from "axios";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import {crawlerList, classify} from "./page-crawlers.js";


const s3Config = {
    apiVersion: '2006-03-01',
    region: 'ap-northeast-2',
}
const s3 = new AWS.S3(s3Config)

export async function initial() {
    const fingerprintGenerator = new FingerprintGenerator();
    const browserFingerprintWithHeaders = fingerprintGenerator.getFingerprint({
        devices: ['desktop', 'mobile'],
        browsers: ['chrome', 'firefox'],
    });

    const fingerprintInjector = new FingerprintInjector();
    const { fingerprint } = browserFingerprintWithHeaders;

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: fingerprint.userAgent,
        locale: "ko_KR",
        viewport: fingerprint.screen,
    });
    await fingerprintInjector.attachFingerprintToPlaywright(context, browserFingerprintWithHeaders);
    const page = await context.newPage();
    return { page, browser }
}

const crawl = async (page, crawlInfo) => {
    return crawlerList[classify(crawlInfo["url"])](page, crawlInfo)
}

function insertItem(item, data) {
    let changed = false
    for (const dt of data){
        if (item["hotel_id"] === dt["hotel_id"] && item["name"] === dt["name"] &&  item["hotel_name"] === dt["hotel_name"] && item["supplier_name"] === dt["supplier_name"] && item["hotel_address"] === dt["hotel_address"] ) {
            if (item["price"] < dt["price"]){
                dt["price"] = item["price"]
                changed = true
            }
        }
    }
    if (changed === false) data.push(item)
}

const main = async () => {
    dotenv.config()
    console.log("Start crawling")
    let arg = process.argv.slice(2)[0]
    let hotelList = JSON.parse(arg)
    const { page, browser } = await initial();
    for (const hotel of hotelList) {
        // Each task (hotel) has several links to crawl
        for (const crawlInfo of hotel["results"]) {
            let data = []
            try {
                console.log(crawlInfo["url"])
                await page.goto(crawlInfo["url"], { timeout: 60000});
                await sleep(15)
                let crawlResult = await crawl(page, crawlInfo)
                for (const room of crawlResult["rooms_info"]){
                    let item = {}
                    item["hotel_id"] = parseInt(hotel["id"])
                    item["name"] = room["room_name"]
                    item["price"] = parseInt(room["room_price"])
                    item["is_break_fast"] = room["room_breakfast"]
                    item["is_cancelable"] = room["room_cancelable"]
                    item["check_in"] = crawlInfo["target_date"]
                    item["check_out"] = crawlInfo["next_date"]
                    item["hotel_name"] = hotel["hotel_name"]
                    item["supplier_name"] = room["supplier_name"]
                    item["hotel_address"] = room["hotel_address"]
                    insertItem(item, data)
                }
            } catch (e) {
                console.log("Can't crawl", crawlInfo["url"])
                console.log(e)
                const stdout = execSync(`expressvpn disconnect && expressvpn connect ${getRandom(SERVERS)}`);
                console.log(stdout)
                await sleep(3)
            }
            const context = browser.contexts()[0];
            const allPages = context.pages();
            for (let i = 1; i < allPages.length; i++) {
                await allPages[1].close()
            }
            console.log(data)
            if (data.length === 0) {
                // await page.evaluate(scroll, {direction: "down", speed: "slow"});
                await takeScreenshot(page)
            }
            await takeScreenshot(page)
            await axios.post(process.env.HOTELFLY_API_HOST + '/room', {"data": data})
        }
    }
    await page.close()
    await browser.close();
    console.log("Finish crawling")
}

await main()







