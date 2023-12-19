import { handle } from '../../handler.js'
import { crawl } from '../suppliers/yanolja.js'

const crawlInfo = {
	url: 'https://www.yanolja.com/search/%EC%84%9C%EC%9A%B8',
	checkinDate: '2023-05-14',
	checkoutDate: '2023-05-15',
	keywordId: 2,
	// devices: ['mobile'],
}

console.log(await handle(crawlInfo, crawl))
