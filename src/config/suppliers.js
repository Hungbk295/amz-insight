const SUPPLIERS = {
    Privia: {
        'name': 'Privia',
        'link': 'https://hotel.priviatravel.com/',
        'id': 7,
        'userName': 'furmi78',
        'password': 'sjymirr0909!'
    },
    Agoda: {
        'name': 'Agoda',
        'link': 'https://www.agoda.com/',
        'id': 2,
        'proxy': true
    },
    Booking: {
        'name': 'Booking',
        'link': 'https://www.booking.com/',
        'id': 3,
        'devices': ['mobile'],
        'proxy': true
    },
    Expedia: {
        'name': 'Expedia',
        'link': 'https://www.expedia.co.kr/',
        'id': 1,
        'proxy': true
    },
    Hotels: {
        'name': 'Hotels',
        'link': 'https://kr.hotels.com/',
        'id': 6,
        'proxy': true
    },
    Naver: {
        'name': 'Naver',
        'link': 'https://hotels.naver.com/',
        'id': 5,
        'proxy': true
    },
    Trip: {
        'name': 'Trip',
        'link': 'https://kr.trip.com/',
        'id': 4,
        'devices': ['mobile'],
        'proxy': true
    },
    Tourvis: {
        'name': 'Tourvis',
        'link': 'https://hotel.tourvis.com/',
        'id': 8,
        'devices': ['mobile'],
        'userName': 'hoangcongkr@gmail.com',
        'password': 'dwsjy8yz34@'
    },
    Kyte: {
        'name': 'Kyte',
        'link': 'https://kyte.travel/',
        'id': 12,
        'devices': ['mobile']
    }
}

export const getConfigBySupplierId = (supplierId) => {
    return Object.values(SUPPLIERS).find(item => item.id === supplierId)
}

const INTERNAL_SUPPLIER_IDS = [
    SUPPLIERS.Tourvis.id,
    SUPPLIERS.Privia.id,
    SUPPLIERS.Kyte.id
]

const SITES = {
    detailDiscount: {
        'name': 'detailDiscount',
        'id': 8
    },
    detail: {
        'name': 'detail',
        'id': 9
    },
    discountDetailLoggedIn: {
        id: 10008,
        name: 'detaildiscountLoggedIn',
        domain: '',
    },
    detailLoggedIn: {
        id: 10009,
        name: 'detailLoggedIn',
        domain: '',
    },
}

export {SUPPLIERS, SITES, INTERNAL_SUPPLIER_IDS}
