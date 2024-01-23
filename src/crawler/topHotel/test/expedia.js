import {handle} from "../../../utils/handler.js";
import { Expedia } from '../suppliers/expedia.js'
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {
	link: 'Hotel-Search?adults=2&startDate=2024-05-21&endDate=2024-05-22&destination=%EA%B4%8C',
	checkIn: '2024-05-14',
	checkOut: '2024-05-15',
	keywordId: 2,
	supplierId: SUPPLIERS.Expedia.id
}

console.log(await handle(task, new Expedia()))
