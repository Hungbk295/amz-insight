import {handle} from "../../../utils/handler.js";
import { crawl } from '../suppliers/booking.js'

const crawlInfo = {
    url: 'https://www.booking.com/searchresults.ko.html?ss=Seoul&ssne=Seoul&ssne_untouched=Seoul&lang=ko&dest_type=city&checkin=2023-06-25&checkout=2023-06-26&group_adults=2&no_rooms=1&group_children=0&soz=1',
    checkinDate: '2023-06-25',
    checkoutDate: '2023-06-26',
    keywordId: 2,
    devices: ['mobile']
}

console.log(await handle(crawlInfo, crawl))
