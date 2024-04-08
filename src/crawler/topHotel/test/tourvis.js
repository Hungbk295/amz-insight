import { handle } from '../../../utils/handler.js'
import { Tourvis } from '../suppliers/tourvis.js'
import { SUPPLIERS } from '../../../config/suppliers.js'

const task = {
	'link': 'hotels?type=CITY&keyword=%EB%8B%A4%EB%82%AD&id=15466&in=20240429&out=20240430&guests=2',
	'checkIn': '2024-04-29',
	'checkOut': '2024-04-30',
	'keywordId': 21,
	'createdAt': '2024-04-07T17:00:04.724Z',
	'supplierId': 8,
}

console.log(await handle(task, new Tourvis()))
