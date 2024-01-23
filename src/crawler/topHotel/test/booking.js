import {handle} from "../../../utils/handler.js";
import { Booking } from '../suppliers/booking.js'
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {
    link: 'searchresults.ko.html?ss=Seoul&ssne=Seoul&ssne_untouched=Seoul&lang=ko&dest_type=city&checkin=2024-03-25&checkout=2024-03-26&group_adults=2&no_rooms=1&group_children=0&soz=1',
    checkIn: '2024-03-25',
    checkOut: '2024-03-26',
    keywordId: 2,
    supplierId: SUPPLIERS.Booking.id
}

console.log(await handle(task, new Booking()))
