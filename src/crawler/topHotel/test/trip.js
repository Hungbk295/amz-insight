import { handle } from './handler.js'
import { crawl } from '../suppliers/trip.js'

const crawlInfo = {
	url: 'https://kr.trip.com/hotels/list?city=0&provinceId=11059&cityName=%EC%98%A4%ED%82%A4%EB%82%98%EC%99%80&checkin=2023%2F05%2F31&checkout=2023%2F06%2F1&barCurr=KRW&adult=2&children=0&fbclid=IwAR28ABUInmTE7NSeWRdy5J-vnJnyVpSA-ARVCR5Qynhdr7nYLvzILOg36tQ&oldLocale=ko-KR',
	// url: 'https://trip.com/hotels/list?city=753&provinceId=-1&cityName=%EA%B4%8C&checkin=2023/05/24&checkout=2023/05/25&barCurr=KRW&adult=2&children=0&curr=KRW',

	checkinDate: '2023-06-14',
	checkoutDate: '2023-06-15',
	keywordId: 4,
	devices: ['mobile'],
}

console.log(await handle(crawlInfo, crawl))
