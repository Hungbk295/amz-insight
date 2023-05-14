import { handle } from './handler.js'
import { crawl } from '../suppliers/trip.js'

const crawlInfo = {
	url: 'https://kr.trip.com/hotels/list?city=286&cityName=%ED%95%98%EB%85%B8%EC%9D%B4&provinceId=0&countryId=111&districtId=0&checkin=2023/05/24&checkout=2023/05/25&barCurr=KRW',
	// url: 'https://trip.com/hotels/list?city=753&provinceId=-1&cityName=%EA%B4%8C&checkin=2023/05/24&checkout=2023/05/25&barCurr=KRW&adult=2&children=0&curr=KRW',

	checkinDate: '2023-06-14',
	checkoutDate: '2023-06-15',
	keywordId: 4,
	devices: ['mobile'],
}

console.log(await handle(crawlInfo, crawl))
