/**
 * Input: List of destination (province), a checking date, a checkout date
 * Output: List of tasks having this format:
 *  - url: url of supplier page after searching with destination
 *      Optional (for agoda):
 *  - destination or keyword: name of destination (Hanoi, Seoul)
 *  - checkin date: checkin date
 *  - checkout date: checkout date
 */

import { createSqsMessages } from '../utils/util.js'
import axios from 'axios'
import {
    generateLink,
    getTargetDate,
    execGetInternalPrices,
} from '../utils/linkGenerator.js'
import {Suppliers} from "../constants/suppliers.js";

const createdAt = new Date()

async function main() {
    const dayTypes = ['weekday', 'weekend']
    const subsequentWeeks = [3, 5]
    const keywords = (
       await axios.get(process.env.HOTELFLY_API_HOST + '/keyword')
    ).data
    await execGetInternalPrices('GET_HOTEL_INTERNATIONAL_INTERNAL_PRICES', createdAt)
    for (const dayType of dayTypes) {
        for (const subsequentWeek of subsequentWeeks) {
            const [checkinDate, checkoutDate] = getTargetDate(
               dayType,
               subsequentWeek
            )
            const tasks = generateLink(
               keywords,
               checkinDate,
               checkoutDate, Suppliers,
               createdAt
            )
            await createSqsMessages(process.env.AWS_SQS_HOTELFLY_LINK_URL, tasks)
        }
    }
}

await main()
