const cookies = {

}

export const getCookie = (siteId) => {
    return cookies[siteId];
}

export const setCookie = (siteId, cookie) => {
    return cookies[siteId] = cookie;
}