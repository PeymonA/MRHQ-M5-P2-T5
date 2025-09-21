import { useEffect, useState } from 'react'
import '../styles/StationList.css'
import MapComponent from './MapComponent.jsx'

function StationList(props) {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (JSON.stringify(props.state) === JSON.stringify({stationType: 'no station', fuelType: 'no fuel'})) {
            const response = await fetch("http://localhost:3000/stations", {
            method: 'GET',
            headers: {
              "Content-Type": "application/json"
            }
          });
          const data = await response.json();
          setStations(data);
          props.setStations(data);
          console.log('Fetched all stations from StationList:', data);
        }
        else { 
          const formJson = props.state;
          const response = await fetch("http://localhost:3000/stations/filter", {
            method: 'POST',
            body: JSON.stringify(formJson),
            headers: {
              "Content-Type": "application/json"
            }
          });
          const data = await response.json();
          setStations(data);
          props.setStations(data);
          console.log('Fetched filtered stations from StationList:', data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [props.state]);

  return (
    <div className="list-map-container">
      <div className='spacer'></div>
      <div className="station-container">
        {isLoading ? (
          <p>Loading stations...</p>
        ) : (
          <div className='station-list'>
            <p className="station-count">{stations.length} Stations found</p>
            <ul>
              {stations.map((station) => (
                <li key={station._id} className="station-card">
                  <h2>{station.title}</h2>
                  <p>{station.address}</p>
                  {typeof station.hours === 'string' ? (
                    <p>{station.hours}</p>
                  ) : (
                    <div>
                      <h3>Opening Hours:</h3>
                      <ul>
                        {Object.entries(station.hours.hours).map(([day, time]) => (
                          <div className='times'>
                            <li key={day} className='day'>{day} </li>
                            <li key={time} className='time'>{time}</li>
                          </div>
                        ))}
                      </ul>
                    </div>
                  )}
                  <h3>Services:</h3>
                  <p>{station.services.join(", ")}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {!isLoading && <MapComponent stations={stations} setStations={setStations} />}
    </div>
  )
}

export default StationList