import '../styles/MapPage.css'

import { useState } from 'react'

import Nav from '../components/Nav.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Filter from '../components/Filter.jsx'
import StationList from '../components/StationList.jsx'
import Footer from '../components/Footer.jsx'
import MapComponent from '../components/MapComponent.jsx'


function MapPage() {
  const [state, setState] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <SearchBar />
      <Filter state={state} setState={setState} />
      <div className="list-map-container">
        <StationList state={state} setState={setState} />
        <MapComponent />
      </div>
      <Footer />
    </div>
  )
}

export default MapPage
