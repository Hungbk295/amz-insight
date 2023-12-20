import '../../config/env.js'
import {run} from "./crawler.js";

if (process.argv[2])
    await run(process.env.AWS_SQS_HOTELFLY_LINK_URL_IMPORTANT, process.argv[2])
else {
    console.log("Missing worker name param")
}
