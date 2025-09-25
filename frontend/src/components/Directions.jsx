import {
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

import React, { useEffect, useState } from 'react';

function Directions() {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        if (!map || !routesLibrary) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [map, routesLibrary]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;

        directionsService.route(
            {
                origin: { lat: -36.8485, lng: 174.7633 }, // Auckland
                destination: { lat: -41.2865, lng: 174.7762 }, // Wellington
                travelMode: 'DRIVING',
            }).then((response) => {
                directionsRenderer.setDirections(response);
                setRoutes(response.routes);
            }).catch((e) => window.alert('Directions request failed due to ' + e));

    }, [directionsService, directionsRenderer]);

    console.log('Routes:', routes);

    return (
        null
    );
}

export default Directions;