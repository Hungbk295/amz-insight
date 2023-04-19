import { handle } from './handler.js'
import { crawl } from '../topHotel/suppliers/priviatravel.js'

const crawlInfo = {
	url: 'https://hotel.priviatravel.com/search/kr/country/jeju-do.html?checkIn=2023-04-20&checkOut=2023-04-21&occupancies=1~1~0&destinationType=PARENT_CITY&destinationId=100249&destinationName=%EC%A0%9C%EC%A3%BC%EB%8F%84%20%EC%A0%84%EC%B2%B4&preAction=recommend_city&timeStamp=1681894642268',
	checkinDate: '2023-04-20',
	checkoutDate: '2023-04-21',
	keywordId: 2,
	devices: ['mobile'],
}

console.log(await handle(crawlInfo, crawl))
