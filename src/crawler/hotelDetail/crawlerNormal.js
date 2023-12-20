import '../../config/env.js'
import {run} from "./crawler.js";

if (!process.argv[2]) {
    console.log("Missing worker name param")
    process.exit()
}

await run(process.env.AWS_SQS_HOTELFLY_HOTEL_DETAILS_LINK_URL, process.argv[2])
