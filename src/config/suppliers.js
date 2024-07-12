const SUPPLIERS = {
    Privia: {
        'name': 'Privia',
        'link': 'https://hotel.priviatravel.com/',
        'id': 7,
        'userName': 'hoangcongst94',
        'password': '5eD*6ZQeMS!v5jW'
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
        'id': 10001
    },
    detail: {
        'name': 'detail',
        'id': 10002
    },
    discountDetailLoggedIn: {
        id: 10101,
        name: 'detailDiscountLoggedIn',
        domain: '',
    },
    detailLoggedIn: {
        id: 10102,
        name: 'detailLoggedIn',
        domain: '',
    },
}

const SCRIPT_PRIVIA_TOURVIS = `
    var new_id = 'hn_worker';
    var mo = null;
    function cb(a) {
        mo = a;
        console.log(document.cookie.split(';').forEach(function(c) {
            if (c.trim().startsWith('_pk_id.' + mo.getSiteId())) {
                document.cookie = c.split('=')[0] + '=' + new_id + c.match(/=\\S+([.]\\d+[.])/)[1] + '; path=/; domain=' + mo.getCookieDomain();
            }
        }));
    }
    _paq.push([function() { cb(this); }]);
`

export {SUPPLIERS, SITES, INTERNAL_SUPPLIER_IDS, SCRIPT_PRIVIA_TOURVIS}
