import PoiTag from "./poiTag";

type Poi = {
    lat: number;
    lon: number;
    title: string;
    description: string;
    plannedArrivalDate: Date;
    tags: PoiTag[];
}

export function isPoi(poi: any): poi is Poi {
    return (poi as Poi).lat !== undefined;
}

export default Poi;