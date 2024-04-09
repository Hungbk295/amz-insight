import {handle} from "../../../utils/handler.js";
import {Tourvis} from "../suppliers/index.js";
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {
    link: 'hotels/4714?type=CITY&keyword=%EB%B6%80%EC%82%B0%EA%B4%91%EC%97%AD%EC%8B%9C&id=38045&&in=20240628&out=20240629&guests=2&pageType=main&h=1',
    checkIn: '2023-07-30',
    checkOut: '2023-07-31',
    keywordId: 2,
    supplierId: SUPPLIERS.Tourvis.id,
    needLoggedInPrice: true,
}

console.log(await handle(task, new Tourvis()))
