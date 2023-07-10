const Suppliers = {
    Agoda: {
        'name': 'Agoda',
        'url': 'https://www.agoda.com/',
        'id': 2
    },
    Booking: {
        'name': 'Booking',
        'url': 'https://www.booking.com/',
        'id': 3
    },
    Expedia: {
        'name': 'Expedia',
        'url': 'https://www.expedia.co.kr/',
        'id': 1
    },
    Hotels: {
        'name': 'Hotels',
        'url': 'https://kr.hotels.com/',
        'id': 6
    },
    Naver: {
        'name': 'Naver',
        'url': 'https://hotels.naver.com/',
        'id': 5
    },
    Trip: {
        'name': 'Trip',
        'url': 'https://kr.trip.com/',
        'id': 4
    },
    Priviatravel: {
        'name': 'Priviatravel',
        'url': 'https://hotel.priviatravel.com/',
        'id': 7
    },
    Tourvis: {
        'name': 'Tourvis',
        'url': 'https://hotel.tourvis.com/',
        'id': 8
    },
    // PriviaAfterDiscount: {
    //     'name': 'Priviatravel',
    //     'url': 'https://hotel.priviatravel.com/',
    //     'id': 9
    // },
}
const subSuppliers = {
    PriviaAPI: {
        'name': 'PriviaAPI',
        'id': null
    },
    PriviaHomePage: {
        'name': 'PriviaHomePage',
        'id': 7000
    },
    PriviaAPIAfterLoggedIn: {
        'name': 'PriviaAPIAfterLoggedIn',
        'id': 7100
    },
    PriviaHomePageAfterLoggedIn: {
        'name': 'PriviaHomePageAfterLoggedIn',
        'id': 7200
    },
    TourvisHomePage: {
        'name': 'Tourvis',
        'id': 8000
    },
}

const loggedInStates = {
    notLoggedIn: 0,
    loggedIn: 1,
}

export { Suppliers, subSuppliers, loggedInStates }