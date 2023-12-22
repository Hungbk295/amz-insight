import {handle} from "../../../utils/handler.js";
import { Agoda } from '../suppliers/agoda.js'
import {SUPPLIERS} from "../../../config/suppliers.js";

const crawlInfo = {
    link: 'https://www.agoda.com/ko-kr/search?city=4001&isdym=true&searchterm=세부&locale=ko-kr&currency=KRW&pageTypeId=1&realLanguageId=9&languageId=9&origin=KR&cid=-1&whitelabelid=1&loginLvl=0&storefrontId=3&currencyId=26&currencyCode=KRW&htmlLanguage=ko-kr&cultureInfoName=ko-kr&trafficSubGroupId=4&aid=1303&cttp=4&isRealUser=true&mode=production&browserFamily=Chrome&checkIn=2023-04-01&checkOut=2023-04-02&rooms=1&adults=1&children=0&priceCur=KRW&los=1&textToSearch=Hanoi&travellerType=0&familyMode=off',
    checkinDate: '2023-12-25',
    checkoutDate: '2023-12-26',
    keywordId: 2,
    supplierId: SUPPLIERS.Agoda.id
}

console.log(await handle(crawlInfo, new Agoda()))
