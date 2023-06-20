import {run} from "./crawler.js";
import dotenv from "dotenv";
import {execSync} from "child_process";
import {getRandom} from "../../utils/util.js";
import {SERVERS} from "../../constants/expressvpn.js";
dotenv.config({path: '../../../.env'})

try {
    const stdout = execSync(`expressvpn connect ${getRandom(SERVERS)}`);
    console.log(stdout.toString())
} catch (e) {
}
await run(process.env.AWS_SQS_HOTELFLY_LINK_URL)