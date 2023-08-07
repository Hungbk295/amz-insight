import {handle} from "./handler.js";
import {crawl} from "../suppliers/hotels.js";

const crawlInfo = {
    "url": "https://kr.hotels.com/Hotel-Search?adults=2&destination=%EB%B0%A9%EC%BD%95%2C%20%EB%B0%A9%EC%BD%95%28%EC%A3%BC%29%2C%20%ED%83%9C%EA%B5%AD&endDate=2023-08-29&locale=ko_KR&regionId=604&semdtl=&sort=RECOMMENDED&startDate=2023-08-28&theme=&useRewards=false&userIntent=",
    "checkinDate": "2023-05-14",
    "checkoutDate": "2023-05-15",
    "keywordId": 2
}

console.log(await handle(crawlInfo, crawl))