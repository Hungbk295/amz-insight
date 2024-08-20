import {handle} from "../../../utils/handler.js";
import {Privia} from '../suppliers/privia.js'
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {
    link: 'search/us/unitedstates/hawaii-ohau-honolulu.html?checkIn=2024-12-30&checkOut=2024-12-31&occupancies=1~1~0&destinationType=CITY&destinationId=12728',
    checkIn: '2024-12-30',
    checkOut: '2024-12-31',
    keywordId: 2,
    createdAt: "2023-11-30T04:37:52.580678Z",
    supplierId: SUPPLIERS.Privia.id
}
const res = await handle(task, new Privia())
console.log(res)
console.log(res.length)
