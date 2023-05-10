import {handle} from "./handler.js";
import {crawl} from "../suppliers/hotels.js";

const crawlInfo = {
    "url": "https://kr.hotels.com/ho1065891776/la-pe-hanoi-hotel-hanoi-beteunam/?=one-key-onboarding-dialog&chkin=2023-05-17&chkout=2023-05-18&destType=MARKET&destination=Ha%20Noi%20Gallery%2C%20Hanoi%2C%20Vietnam&expediaPropertyId=33277868&latLong=21.032228%2C105.85287&neighborhoodId=553248635974587449&pwa_ts=1683692514758&referrerUrl=aHR0cHM6Ly9rci5ob3RlbHMuY29tL0hvdGVsLVNlYXJjaA%3D%3D&regionId=553248621532743042&rfrr=HSR&rm1=a2&selectedRatePlan=388198831&selectedRoomType=321209749&sort=RECOMMENDED&top_cur=KRW&top_dp=42749&useRewards=false&userIntent=&x_pwa=1",
    "checkinDate": "2023-05-14",
    "checkoutDate": "2023-05-15",
    "keywordId": 2
}

console.log(await handle(crawlInfo, crawl))