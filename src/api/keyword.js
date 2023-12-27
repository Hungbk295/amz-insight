import axios from "axios";

const PATH = '/keyword'

export const read = async () => {
    return await (await axios.get(process.env.API_HOST + PATH)).data
}