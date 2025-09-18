import '../styles/MapComponent.css'

/*
import {APIProvider, Map} from '@vis.gl/react-google-maps';
*/

function MapComponent() {

  /*
  return (
    <APIProvider apiKey={import.meta.env.VITE_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          defaultZoom={13}
          defaultCenter={ { lat: -33.860664, lng: 151.208138 } }>
      </Map>
    </APIProvider>
  )
  */
  return (
    <img src='/google-map.png' alt='map placeholder' style={{ width: '809px', height: '710px' }}/>
  )
}

export default MapComponent;