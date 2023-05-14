import { handle } from './handler.js'
import { crawl } from '../suppliers/tourvis.js'

const crawlInfo = {
	url: 'https://hotel.tourvis.com/hotels?type=CITY&keyword=%25EA%25B4%258C%2C%2520%25EA%25B4%258C&id=686&in=20230524&out=20230525&guests=2&division=city',
	checkinDate: '2023-06-25',
	checkoutDate: '2023-06-26',
	devices: ['mobile'],

	keywordId: 2,
}

console.log(await handle(crawlInfo, crawl))
