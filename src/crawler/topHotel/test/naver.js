import {handle} from "./handler.js";
import {crawl} from "../suppliers/naver.js";

const crawlInfo = {
    "url": "https://hotels.naver.com/list?placeFileName=place%3AHanoi&adultCnt=2&checkIn=2023-06-13&checkOut=2023-06-14&includeTax=false&sortField=popularityKR&sortDirection=descending",
    "checkinDate": "2023-06-13",
    "checkoutDate": "2023-06-14",
    "keywordId": 1
}

console.log(await handle(crawlInfo, crawl))