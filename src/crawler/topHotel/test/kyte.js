import {handle} from './handler.js'
import {crawl} from '../suppliers/kyte.js'

const crawlInfo = {
    url: 'https://kyte.travel/hotels/list?id=70&keyword=%EA%B4%8C&type=SEARCH_SOURCE_REGION_EPS&no_cal=true&guests=2&in=20230821&out=20230822',
    devices: [ 'mobile' ],
    checkinDate: '2023-09-04',
    checkoutDate: '2023-09-05',
    keywordId: 26,
    keyword: '유후인',
    createdAt: '2023-08-03T02:00:05.000Z'
}

console.log(await handle(crawlInfo, crawl))

