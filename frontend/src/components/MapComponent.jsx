import '../styles/MapComponent.css'

import {APIProvider, Map} from '@vis.gl/react-google-maps';

function MapComponent() {

  return (
    <div style= {{width: '807px', height: '710px'}} >
      <APIProvider apiKey={import.meta.env.VITE_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
        defaultZoom={3}
        defaultCenter={{lat: 22.54992, lng: 0}}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        />
      </APIProvider>
    </div>
  );
  
}

export default MapComponent;