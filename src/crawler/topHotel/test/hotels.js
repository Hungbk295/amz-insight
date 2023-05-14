import {handle} from "./handler.js";
import {crawl} from "../suppliers/hotels.js";

const crawlInfo = {
    "url": "https://kr.hotels.com/Hotel-Search?adults=2&startDate=2023-05-24&endDate=2023-05-25&destination=%ED%98%B8%EB%86%80%EB%A3%B0%EB%A3%A8&locale=ko_KR",
    "checkinDate": "2023-05-14",
    "checkoutDate": "2023-05-15",
    "keywordId": 2
}

console.log(await handle(crawlInfo, crawl))