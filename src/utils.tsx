import Poi from "./types/poi";

export function normalizeLat(lat: number) {
    return ((lat + 90) % 180) - 90;
}

export function normalizeLon(lon: number) {
    return ((lon + 180) % 360) - 180;
}

function poiFromJson(json: any) : Poi {
    if (json.hasOwnProperty("lat") &&
        json.hasOwnProperty("lon") &&
        json.hasOwnProperty("title") &&
        json.hasOwnProperty("description")) {
            return {
                lat: json.lat,
                lon: json.lon,
                title: json.title,
                description: json.description
            };
    }
    else {
        // TODO: Error handling
        throw "missing property in Point of Interest";
    }
}

export async function getPois() : Promise<Poi[]> {
    if (process.env.REACT_APP_DATA_URL != null) {
        const response = await fetch(process.env.REACT_APP_DATA_URL);
        const test = process.env.REACT_APP_DATA_URL;
        if (response.status == 200) {
            // TODO: Error handle bad json
            const asJson = await response.json();
            if (Array.isArray(asJson)) {
                // TODO: Error handling
                return asJson.map(j => poiFromJson(j));
            }
            else {
                // TODO: Error handling
                return [];
            }
        }
        else {
            // TODO: Error handling
                return [];
        }
    }
    else {
        // TODO: Error handling
            return [];
    }
}