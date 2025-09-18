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
      console.log(data);
    };
    fetchData();
  }, [])

  return (
    <ul>
      {stations.map((station) => (
        <li key={station._id}>
          <p>{station.Name}</p>
          <p>{station.Address}</p>
          <p>{station.OpeningHours}</p>
          <p>{station.Services.join(", ")}</p>
        </li>
      ))}
    </ul>
  )
}

export default StationList