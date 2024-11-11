import {getTargetDate} from "../linkGenerator/topHotel.js";

export const sleep = s => new Promise(r => setTimeout(r, s * 1000))
export const getRandomInt = (min, max) => Math.random() * (max - min) + min
export const getRandom = list => list[Math.floor(Math.random() * list.length)]
export const scroll = async args => {
    const {direction, speed} = args
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    const scrollHeight = () => document.body.scrollHeight / 10
    const start = direction === 'down' ? 0 : scrollHeight()
    const shouldStop = position =>
        direction === 'down' ? position > scrollHeight() - 500 : position < 0
    const increment = direction === 'down' ? 200 : -50
    const delayTime = speed === 'slow' ? 100 : 10
    console.error(start, shouldStop(start), increment)
    for (let i = start; !shouldStop(i); i += increment) {
        window.scrollTo(0, i)
        await delay(delayTime)
    }
}

export const scrollStep = async args => {
    const {direction, speed, step} = args
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    const scrollHeight = (step) => step * 400
    const start = direction === 'down' ? 0 : scrollHeight(step)
    const shouldStop = position =>
        direction === 'down' ? position > scrollHeight(step) : position < 0
    const increment = direction === 'down' ? 101 : -50
    const delayTime = speed === 'slow' ? 50 : 10
    console.error(start, shouldStop(start), increment)
    for (let i = start; !shouldStop(i); i += increment) {
        window.scrollTo(0, i)
        await delay(delayTime)
    }
}

export const getConditions = (dayOfWeeks, subsequentWeeks, keywords, suppliers) => {
    const conditions = []
    for (const keyword of keywords) {
        for (const dayOfWeek of dayOfWeeks) {
            for (const subsequentWeek of subsequentWeeks) {
                for(const supplierName in suppliers) {
                    const [checkIn, checkOut] = getTargetDate(dayOfWeek, subsequentWeek)
                    conditions.push({
                        checkIn, checkOut, supplier: suppliers[supplierName], keyword
                    })
                }
            }
        }
    }
    return conditions;
}
export function checkTaskTime(task,title) {
    const currentTime = new Date()
    const durationHour = Math.abs(currentTime - moment(task.createdAt))/ (1000 * 60 * 60);
    if(durationHour > 6) {
        console.log(`${title} createdAt:${task.createdAt} -> ${currentTime}`)
    }
}