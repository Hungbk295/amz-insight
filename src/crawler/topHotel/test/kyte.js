import {handle} from "../../../utils/handler.js";
import {Kyte} from '../suppliers/kyte.js'
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {
    link: 'hotels/list?id=70&keyword=%EA%B4%8C&type=SEARCH_SOURCE_REGION_EPS&no_cal=true&guests=2&in=20240421&out=20240422',
    checkinDate: '2023-09-04',
    checkoutDate: '2023-09-05',
    keywordId: 26,
    keyword: '유후인',
    createdAt: '2023-08-03T02:00:05.000Z',
    supplierId: SUPPLIERS.Kyte.id
}

console.log(await handle(task, new Kyte()))

