import {sendMessages} from "../utils/util.js";
import axios from "axios";


async function main() {
    const tasks = (await axios.get(process.env.HOTELFLY_API_HOST + '/hotel/noDetail')).data
    console.log(tasks)
    await sendMessages(tasks)
}

await main()
