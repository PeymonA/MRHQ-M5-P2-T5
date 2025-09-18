import { useEffect, useState } from 'react'
import '../styles/StationList.css'

function StationList() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/stations", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      setStations(data);
    };
    fetchData();
  }, [])

  return (
    <div style={{ width: '631px', height: '710px', backgroundColor: 'green' }}>
      <ul>
        {stations.map((station) => (
          <li key={station._id}>
            <p>{station.title}</p>
            <p>{station.address}</p>
            <p>{station.hours}</p>
            <p>{station.services.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default StationList