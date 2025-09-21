import '../styles/MapPage.css'
import { Link } from 'react-router-dom';

function FindStation() {

  return (
    <div style={{ height: '245px', backgroundColor: 'yellow' }}>
      <p>Go to the <Link to="/map">Map Page</Link>.</p>
    </div>
  )
}

export default FindStation
