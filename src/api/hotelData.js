import axios from "axios";

const PATH = '/hotel/data'

export const create = async (data) => {
    return await axios.post(process.env.HOTELFLY_API_HOST + PATH, {
        'data': data
    })
}