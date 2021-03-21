import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as mapboxgl from 'mapbox-gl';
import Poi from '../types/poi';
import { normalizeLat, normalizeLon } from '../utils';
import Popup from './popup';

function Map({pois, selectedPoiIndex}: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [popup, setPopup] = useState<mapboxgl.Popup | null>(null);

    function showPopup(header: string, description: string, lngLat: mapboxgl.LngLatLike) {
        const scopeMap = map;
        if (scopeMap != null) {
            // the previous popup sometimes hangs around; this forces it to close.
            if (popup != null) {
                popup.remove();
            }
            const popupDiv = document.createElement('div');
            ReactDOM.render(
                <Popup header={header} body={description}/>,
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
                zoom: 9
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
                if (e.features != null && e.features[0].properties != null && e.features[0].properties.hasOwnProperty('title') && e.features[0].properties.hasOwnProperty('description')) {
                    showPopup(e.features[0].properties.title, e.features[0].properties.description, e.lngLat);
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
                properties: {
                    title: p.title,
                    description: p.description,
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

            if (scopeMap.getSource('places')) {
                scopeMap.removeSource('places');
            }
    
            scopeMap.addSource('places', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': features
                } }
            );
            
            if (scopeMap.getLayer('places')) {
                scopeMap.removeLayer('places');
            }

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
    }, [map, isMapLoaded, pois]);

    // Move to a given POI
    useEffect(() => {
        const scopeMap = map;
        if (selectedPoiIndex != null && scopeMap != null) {
            if (selectedPoiIndex < pois.length) {
                const poi = pois[selectedPoiIndex];
                const lonLat = [poi.lon, poi.lat] as mapboxgl.LngLatLike;
                scopeMap.flyTo({
                    center: lonLat,
                    zoom: 9 // TODO: Make this a constant
                });
                showPopup(poi.title, poi.description, lonLat);
            }
            else {
                //todo: error handling
            }
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