import '../../config/env.js'
import {run} from "./crawler.js";

if (process.argv[2])
    await run(process.env.QUEUE_IMPORTANT_TASKS_URL, process.argv[2])
else {
    console.log("Missing worker name param")
}
