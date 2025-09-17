import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';

function App() {
    return (
    <Router>
        <div>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<MapPage />} />
        </Routes>
        </div>
    </Router>
    );
}

export default App;