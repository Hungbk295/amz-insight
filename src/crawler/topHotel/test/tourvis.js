import {handle} from "../../../utils/handler.js";
import { crawl } from '../suppliers/tourvis.js'

const crawlInfo = {
	url: 'https://hotel.tourvis.com/hotels?type=CITY&keyword=%25EC%2584%259C%25EC%259A%25B8%25ED%258A%25B9%25EB%25B3%2584%25EC%258B%259C%2520%25EC%25A0%2584%25EC%25B2%25B4%2C%2520%25ED%2595%259C%25EA%25B5%25AD&id=100239&in=20230724&out=20230725&guests=2&division=parent_city',
	checkinDate: '2023-07-25',
	checkoutDate: '2023-07-26',
	devices: ['mobile'],

	keywordId: 2,
}

console.log(await handle(crawlInfo, crawl))
