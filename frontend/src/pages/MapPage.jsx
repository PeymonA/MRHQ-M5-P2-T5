import '../styles/MapPage.css'
import Nav from '../components/Nav.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Filter from '../components/Filter.jsx'
import StationList from '../components/StationList.jsx'
import Map from '../components/Map.jsx'
import Footer from '../components/Footer.jsx'


function MapPage() {

  return (
    <>
      <Nav />
      <SearchBar />
      <Filter />
      <div>
        <StationList />
        <Map />
      </div>
      <Footer />
    </>
  )
}

export default MapPage
