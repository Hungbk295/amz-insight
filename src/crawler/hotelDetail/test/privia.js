import {handle} from "../../../utils/handler.js";
import {Privia} from "../suppliers/index.js";
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {
    link: 'https://hotel.priviatravel.com/view/us/unitedstates/hawaii-ohau-honolulu/hyattregencywaikikibeachresortspa.html?hotelInFlowPath=B33&checkIn=2023-12-25&checkOut=2023-12-26&occupancies=1~1~0&htlMasterId=103690&salePrice=716741&h=3',
    checkinDate: '2023-07-30',
    checkoutDate: '2023-07-31',
    keywordId: 2,
    supplierId: SUPPLIERS.Privia.id
}

console.log(await handle(task, new Privia()))
