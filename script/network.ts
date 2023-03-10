const requestMap = {};

export const fetchJSONAndCache = async (url) => {
    if (!requestMap[url]) {
        requestMap[url] = await fetch(url).then(v => v.json());
    }
    return requestMap[url];
}