import {handle} from "../../../utils/handler.js";
import {Hotels} from "../suppliers/hotels.js";
import {SUPPLIERS} from "../../../config/suppliers.js";

const task = {"link":"Hotel-Search?adults=2&startDate=2024-11-25&endDate=2024-11-26&destination=후쿠오카&locale=ko_KR","checkIn":"2024-11-25","checkOut":"2024-11-26","keywordId":20,"createdAt":"2024-10-22T02:00:06.717Z","supplierId":6}

console.log(await handle(task, new Hotels()))