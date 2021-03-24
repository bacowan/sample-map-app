import Poi from "./types/poi";
import data from "./data";
import PoiTag from "./types/poiTag";

export function normalizeLat(lat: number) {
    return ((lat + 90) % 180) - 90;
}

export function normalizeLon(lon: number) {
    return ((lon + 180) % 360) - 180;
}

export function poiFromJson(json: any) : Poi {
    if (json.hasOwnProperty("lat") &&
        json.hasOwnProperty("lon") &&
        json.hasOwnProperty("title") &&
        json.hasOwnProperty("description") &&
        json.hasOwnProperty("plannedArrivalDate") &&
        json.hasOwnProperty("tags")) {
            const tags = json.tags as Array<PoiTag>;
            return {
                lat: json.lat,
                lon: json.lon,
                title: json.title,
                description: json.description,
                plannedArrivalDate: new Date(json.plannedArrivalDate),
                tags: tags
            };
    }
    else {
        // TODO: Error handling
        throw "missing property in Point of Interest";
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
    try {
        const url = new URLSearchParams(window.location.search);
        const poiParameter = url.get("pois");
        const poiObj = JSON.parse(poiParameter == null ? data : poiParameter);
        if (Array.isArray(poiObj)) {
            return poiObj.map(p => poiFromJson(p));
        }
        else {
            // TODO: Error handling
            return [];
        }
    }
    catch (e) {
        // TODO: Error handling
        throw e;
    }
}