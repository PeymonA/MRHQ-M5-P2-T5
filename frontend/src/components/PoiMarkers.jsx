import {
  AdvancedMarker,
  Pin,
  useMap
} from '@vis.gl/react-google-maps';

import {MarkerClusterer} from '@googlemaps/markerclusterer';

import React, {useEffect, useRef, useState} from 'react';

const PoiMarkers = (props) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  console.log('POI Markers props:', props.pois);
  console.log('1 poi:', props.pois[0]);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  if (!props.pois || props.pois.length === 0) {
    return null; // Return nothing if no POIs
  }

  return (
    <>
      {props.pois.map( (poi) => (
        <AdvancedMarker
          key={poi.key}
          position={{ lat: poi.location.lat, lng: poi.location.lng }}
          ref={marker => setMarkerRef(marker, poi.key)}
          >
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  );
}

export default PoiMarkers;