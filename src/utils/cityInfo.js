const cityIdMapForAgoda = {
    'hanoi': 2758,
    'seoul': 14690
}

const cityIdMapForTrip = {
    'hanoi': 268,
    'seoul': 274,
}

const cityNameMapForNaver = {
    'hanoi': 'Hanoi',
    'phuquoc': 'Phu_Quoc',
    'seoul': 'Seoul'
}

function getAgodaCityId(cityName){
    const name = cityName.trim().replaceAll(' ','').toLowerCase()
    return cityIdMapForAgoda[name]
}

function getTripCityId(cityName){
    const name = cityName.trim().replaceAll(' ','').toLowerCase()
    return cityIdMapForTrip[name]
}

function getNaverCityName(cityName){
    const name = cityName.trim().replaceAll(/\s+/g,'').toLowerCase()
    return cityNameMapForNaver[name]
}

export { getTripCityId, getNaverCityName, getAgodaCityId }