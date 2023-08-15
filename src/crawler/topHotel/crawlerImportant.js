import {run} from "./crawler.js";
import dotenv from "dotenv";

dotenv.config({path: '../../../.env'})

if (process.argv[2])
    await run(process.env.AWS_SQS_HOTELFLY_LINK_URL_IMPORTANT, process.argv[2])
else {
    console.log("Missing worker name param")
}
