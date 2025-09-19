import '../styles/MapComponent.css'
import {APIProvider, Map} from '@vis.gl/react-google-maps';

function MapComponent() {

  const pins = async () => {
    const response = await fetch('http://localhost:3000/geocodes');
    const data = await response.json();
    return data;  
  }

  return (
    <div style= {{width: '807px', height: '710px'}} >
      <APIProvider apiKey={import.meta.env.VITE_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          defaultZoom={13}
          defaultCenter={ { lat: -33.860664, lng: 151.208138 } }
          mapId='62bed989cefe108d5df871ad'
        />
      </APIProvider>
    </div>
  );
  
}

export default MapComponent;