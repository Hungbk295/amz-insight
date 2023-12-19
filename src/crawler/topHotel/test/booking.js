import {handle} from "../../../utils/handler.js";
import { Booking } from '../suppliers/booking.js'

const crawlInfo = {
    url: 'https://www.booking.com/searchresults.ko.html?ss=Seoul&ssne=Seoul&ssne_untouched=Seoul&lang=ko&dest_type=city&checkin=2024-03-25&checkout=2024-03-26&group_adults=2&no_rooms=1&group_children=0&soz=1',
    checkinDate: '2024-03-25',
    checkoutDate: '2024-03-26',
    keywordId: 2,
    devices: ['mobile']
}

console.log(await handle(crawlInfo, new Booking()))
