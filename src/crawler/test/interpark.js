import { handle } from './handler.js'
import { crawl } from '../topHotel/suppliers/interpark.js'

const crawlInfo = {
	url: 'https://mtravel.interpark.com/checkinnow/search/keyword?q=&disp_q=%EA%B0%95%EC%9B%90&coord=&startdate=20230421&enddate=20230422&roomOptions=0%5E2%5E0&npprmaxsort=min&apiType=region&regioncode1=42080&regioncode2&category=',
	checkinDate: '2023-05-14',
	checkoutDate: '2023-05-15',
	keywordId: 2,
	devices: ['mobile'],
}

console.log(await handle(crawlInfo, crawl))
