import {handle} from "../../../utils/handler.js";
import {Tourvis} from "../suppliers/index.js";
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {
    link: 'https://hotel.tourvis.com/hotels/69018?type=CITY&keyword=%25EC%2598%25A4%25EC%2582%25AC%25EC%25B9%25B4%2C%2520%25EC%259D%25BC%25EB%25B3%25B8&id=12495&in=20231229&out=20231230&guests=2&division=city&pageType=main&h=1',
    checkinDate: '2023-07-30',
    checkoutDate: '2023-07-31',
    keywordId: 2,
    supplierId: SUPPLIERS.Tourvis.id
}

console.log(await handle(task, new Tourvis()))
