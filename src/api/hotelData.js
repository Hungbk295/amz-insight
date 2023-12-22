import axios from "axios";

const PATH = '/hotel/data'

export const create = async (data) => {
    return await axios.post(process.env.API_HOST + PATH, {
        'data': data
    })
}