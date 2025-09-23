import '../styles/Nav.css'
import { Link } from 'react-router-dom';

function Nav() {

  return (
    <div style={{ height: '112px', backgroundColor: 'green' }}>
      <p>Go to the <Link to="/">Landing Page</Link>.</p>
    </div>
  )
}

export default Nav