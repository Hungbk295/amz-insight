import '../config/env.js'
import {SUPPLIERS} from "../config/suppliers.js";
import {Agoda, Booking, Expedia, Hotels, Kyte, Naver, Privia, Tourvis, Trip} from "./suppliers/index.js";
import {Lambda} from '@aws-sdk/client-lambda';
import axios from "axios";
import {getConditions} from "../utils/util.js";
import {DAY_OF_WEEKS_CONDITION, SUBSEQUENT_WEEKS_CONDITION} from "../config/app.js";
import { createSqsMessages } from '../utils/awsSdk.js'

const taskGenerators = {
    [SUPPLIERS.Agoda.name]: new Agoda(),
    [SUPPLIERS.Booking.name]: new Booking(),
    [SUPPLIERS.Expedia.name]: new Expedia(),
    [SUPPLIERS.Hotels.name]: new Hotels(),
    [SUPPLIERS.Kyte.name]: new Kyte(),
    [SUPPLIERS.Naver.name]: new Naver(),
    [SUPPLIERS.Privia.name]: new Privia(),
    [SUPPLIERS.Tourvis.name]: new Tourvis(),
    [SUPPLIERS.Trip.name]: new Trip(),
}

export function generateLink(keywords, dayOfWeeks, subsequentWeeks, suppliers, createdAt) {
    const conditions = getConditions(dayOfWeeks, subsequentWeeks, keywords, suppliers);
    return conditions.map(condition => taskGenerators[condition['supplier'].name].generateTopHotelTask(
        condition['checkIn'], condition['checkOut'], condition['keyword'], createdAt));
}

export function getDateInString(date) {
    let month = date.getMonth() + 1
    month = month < 10 ? `0${month}` : month
    let day = date.getDate()
    day = day < 10 ? `0${day}` : day
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
}

export function getTargetDate(dayOfWeek, subsequentWeek) {
    let date = new Date()
    date.setDate(date.getDate() + (dayOfWeek - (date.getDay() % 7)) + 7 * subsequentWeek)
    const checkin = getDateInString(date)
    date = new Date()
    date.setDate(date.getDate() + (dayOfWeek + 1 - (date.getDay() % 7)) + 7 * subsequentWeek)
    const checkout = getDateInString(date)

    return [checkin, checkout]
}

export async function execGetInternalPrices(action, createdAt) {
    const lambda = new Lambda();
    const params = {
        FunctionName: 'hotel-internal-data', /* required */
        Payload: JSON.stringify({
            'action': action, 'createdAt': createdAt.toISOString()
        })
    };
    await lambda.invoke(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}

async function main() {
    const createdAt = new Date()
    const keywords = (await axios.get(process.env.API_HOST + '/keyword')).data
    const tasks = generateLink(keywords, DAY_OF_WEEKS_CONDITION, SUBSEQUENT_WEEKS_CONDITION, SUPPLIERS, createdAt)
    // await createSqsMessages(process.env.QUEUE_TASKS_URL, tasks))
    console.log(tasks)
}
