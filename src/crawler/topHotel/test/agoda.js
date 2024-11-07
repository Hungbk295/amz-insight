import {handle} from "../../../utils/handler.js";
import { Agoda } from '../suppliers/agoda.js'
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {"link":"ko-kr/search?city=2679&isdym=true&searchterm=냐짱&locale=ko-kr&currency=KRW&pageTypeId=1&realLanguageId=9&languageId=9&origin=KR&cid=-1&whitelabelid=1&loginLvl=0&storefrontId=3&currencyId=26&currencyCode=KRW&htmlLanguage=ko-kr&cultureInfoName=ko-kr&trafficSubGroupId=4&aid=130243&cttp=4&isRealUser=true&mode=production&browserFamily=Chrome&checkIn=2024-11-30&checkOut=2024-12-01&rooms=1&adults=1&children=0&priceCur=KRW&los=1&textToSearch=Hanoi&travellerType=0&familyMode=off","checkIn":"2024-11-30","checkOut":"2024-12-01","keywordId":28,"createdAt":"2024-11-06T02:00:05.832Z","supplierId":2} 

console.log(await handle(task, new Agoda()))
