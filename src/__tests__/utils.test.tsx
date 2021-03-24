import Poi from "../types/poi";
import { normalizeLat, normalizeLon, poiFromJson } from "../utils";

// Normalize lat
test('Normalize positive inbounds lat stays the same', () => {
    expect(normalizeLat(50)).toBe(50)
});

test('Normalize negative inbounds lat stays the same', () => {
    expect(normalizeLat(-50)).toBe(-50)
});

test('Normalize positive out of bounds lat wraps around', () => {
    expect(normalizeLat(100)).toBe(-80)
});

test('Normalize negative out of bounds lat wraps around', () => {
    expect(normalizeLat(-100)).toBe(80)
});

test('Normalize on bounds lat stays the same', () => {
    expect([-90, 90]).toContain(normalizeLat(90))
    expect([-90, 90]).toContain(normalizeLat(-90))
});

// Normalize lon
test('Normalize positive inbounds lon stays the same', () => {
    expect(normalizeLon(120)).toBe(120)
});

test('Normalize negative inbounds lon stays the same', () => {
    expect(normalizeLon(-120)).toBe(-120)
});

test('Normalize positive out of bounds lon wraps around', () => {
    expect(normalizeLon(200)).toBe(-160)
});

test('Normalize negative out of bounds lon wraps around', () => {
    expect(normalizeLon(-200)).toBe(160)
});

test('Normalize on bounds lon stays the same', () => {
    expect([-180, 180]).toContain(normalizeLon(180))
    expect([-180, 180]).toContain(normalizeLon(-180))
});

// POI from JSON
test('POI from JSON: valid item works', () => {
    const json = {
        lat: 50,
        lon: 50,
        title: "title",
        description: "description",
        plannedArrivalDate: "jan 1, 2020",
        tags: ["Lodging"]
    }
    const poi = poiFromJson(json);
    expect(poi.lat).toBe(50);
    expect(poi.lon).toBe(50);
    expect(poi.title).toBe("title");
    expect(poi.description).toBe("description");
    expect(poi.plannedArrivalDate.toUTCString()).toBe(new Date("jan 1, 2020").toUTCString());
    expect(poi.tags.length).toBe(1);
    expect(poi.tags[0]).toBe("Lodging");
});

test('POI from JSON: missing values gives exception', () => {
    const json = {
        lat: 50,
        lon: 50
    }
    expect(() => {
        poiFromJson(json);
    }).toThrowError();
});

test('POI from JSON: wrong type gives exception', () => {
    const json = {
        lat: 50,
        lon: 50,
        title: 50,
        description: "description",
        plannedArrivalDate: "jan 1, 2020",
        tags: ["Lodging"]
    }
    expect(() => {
        poiFromJson(json);
    }).toThrowError();
});

test('POI from JSON: invalid tag gives exception', () => {
    const json = {
        lat: 50,
        lon: 50,
        title: "title",
        description: "description",
        plannedArrivalDate: "jan 1, 2020",
        tags: ["not a tag"]
    }
    expect(() => {
        poiFromJson(json);
    }).toThrowError();
});

test('POI from JSON: invalid date gives exception', () => {
    const json = {
        lat: 50,
        lon: 50,
        title: "title",
        description: "description",
        plannedArrivalDate: "not a date",
        tags: ["Lodging"]
    }
    expect(() => {
        poiFromJson(json);
    }).toThrowError();
});