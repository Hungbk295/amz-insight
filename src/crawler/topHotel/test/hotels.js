import {handle} from "./handler.js";
import {crawl} from "../suppliers/hotels.js";

const crawlInfo = {
    "url": "https://kr.hotels.com/Hotel-Search?adults=2&d1=2023-06-13&d2=2023-06-14&destination=Ha%20Noi%20Gallery%2C%20Hanoi%2C%20Vietnam&endDate=2023-05-03&locale=en_US&regionId=553248621532743042&semdtl=&sort=RECOMMENDED&startDate=2023-05-02&theme=&useRewards=false&userIntent=",
    "checkinDate": "2023-05-14",
    "checkoutDate": "2023-05-15",
    "keywordId": 2
}

console.log(await handle(crawlInfo, crawl))