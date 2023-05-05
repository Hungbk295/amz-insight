import { crawl as crawlAgoda } from '../topHotel/suppliers/agoda.js'
import { crawl as crawlExpedia } from '../topHotel/suppliers/expedia.js'
import { crawl as crawlBooking } from '../topHotel/suppliers/booking.js'
import { crawl as crawlTrip } from '../topHotel/suppliers/trip.js'
import { crawl as crawlNaver } from '../topHotel/suppliers/naver.js'
import { crawl as crawlHotels } from '../topHotel/suppliers/hotels.js'
import { crawl as crawlPrivia } from '../topHotel/suppliers/priviatravel.js'

const crawlDefault = (url) => {
	return []
}

export const classify = link => {
	if (link === undefined) return crawlDefault
	if (link.includes('https://hotels.naver.com/')) return crawlNaver
	if (link.includes('https://www.expedia.co.kr/')) return crawlExpedia
	if (link.includes('https://www.agoda.com/ko-kr/')) return crawlAgoda
	if (link.includes('https://www.booking.com/')) return crawlBooking
	if (link.includes('https://trip.com/')) return crawlTrip
	if (link.includes('https://kr.hotels.com/')) return crawlHotels
	if (link.includes('https://hotel.priviatravel.com/search/')) return crawlPrivia
}

