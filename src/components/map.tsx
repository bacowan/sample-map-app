import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import Poi, { isPoi } from '../types/poi';
import { normalizeLat, normalizeLon, poiFromJson } from '../utils';
import Popup from './popup';
import PoiTag from '../types/poiTag';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

function Map({pois, selectedPoi, setSelectedPoi, poiFilter}: MapProps) {
    const defaultMapZoom = 9;
    const defaultPadding = 50;

    const filteredPois = pois.filter(p => poiFilter === undefined || p.tags.includes(poiFilter))

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

    function updatePois(scopeMap: mapboxgl.Map) {
        const features = filteredPois
            .map((p, i) => { return {
                type: 'Feature' as 'Feature',
                properties: { index: i },
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

    // Initialize the rest of the map once it's finished loading
    useEffect(() => {
        const scopeMap = map;
        if (isMapLoaded && scopeMap != null) {
            scopeMap.on('click', 'places', (e) => {
                if (e.features != null && e.features[0].properties != null && e.features[0].properties.index != null && e.features[0].properties.index < pois.length) {
                    try {
                        const poi = pois[e.features[0].properties.index]
                        setSelectedPoi(poi);
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

    // update with new POIs
    useEffect(() => {
        const scopeMap = map;
        if (isMapLoaded && scopeMap != null) {
            if (pois.length > 0) {
                const allLngLats = pois.map(p => new mapboxgl.LngLat(normalizeLon(p.lon), normalizeLat(p.lat)));
                const lngLats = allLngLats
                    .reduce(
                        (bounds, coord) => bounds.extend(coord),
                        new mapboxgl.LngLatBounds(allLngLats[0], allLngLats[0]));
                scopeMap.fitBounds(lngLats, {
                    padding: { top: defaultPadding, bottom: defaultPadding, left: defaultPadding, right: defaultPadding }
                });
            }
            updatePois(scopeMap);
        }
    }, [map, isMapLoaded, pois]);

    // Filter POIs
    useEffect(() => {
        const scopeMap = map;
        if (isMapLoaded && scopeMap != null) {
            updatePois(scopeMap);
        }
    }, [map, isMapLoaded, poiFilter]);

    // Move to a given POI
    useEffect(() => {
        const scopeMap = map;
        if (selectedPoi != null && scopeMap != null && filteredPois.includes(selectedPoi)) {
            const lonLat = [selectedPoi.lon, selectedPoi.lat] as mapboxgl.LngLatLike;
            scopeMap.flyTo({
                center: lonLat,
                zoom: defaultMapZoom
            });
            showPopup(selectedPoi);
        }
    }, [selectedPoi, map]);
    
    if (mapContainer == null) {
        return <div/>
    }
    else {
        return (<div className="map-container" ref={mapContainer} />);
    }
}

type MapProps = {
    pois: Poi[],
    poiFilter: PoiTag | undefined,
    selectedPoi: Poi | null,
    setSelectedPoi: (index: Poi | null) => void
}

export default Map;