import {handle} from "./handler.js";
import {crawl} from "../topHotel/suppliers/hotels.js";

const crawlInfo = {
    "url": "https://kr.hotels.com/Hotel-Search?adults=2&d1=2023-06-13&d2=2023-06-14&destination=Ha%20Noi%20Gallery%2C%20Hanoi%2C%20Vietnam&endDate=2023-05-03&locale=en_US&regionId=553248621532743042&semdtl=&sort=RECOMMENDED&startDate=2023-05-02&theme=&useRewards=false&userIntent=",
    // "url": "https://kr.hotels.com/Hotel-Search?destination=%ED%95%98%EB%85%B8%EC%9D%B4&selected=&d1=2023-06-23&startDate=2023-06-23&d2=2023-06-24&endDate=2023-06-24&adults=2&rooms=1",
    "checkinDate": "2023-05-14",
    "checkoutDate": "2023-05-15",
    "keywordId": 2
}

console.log(await handle(crawlInfo, crawl))