/**
 * Input: List of destination (province), a checking date, a checkout date
 * Output: List of tasks having this format:
 *  - url: url of supplier page after searching with destination
 *      Optional (for agoda):
 *  - destination or keyword: name of destination (Hanoi, Seoul)
 *  - checkin date: checkin date
 *  - checkout date: checkout date
 */

import axios from 'axios'
import {execGetInternalPrices, generateLink} from './linkGenerator.js'
import {Suppliers} from "../constants/suppliers.js"

async function main() {
    const createdAt = new Date()
    const dayTypes = ['weekday', 'weekend']
    const subsequentWeeks = [3, 5]
    const keywords = (await axios.get(process.env.HOTELFLY_API_HOST + '/keyword')).data
    await execGetInternalPrices('GET_HOTEL_INTERNATIONAL_INTERNAL_PRICES', createdAt)
    await generateLink(keywords, dayTypes, subsequentWeeks, Suppliers, createdAt)
}

await main()
