import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as mapboxgl from 'mapbox-gl';
import Poi from '../types/poi';
import { normalizeLat, normalizeLon } from '../utils';
import Popup from './popup';

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
            
            scopeMap.on('click', 'places', (e) => {
                if (e.features != null && e.features[0].properties != null && e.features[0].properties.hasOwnProperty('title') && e.features[0].properties.hasOwnProperty('description')) {
                    const popup = document.createElement('div');
                    ReactDOM.render(
                        <Popup header={e.features[0].properties.title} body={e.features[0].properties.description}/>,
                        popup
                    );
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setDOMContent(popup)
                        .addTo(scopeMap)
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