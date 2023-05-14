import {deleteSqsMsg, getRandom, sleep, sqs} from "../../utils/util.js";
import axios from "axios";
import {classify} from "./crawler.js";
import {getBrowser} from "../../utils/playwright_browser.js";
import {execSync} from "child_process"
import {SERVERS} from "../../constants/expressvpn.js";
import dotenv from 'dotenv'

dotenv.config({path: '../../../.env'})
const crawl = async (page, crawlInfo) => {
    return classify(crawlInfo["url"])(page, crawlInfo)
}

const params = {
    MaxNumberOfMessages: 1,
    QueueUrl: process.env.AWS_SQS_HOTELFLY_LINK_URL,
};

const main = async () => {
    await sqs.receiveMessage(params, async (err, data) => {
        if (err) {
            console.log("Receive Error", err);
        } else if (data.Messages) {

            for (const msg of data.Messages) {
                let body = []
                const crawlInfo = JSON.parse(msg.Body)
                console.log(crawlInfo)
                let browser = await getBrowser({devices: crawlInfo.devices});
                const context = await browser.contexts()[0]
                const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
                try {
                    let crawlResult = await crawl(page, crawlInfo)
                    for (let idx = 0; idx < crawlResult.length; idx++) {
                        const hotel = crawlResult[idx]
                        let item = {}
                        item["rank"] = idx+1
                        item["name"] = hotel["name"]
                        item["price"] = parseInt(hotel["price"])
                        item["identifier"] = hotel["identifier"]
                        item["link"] = hotel["link"]
                        item["checkinDate"] = crawlInfo["checkinDate"]
                        item["checkoutDate"] = crawlInfo["checkoutDate"]
                        item["keywordId"] = crawlInfo["keywordId"]
                        item["createdAt"] = crawlInfo["createdAt"]
                        item["supplierId"] = hotel["supplierId"]
                        item["tag"] = hotel["tag"]
                        body.push(item)
                    }
                    console.log(crawlInfo)
                    console.log(body)
                    console.log(body.length)
                    try {
                        await axios.post(process.env.HOTELFLY_API_HOST + '/hotel/data', {"data": body})
                        await deleteSqsMsg(msg.ReceiptHandle)
                    } catch (e) {
                        console.log(e)
                    }
                } catch (e) {
                    console.log("Error", msg.Body)
                    console.log(e)
                    await sleep(20)
                    await browser.close()
                    // const stdout = execSync(`expressvpn disconnect && expressvpn connect ${getRandom(SERVERS)}`);
                    // console.log(stdout)
                    await sleep(5)
                    // browser = await getBrowser({devices: crawlInfo.devices});
                    await sleep(5)
                }
                const allPages = context.pages();
                for (let i = 1; i < allPages.length; i++) {
                    await allPages[i].close()
                }
                await browser.close()
            }
        }
        await sleep(5)
        await main()
    })
}

await main()