export function normalizeLat(lat: number) {
    return ((lat + 90) % 180) - 90;
}

export function normalizeLon(lon: number) {
    return ((lon + 180) % 360) - 180;
}