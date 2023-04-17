import {handle} from "./handler.js";
import {crawl} from "../topHotel/suppliers/hotels.js";

const crawlInfo = {
    "url": "https://kr.hotels.com/Hotel-Search?destination=%ED%95%98%EB%85%B8%EC%9D%B4&selected=&d1=2023-06-23&startDate=2023-06-23&d2=2023-06-24&endDate=2023-06-24&adults=2&rooms=1",
    "checkinDate": "2023-05-14",
    "checkoutDate": "2023-05-15",
    "keywordId": 2
}

console.log(await handle(crawlInfo, crawl))