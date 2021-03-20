import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import Poi from '../types/poi';
import MapboxMap from '../types/mapbox_map';
import { normalizeLat, normalizeLon } from '../utils';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function Map({pois}: MapProps) {
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [zoom, setZoom] = useState(9);
    const [map, setMap] = useState<MapboxMap | null>(null);

    useEffect(() => {
        const scopeMap = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [lng, lat],
            zoom: zoom
        });
        setMap(scopeMap);
        return () => scopeMap.remove();
    }, []);

    useEffect(() => {
        const scopeMap = map;
        if (pois.length > 0 && scopeMap != null) {
            scopeMap.fitBounds(pois.map(p => [normalizeLon(p.lon), normalizeLat(p.lat)]));
        }
    }, [pois, map]);
    
    return (<div>
        <div className="map-container" ref={mapContainer} />
    </div>);
}

type MapProps = {
    pois: Poi[]
}

export default Map;