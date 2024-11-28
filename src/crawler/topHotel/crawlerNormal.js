import '../../config/env.js'
import {run} from "./crawler.js";

if (!process.env.WORKER_NAME) {
    console.log("Missing worker name param")
    process.exit()
}

await run(process.env.QUEUE_TASKS_URL, process.env.WORKER_NAME)
