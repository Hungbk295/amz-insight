import {handle} from "../../../utils/handler.js";
import {Tourvis} from "../suppliers/index.js";
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {
    name: '쉐라톤 오키나와 선마리나 리조트',
    supplierId: 8,
    identifier: '98929',
    tag: '',
    rank: 16,
    checkIn: '2024-11-23',
    checkOut: '2024-11-24',
    createdAt: '2024-10-29T02:00:06.000Z',
    link: 'hotels/98929?type=CITY&keyword=%EC%98%A4%ED%82%A4%EB%82%98%EC%99%80&id=14026&&in=20241123&out=20241124&guests=2&pageType=main&h=1',
    keywordId: 18
  }

console.log(await handle(task, new Tourvis()))
