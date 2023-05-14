import { handle } from './handler.js'
import { crawl } from '../suppliers/tourvis.js'

const crawlInfo = {
	url: 'https://hotel.tourvis.com/hotels?type=CITY&keyword=%EB%B0%A9%EC%BD%95&id=5673&in=20230524&out=20230525&guests=2',
	checkinDate: '2023-06-25',
	checkoutDate: '2023-06-26',
	devices: ['mobile'],

	keywordId: 2,
}

console.log(await handle(crawlInfo, crawl))
