export function makeid(length: number = 8): string {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function formatLatLngText(lat: number, lng: number, acc = 10000): string[]{
    const latdir = lat >= 0 ? 'N' : 'S';
    const lngdir = lng >= 0 ? 'E' : 'W';
    const latval = Math.round(Math.abs(lat) * acc + Number.EPSILON) / acc
    const lngval = Math.round(Math.abs(lng) * acc + Number.EPSILON) / acc
    return [`${latval}·${latdir}`,`${lngval}·${lngdir}`];
    // return `${latval}·${latdir} / ${lngval}·${lngdir}`
}