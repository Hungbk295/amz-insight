import {handle} from "../../../utils/handler.js";
import { Trip } from '../suppliers/trip.js'
import {SUPPLIERS} from "../../../config/suppliers.js";

const crawlInfo = {
	link: 'https://kr.trip.com/hotels/list?city=359&provinceId=-1&cityName=%EB%B0%A9%EC%BD%95&checkin=2024/03/28&checkout=2024/03/29&barCurr=KRW&adult=2&children=0&curr=KRW',
	checkinDate: '2023-06-14',
	checkoutDate: '2023-06-15',
	keywordId: 4,
	supplierId: SUPPLIERS.Trip.id
}

console.log(await handle(crawlInfo, new Trip()))
