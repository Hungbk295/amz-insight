import {handle} from "../../../utils/handler.js";
import {Privia} from '../suppliers/privia.js'

const crawlInfo = {
    url: 'https://hotel.priviatravel.com/search/us/unitedstates/hawaii-ohau-honolulu.html?checkIn=2024-02-30&checkOut=2024-02-31&occupancies=1~1~0&destinationType=CITY&destinationId=12728',
    checkinDate: '2023-12-30',
    checkoutDate: '2023-12-31',
    keywordId: 2,
    devices: ['mobile'],
    createdAt: "2023-11-30T04:37:52.580678Z"
}
const res = await handle(crawlInfo, new Privia())
console.log(res)
console.log(res.length)
