import dotenv from "dotenv";
import * as path from "path";

const srcPath = path.resolve().split('src')[0]
dotenv.config({path: srcPath + '/.env'})