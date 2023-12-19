import {handle} from "../../../utils/handler.js";
import { crawl } from '../suppliers/trip.js'

const crawlInfo = {
	url: 'https://kr.trip.com/hotels/list?city=359&provinceId=-1&cityName=%EB%B0%A9%EC%BD%95&checkin=2023/08/28&checkout=2023/08/29&barCurr=KRW&adult=2&children=0&curr=KRW',
	checkinDate: '2023-06-14',
	checkoutDate: '2023-06-15',
	keywordId: 4,
	devices: ['mobile'],
}

console.log(await handle(crawlInfo, crawl))
