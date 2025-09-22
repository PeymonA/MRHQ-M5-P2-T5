import { useEffect, useState } from 'react'
import '../styles/StationList.css'
import MapComponent from './MapComponent.jsx'

function StationList(props) {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dateTime = new Date();
  
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
                  {station.hours.hours['Monday'] === 'Open 24 hours' ? (
                    <p id='open-24'>Open 24 hours</p>
                  ) : (
                    (() => {
                      // Helper function to check if current time is within the opening hours
                      function isWithinTimeRange(date, range) {
                        // Example range: "5am - 10pm"
                        const [startStr, endStr] = range.split("-").map(s => s.trim().toLowerCase());

                        // Helper to parse "5am"/"10pm" into minutes since midnight
                        function parseTime(str) {
                          const match = str.match(/(\d+)(?::(\d+))?\s*(am|pm)?/);
                          if (!match) throw new Error("Invalid time string: " + str);

                          let hours = parseInt(match[1], 10);
                          const minutes = parseInt(match[2] || "0", 10);
                          const meridian = match[3];

                          if (meridian === "pm" && hours !== 12) hours += 12;
                          if (meridian === "am" && hours === 12) hours = 0;

                          return hours * 60 + minutes; // total minutes from midnight
                        }

                        const startMinutes = parseTime(startStr);
                        const endMinutes = parseTime(endStr);

                        // Current time in minutes
                        const currentMinutes = date.getHours() * 60 + date.getMinutes();

                        // Handles ranges that don’t cross midnight (e.g., 5am - 10pm)
                        if (startMinutes <= endMinutes) {
                          return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
                        }

                        // Handles ranges that cross midnight (e.g., 10pm - 5am)
                        return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
                      }

                      // Get today's opening hours string
                      const todayIndex = dateTime.getDay() - 1 < 0 ? 6 : dateTime.getDay() - 1; // Sunday=0, so wrap to 6
                      const todayEntry = Object.entries(station.hours.hours)[todayIndex];
                      const todayHours = todayEntry ? todayEntry[1] : "";

                      const testHours = "5am - 2pm"; // Example hours for testing

                      let isOpen = false;
                      if (typeof todayHours === "string" && todayHours.toLowerCase() !== "closed") {
                        try {
                          isOpen = isWithinTimeRange(dateTime, todayHours);
                        } catch (e) {
                          isOpen = false;
                        }
                      }

                      return (
                        <div>
                          <p id={isOpen ? "open" : "closed"}>{isOpen ? "Open now" : "Closed"}</p>
                          <h3 id='opening-hours'>Opening hours:</h3>
                          <ul>
                            {Object.entries(station.hours.hours).map(([day, time], index) => (
                              <div className='times' key={index}>
                                <li key={day} className='day'>{day} </li>
                                <li key={time} className='time'>{time}</li>
                              </div>
                            ))}
                          </ul>
                        </div>
                      );
                    })()
                  )}
                  {station.phone === "N/A" ? (<p></p>) : (
                    <div className='phone-div'>
                      <img src='phone.svg' alt='phone icon' className='phone-icon'/>
                      <p id='phone'>Call us {station.phone}</p>
                    </div>
                  )}
                  <h3>Fuel Types:</h3>
                  <div className="fuel-types">
                    {station.fuelTypes.map((fuelType, index) => (
                      <div key={index} className="fuel-item">
                        <span className="fuel-name">{fuelType.fuel}</span>
                        <span className="fuel-price">{fuelType.price}</span>
                      </div>
                    ))}
                  </div>
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