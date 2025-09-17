import '../styles/MapPage.css'
import { Link } from 'react-router-dom';

function LandingPage() {

  return (
    <>
      <p>Landing Page</p>
      <p>Go to the <Link to="/map">Map Page</Link>.</p>
    </>
  )
}

export default LandingPage
