import '../../config/env.js'
import {run} from "./crawler.js";

if (!process.argv[2]) {
    console.log("Missing worker name param")
    process.exit()
}

run(process.env.QUEUE_DETAIL_TASKS_URL, process.argv[2])
