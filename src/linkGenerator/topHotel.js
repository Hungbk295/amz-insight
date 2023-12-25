import '../config/env.js'
import {SUPPLIERS} from "../config/suppliers.js";
import {Agoda, Booking, Expedia, Hotels, Kyte, Naver, Privia, Tourvis, Trip} from "./suppliers/index.js";
import {Lambda} from '@aws-sdk/client-lambda';
import axios from "axios";

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

export function generateLink(keywords, dayTypes, subsequentWeeks, suppliers, createdAt) {
    let tasks = []
    for (const keywordItem of keywords) {
        for (const dayType of dayTypes) {
            for (const subsequentWeek of subsequentWeeks) {
                for (const idxSup in suppliers) {
                    const [checkinDate, checkoutDate] = getTargetDate(dayType, subsequentWeek)
                    const task = taskGenerators[idxSup].generateTaskForTopHotel(checkinDate, checkoutDate, keywordItem, createdAt)
                    tasks.push(task)
                }
            }
        }
    }
    return tasks
}

export function getDateInString(date) {
    let month = date.getMonth() + 1
    month = month < 10 ? `0${month}` : month
    let day = date.getDate()
    day = day < 10 ? `0${day}` : day
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
}

export function getTargetDate(dayType, subsequentWeek) {
    const targetDayInWeek = dayType === 'weekday' ? 1 : 6
    let date = new Date()
    date.setDate(date.getDate() + (targetDayInWeek - (date.getDay() % 7)) + 7 * subsequentWeek)
    const checkin = getDateInString(date)
    date = new Date()
    date.setDate(date.getDate() + (targetDayInWeek + 1 - (date.getDay() % 7)) + 7 * subsequentWeek)
    const checkout = getDateInString(date)

    return [checkin, checkout]
}

export async function execGetInternalPrices(action, createdAt) {
    const lambda = new Lambda();
    const params = {
        FunctionName: 'hotel-internal-data', /* required */
        Payload: JSON.stringify({
            'action': action,
            'createdAt': createdAt.toISOString()
        })
    };
    await lambda.invoke(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}

async function main() {
    const createdAt = new Date()
    const dayTypes = ['weekday', 'weekend']
    const subsequentWeeks = [1, 2]
    const keywords = (await axios.get(process.env.HOTELFLY_API_HOST + '/keyword')).data
    const tasks = generateLink(keywords, dayTypes, subsequentWeeks, SUPPLIERS, createdAt)
    console.log(tasks)
}
