import '../../config/env.js'
import {run} from "./crawler.js";

if (process.env.WORKER_NAME)
    await run(process.env.QUEUE_IMPORTANT_TASKS_URL, process.env.WORKER_NAME)
else {
    console.log("Missing worker name param")
}
