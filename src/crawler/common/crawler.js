import { crawl as crawlAgoda } from '../topHotel/suppliers/agoda.js'
import { crawl as crawlExpedia } from '../topHotel/suppliers/expedia.js'
import { crawl as crawlBooking } from '../topHotel/suppliers/booking.js'
import { crawl as crawlTrip } from '../topHotel/suppliers/trip.js'
import { crawl as crawlNaver } from '../topHotel/suppliers/naver.js'
import { crawl as crawlHotels } from '../topHotel/suppliers/hotels.js'

const crawlDefault = () => {
	return null
}

export const classify = link => {
	if (link === undefined) return ''
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
