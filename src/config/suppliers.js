const Suppliers = {
    Priviatravel: {
        'name': 'Priviatravel',
        'url': 'https://hotel.priviatravel.com/',
        'id': 7,
        'userName': 'furmi78',
        'password': 'sjymirr0909!'
    },
    Agoda: {
        'name': 'Agoda',
        'url': 'https://www.agoda.com/',
        'id': 2,
        'proxy': true
    },
    Booking: {
        'name': 'Booking',
        'url': 'https://www.booking.com/',
        'id': 3,
        'devices': ['mobile'],
        'proxy': true
    },
    Expedia: {
        'name': 'Expedia',
        'url': 'https://www.expedia.co.kr/',
        'id': 1,
        'proxy': true
    },
    Hotels: {
        'name': 'Hotels',
        'url': 'https://kr.hotels.com/',
        'id': 6,
        'proxy': true
    },
    Naver: {
        'name': 'Naver',
        'url': 'https://hotels.naver.com/',
        'id': 5,
        'proxy': true
    },
    Trip: {
        'name': 'Trip',
        'url': 'https://kr.trip.com/',
        'id': 4,
        'devices': ['mobile'],
        'proxy': true
    },
    Tourvis: {
        'name': 'Tourvis',
        'url': 'https://hotel.tourvis.com/',
        'id': 8,
        'devices': ['mobile']
    },
    Kyte: {
        'name': 'Kyte',
        'url': 'https://kyte.travel/',
        'id': 12,
        'devices': ['mobile']
    }
}

export const getConfigBySupplierId = (supplierId) => {
    return Object.values(Suppliers).find(item => item.id === supplierId)
}

const internalSupplier = [
    Suppliers.Tourvis.id,
    Suppliers.Priviatravel.id,
    Suppliers.Kyte.id
]

const Sites = {
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

export {Suppliers, Sites, internalSupplier}
