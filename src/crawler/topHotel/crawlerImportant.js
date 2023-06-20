import {run} from "./crawler.js";
import dotenv from "dotenv";

dotenv.config({path: '../../../.env'})

await run(process.env.AWS_SQS_HOTELFLY_LINK_URL_IMPORTANT)