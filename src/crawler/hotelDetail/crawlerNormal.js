import {run} from "./crawler.js";
import dotenv from "dotenv";

dotenv.config({path: '../../../.env'})

if (!process.argv[2]) {
    console.log("Missing worker name param")
    process.exit()
}
console.log(process)

await run('https://sqs.ap-northeast-2.amazonaws.com/836881754257/detail-hotel-fly-dev', process.argv[2])
