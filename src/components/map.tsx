import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as mapboxgl from 'mapbox-gl';
import Poi from '../types/poi';
import { normalizeLat, normalizeLon } from '../utils';

function Map({pois}: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [zoom, setZoom] = useState(9);
    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (mapContainer.current != null) {
            const scopeMap = new mapboxgl.Map({
                accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: [lng, lat],
                zoom: zoom
            });
            scopeMap.on('load', () => setIsMapLoaded(true));
            setMap(scopeMap);
            return () => scopeMap.remove();
        }
    }, [mapContainer]);

    useEffect(() => {
        const scopeMap = map;
        if (isMapLoaded && scopeMap != null) {
            if (pois.length > 0) {
                const lngLats = pois.map(p => new mapboxgl.LngLat(normalizeLon(p.lon), normalizeLat(p.lat))) as mapboxgl.LngLatBoundsLike;
                scopeMap.fitBounds(lngLats);
            }

            const features = pois.map(p => { return {
                type: 'Feature' as 'Feature',
                properties: {
                    description: `<strong>${p.title}</strong><p>${p.description}</p>`,
                    icon: 'circle'
                },
                geometry: {
                    type: 'Point' as 'Point',
                    coordinates: [
                        p.lon,
                        p.lat
                    ]
                }
            }});

            scopeMap.addSource('places', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': features
                } }
            );
            
            scopeMap.addLayer({
                id: 'places',
                type: 'symbol',
                source: 'places',
                layout: {
                    'icon-image': '{icon}-15',
                    'icon-allow-overlap': true
                }
            });
        }
    }, [pois, map, isMapLoaded]);
    
    if (mapContainer == null) {
        return <div/>
    }
    else {
        return (<div>
            <div className="map-container" ref={mapContainer} />
        </div>);
    }
}

type MapProps = {
    pois: Poi[]
}

export default Map;