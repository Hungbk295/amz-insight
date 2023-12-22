import {handle} from "../../../utils/handler.js";
import {Hotels} from "../suppliers/hotels.js";
import {SUPPLIERS} from "../../../config/suppliers.js";

const crawlInfo = {
    "link": "https://kr.hotels.com/Hotel-Search?adults=2&destination=%EB%B0%A9%EC%BD%95%2C%20%EB%B0%A9%EC%BD%95%28%EC%A3%BC%29%2C%20%ED%83%9C%EA%B5%AD&endDate=2024-03-29&locale=ko_KR&regionId=604&semdtl=&sort=RECOMMENDED&startDate=2024-03-28&theme=&useRewards=false&userIntent=",
    "checkinDate": "2023-05-14",
    "checkoutDate": "2023-05-15",
    "keywordId": 2,
    supplierId: SUPPLIERS.Hotels.id
}

console.log(await handle(crawlInfo, new Hotels()))