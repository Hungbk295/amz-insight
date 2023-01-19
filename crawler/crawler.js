import {crawl as crawlAgoda} from './suppliers/agoda.js'
import {crawl as crawlExpedia} from './suppliers/expedia.js'

const crawlDefault = () => {return null}

export const classify = (link) => {
    if (link === undefined) return null
    if (link.includes("www.expedia")) return "expedia"
    if (link.includes("www.agoda")) return "agoda"
}

export const crawlerList = {
    "": crawlDefault,
    "agoda": crawlAgoda,
    "expedia": crawlExpedia
}
