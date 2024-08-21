import {handle} from "../../../utils/handler.js";
import {Privia} from "../suppliers/index.js";
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {
    link: 'view/gu/guam/guam/leopalaceresortguam.html?checkIn=2024-09-28&checkOut=2024-09-29&occupancies=1~1~0&htlMasterId=37174',
    checkIn: '2023-07-30',
    checkOut: '2023-07-31',
    keywordId: 2,
    supplierId: SUPPLIERS.Privia.id
}

console.log(await handle(task, new Privia()))
