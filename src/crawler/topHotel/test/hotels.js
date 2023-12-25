import {handle} from "../../../utils/handler.js";
import {Hotels} from "../suppliers/hotels.js";
import {SUPPLIERS} from "../../../config/suppliers.js";

const crawlInfo = {
    "link": "https://kr.hotels.com/Hotel-Search?adults=2&children=&destination=%EC%B9%B8%EC%BF%A4%2C%20%ED%82%A8%ED%83%80%EB%82%98%EB%A1%9C%EC%98%A4%2C%20%EB%A9%95%EC%8B%9C%EC%BD%94&endDate=2024-02-03&latLong=21.161907%2C-86.851524&locale=ko_KR&mapBounds=&pwaDialog=&regionId=179995&semdtl=&sort=RECOMMENDED&startDate=2024-02-02&theme=&useRewards=false&userIntent=",
    "checkinDate": "2023-05-14",
    "checkoutDate": "2023-05-15",
    "keywordId": 2,
    supplierId: SUPPLIERS.Hotels.id
}

console.log(await handle(crawlInfo, new Hotels()))