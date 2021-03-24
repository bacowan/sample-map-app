import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as mapboxgl from 'mapbox-gl';
import Poi, { isPoi } from '../types/poi';
import { normalizeLat, normalizeLon, poiFromJson } from '../utils';
import Popup from './popup';
import PoiTag from '../types/poiTag';

function Map({pois, selectedPoiIndex}: MapProps) {
    const defaultMapZoom = 9;

    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [popup, setPopup] = useState<mapboxgl.Popup | null>(null);

    function showPopup(poi: Poi) {
        const scopeMap = map;
        if (scopeMap != null) {
            // the previous popup sometimes hangs around; this forces it to close.
            if (popup != null) {
                popup.remove();
            }
            const lngLat = [poi.lon, poi.lat] as mapboxgl.LngLatLike
            const popupDiv = document.createElement('div');
            ReactDOM.render(
                <Popup poi={poi}/>,
                popupDiv
            );
            setPopup(new mapboxgl.Popup()
                .setLngLat(lngLat)
                .setDOMContent(popupDiv)
                .addTo(scopeMap));
        }
    }

    // Initialize the map. When it finishes loading, the next effect will finish initialization
    useEffect(() => {
        if (mapContainer.current != null) {
            const scopeMap = new mapboxgl.Map({
                accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: [0, 0],
                zoom: defaultMapZoom
            });
            scopeMap.on('load', () => setIsMapLoaded(true));
            setMap(scopeMap);
            return () => scopeMap.remove();
        }
    }, [mapContainer]);

    useEffect(() => {
        const scopeMap = map;
        if (isMapLoaded && scopeMap != null) {
            scopeMap.on('click', 'places', (e) => {
                if (e.features != null && e.features[0].properties != null && e.features[0].properties.poi != null) {
                    try {
                        const json = JSON.parse(e.features[0].properties.poi);
                        const poi = poiFromJson(json);
                        showPopup(poi);
                    }
                    catch (e) {
                        // Error handling
                    }
                }
            });

            scopeMap.on('mouseenter', 'places', function () {
                scopeMap.getCanvas().style.cursor = 'pointer';
            });
                
            // Change it back to a pointer when it leaves.
            scopeMap.on('mouseleave', 'places', function () {
                scopeMap.getCanvas().style.cursor = '';
            });
        }
    }, [map, isMapLoaded]);

    // update POIs
    useEffect(() => {
        const scopeMap = map;
        if (isMapLoaded && scopeMap != null) {
            if (pois.length > 0) {
                const lngLats = pois.map(p => new mapboxgl.LngLat(normalizeLon(p.lon), normalizeLat(p.lat))) as mapboxgl.LngLatBoundsLike;
                scopeMap.fitBounds(lngLats);
            }
    
            const features = pois.map(p => { return {
                type: 'Feature' as 'Feature',
                properties: { poi: JSON.stringify(p) },
                geometry: {
                    type: 'Point' as 'Point',
                    coordinates: [
                        p.lon,
                        p.lat
                    ]
                }
            }});

            const data : GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
                'type': 'FeatureCollection',
                'features': features
            };
            const source = scopeMap.getSource('places') as mapboxgl.GeoJSONSource;
            if (source) {
                source.setData(data);
            }
            else {
                scopeMap.addSource('places', {
                    'type': 'geojson',
                    'data': data }
                );
            }
    
            if (scopeMap.getLayer('places')) {
                scopeMap.removeLayer('places');
            }

            scopeMap.addLayer({
                id: 'places',
                type: 'symbol',
                source: 'places',
                layout: {
                    'icon-image': 'circle-15',
                    'icon-allow-overlap': true
                }
            });
        }
    }, [map, isMapLoaded, pois]);

    // Move to a given POI
    useEffect(() => {
        const scopeMap = map;
        if (selectedPoiIndex != null && scopeMap != null && selectedPoiIndex < pois.length) {
            const poi = pois[selectedPoiIndex];
            const lonLat = [poi.lon, poi.lat] as mapboxgl.LngLatLike;
            scopeMap.flyTo({
                center: lonLat,
                zoom: defaultMapZoom
            });
            showPopup(poi);
        }
    }, [selectedPoiIndex, map]);
    
    if (mapContainer == null) {
        return <div/>
    }
    else {
        return (<div className="map-container" ref={mapContainer} />);
    }
}

type MapProps = {
    pois: Poi[],
    selectedPoiIndex: number | null
}

export default Map;