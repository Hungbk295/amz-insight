import {handle} from "../../../utils/handler.js";
import {Naver} from "../suppliers/naver.js";

const crawlInfo = {
    "url": "https://hotels.naver.com/list?placeFileName=place%3ASeoul&adultCnt=2&checkIn=2024-03-25&checkOut=2024-03-26&includeTax=true&sortField=popularityKR&sortDirection=descending",
    "checkinDate": "2023-06-13",
    "checkoutDate": "2023-06-14",
    "keywordId": 1,
    "keyword": '오사카'
}

console.log(await handle(crawlInfo, new Naver()))