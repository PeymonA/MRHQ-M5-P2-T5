import '../styles/MapPage.css'
import Nav from '../components/Nav.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Filter from '../components/Filter.jsx'
import StationList from '../components/StationList.jsx'
import Footer from '../components/Footer.jsx'
import MapComponent from '../components/MapComponent.jsx'


function MapPage() {

  return (
    <>
      <Nav />
      <SearchBar />
      <Filter />
      <div className="list-map-container">
        <StationList />
        <MapComponent />
      </div>
      <Footer />
    </>
  )
}

export default MapPage
