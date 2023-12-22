import '../../config/env.js'
import axios from "axios";
import {createSqsMessages} from "../../utils/awsSdk.js";
import {SUPPLIERS} from "../../config/suppliers.js";
import {generateLink} from "../topHotel.js";

const createdAt = new Date()
const dayTypes = ['weekday']
const subsequentWeeks = [2]
const keywords = (await axios.get(process.env.API_HOST + '/keyword')).data

await createSqsMessages(process.env.QUEUE_TASKS_URL, generateLink(keywords, dayTypes, subsequentWeeks, SUPPLIERS, createdAt))