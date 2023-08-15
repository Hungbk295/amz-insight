import { handle } from './handler.js'
import { crawl } from '../suppliers/expedia.js'

const crawlInfo = {
	url: 'https://www.expedia.co.kr/Hotel-Search?adults=2&startDate=2023-09-21&endDate=2023-09-22&destination=%EA%B4%8C',
	checkinDate: '2023-05-14',
	checkoutDate: '2023-05-15',
	keywordId: 2,
}

console.log(await handle(crawlInfo, crawl))
