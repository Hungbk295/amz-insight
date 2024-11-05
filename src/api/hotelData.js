import axios from "axios";
import moment from 'moment/moment.js'

const PATH = '/hotel-data'

export const create = async (data) => {
    try{
        const currentTime = new Date()
        const durationHour = Math.abs(currentTime - moment(data[0].createdAt))/ (1000 * 60 * 60);
        if(durationHour > 6) {
            console.log(`[INSERT]:Alert Here createdAt:${task.createdAt} -> ${currentTime}`)
        }
    } catch (e){}
    return await axios.post(process.env.API_HOST + PATH, {
        'data': data
    })
}