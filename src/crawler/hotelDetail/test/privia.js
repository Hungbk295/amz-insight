import {handle} from "../../../utils/handler.js";
import {Privia} from "../suppliers/index.js";
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {
    name: '호텔 로코어 나하',
    supplierId: 7,
    identifier: '97344',
    tag: 'Hotel Rocore Naha',
    rank: 53,
    checkIn: '2024-12-02',
    checkOut: '2024-12-03',
    createdAt: '2024-10-29T02:00:06.000Z',
    link: 'view/jp/japan/okinawa/hotelrocorenaha.html?checkIn=2024-12-02&checkOut=2024-12-03&occupancies=1~1~0&htlMasterId=97344',
    keywordId: 18
  }

console.log(await handle(task, new Privia()))
