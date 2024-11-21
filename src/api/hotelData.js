import axios from "axios";
import {checkTaskTime} from "../utils/util.js";

const PATH = '/hotel-data'

export const create = async (data) => {
    if(data?.length){
        checkTaskTime({
            createdAt:data[0].createdAt,
            data
        },'Execution inter result insert')
    }
    return await axios.post(process.env.API_HOST + PATH, {
        'data': data
    })
}