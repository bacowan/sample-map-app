import Poi from "./types/poi";
import data from "./data";
import PoiTag from "./types/poiTag";

function modWithNegative(numerator: number, denominator: number) {
    return numerator - denominator * (Math.floor(numerator / denominator));
}

export function normalizeLat(lat: number) {
    return modWithNegative((lat + 90), 180) - 90;
}

export function normalizeLon(lon: number) {
    return modWithNegative((lon + 180), 360) - 180;
}

export function poiFromJson(json: any) : Poi {
    if (typeof json.lat === "number" &&
        typeof json.lon === "number" &&
        typeof json.title === "string" &&
        typeof json.description === "string" &&
        json.hasOwnProperty("plannedArrivalDate") &&
        json.hasOwnProperty("tags")) {
            const tags = json.tags as Array<PoiTag>;
            if (Array.isArray(tags) && tags.every(t => Object.keys(PoiTag).includes(t))) {
                const date = new Date(json.plannedArrivalDate)
                if (date instanceof Date && !isNaN(date.getTime())) {
                    return {
                        lat: json.lat,
                        lon: json.lon,
                        title: json.title,
                        description: json.description,
                        plannedArrivalDate: date,
                        tags: tags
                    };
                }
                else {
                    throw "Invalid date";
                }
            }
            else {
                throw "Invalid Tag values exist";
            }
    }
    else {
        throw "missing valid property in Point of Interest";
    }
}

// One way to get data would be to call a server to retrieve it.
// This app has no data server, but if it did this method is where
// that data would be grabbed. For this mock application, we simply
// return the hardcoded data. For the sake of testing, we allow
// data to be set as the URL parameters. In a production environment,
// we could instead intercept the network calls and replace the responses
// with our test data.
export async function getPois() : Promise<Poi[]> {
    const url = new URLSearchParams(window.location.search);
    const poiParameter = url.get("pois");
    const poiObj = JSON.parse(poiParameter == null ? data : poiParameter);
    if (Array.isArray(poiObj)) {
        return poiObj.map(p => poiFromJson(p));
    }
    throw "Invalid POI data"
}