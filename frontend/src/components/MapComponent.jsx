import '../styles/MapComponent.css'
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import PoiMarkers from './PoiMarkers';
import { useEffect, useState } from 'react';

function MapComponent() {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/geocodes');
      const data = await response.json();
      setPins(data);
    };
    fetchData();
  }, []);
  
  
  return (
    <div style= {{width: '60%', height: '710px'}} >
      <APIProvider apiKey={import.meta.env.VITE_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          defaultZoom={5}
          defaultCenter={ { lat: -40.9006, lng: 174.8860 } }
          mapId='62bed989cefe108d5df871ad'
        >
          <PoiMarkers pois={pins} />
        </Map>
      </APIProvider>
    </div>
  );
  
}

export default MapComponent;