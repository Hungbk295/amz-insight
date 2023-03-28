import { crawl as crawlAgoda } from './suppliers/getTop/agoda.js'
import { crawl as crawlExpedia } from './suppliers/getTop/expedia.js'
import { crawl as crawlBooking } from './suppliers/getTop/boking.js'
import { crawl as crawlTrip } from './suppliers/getTop/trip.js'
import { crawl as crawlNaver } from './suppliers/getTop/naver.js'
import { crawl as crawlHotels } from './suppliers/getTop/hotels.js'

const crawlDefault = () => {
	return null
}

export const classify = link => {
	if (link === undefined) return null
	if (link.includes('naver')) return 'naver'
	if (link.includes('www.expedia')) return 'expedia'
	if (link.includes('www.agoda')) return 'agoda'
	if (link.includes('www.booking')) return 'booking'
	if (link.includes('trip')) return 'trip'
	if (link.includes('hotels')) return 'hotels'

}

export const crawlerList = {
	'': crawlDefault,
	naver: crawlNaver,
	agoda: crawlAgoda,
	expedia: crawlExpedia,
	booking: crawlBooking,
	trip: crawlTrip,
	hotels: crawlHotels,
}
