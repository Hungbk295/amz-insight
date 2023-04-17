import {handle} from "./handler.js";
import {crawl} from "../topHotel/suppliers/expedia.js";

const crawlInfo = {
    "url": "https://www.expedia.co.kr/Hotel-Search?adults=2&startDate=2023-05-14&endDate=2023-05-15&destination=Ha%20Noi",
    "checkinDate": "2023-05-14",
    "checkoutDate": "2023-05-15",
    "keywordId": 2
}

await handle(crawlInfo, crawl)