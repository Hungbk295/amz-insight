import {handle} from "../../../utils/handler.js";
import { Expedia } from '../suppliers/expedia.js'

const crawlInfo = {
	url: 'https://www.expedia.co.kr/Hotel-Search?adults=2&startDate=2024-05-21&endDate=2024-05-22&destination=%EA%B4%8C',
	checkinDate: '2024-05-14',
	checkoutDate: '2024-05-15',
	keywordId: 2,
}

console.log(await handle(crawlInfo, new Expedia()))
