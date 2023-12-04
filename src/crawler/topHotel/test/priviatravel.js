import {handle} from './handler.js'
import {crawl} from '../suppliers/priviatravel.js'

const crawlInfo = {
    url: 'https://hotel.priviatravel.com/search/us/unitedstates/hawaii-ohau-honolulu.html?checkIn=2023-12-11&checkOut=2023-12-12&occupancies=1~1~0&destinationType=CITY&destinationId=12728',
    checkinDate: '2023-07-30',
    checkoutDate: '2023-07-31',
    keywordId: 2,
    devices: ['mobile'],
    createdAt: "2023-11-30T04:37:52.580678Z"
}
const res = await handle(crawlInfo, crawl)
console.log(res)
console.log(res.length)
