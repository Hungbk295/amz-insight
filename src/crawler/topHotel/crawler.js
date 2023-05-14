import { crawl as crawlAgoda } from './suppliers/agoda.js'
import { crawl as crawlExpedia } from './suppliers/expedia.js'
import { crawl as crawlBooking } from './suppliers/booking.js'
import { crawl as crawlTrip } from './suppliers/trip.js'
import { crawl as crawlNaver } from './suppliers/naver.js'
import { crawl as crawlHotels } from './suppliers/hotels.js'
import { crawl as crawlPrivia } from './suppliers/priviatravel.js'

const crawlDefault = (url) => {
	return []
}

export const classify = link => {
	if (link === undefined) return crawlDefault
	if (link.includes('https://hotels.naver.com/')) return crawlNaver
	if (link.includes('https://www.expedia.co.kr/')) return crawlExpedia
	if (link.includes('https://www.agoda.com/ko-kr/')) return crawlAgoda
	if (link.includes('https://www.booking.com/')) return crawlBooking
	if (link.includes('https://kr.trip.com/')) return crawlTrip
	if (link.includes('https://kr.hotels.com/')) return crawlHotels
	if (link.includes('https://hotel.priviatravel.com/')) return crawlPrivia
}

