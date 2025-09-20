import fs from "fs";

const API_KEY = 'oopsies';

const stations = JSON.parse(fs.readFileSync("stations.json", "utf-8"));

const pins = [];

async function run() {
    for (let i = 0; i < stations.length; i++) {
        const input = stations[i];
        const title = input.title;

        if (!input.address) continue;
        
        const formattedAddress = input.address.replace(/ /g, '+');

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${API_KEY}`;

        const fetchData = async () => {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            
            // Check if we have results
            if (data.status === 'OK' && data.results && data.results.length > 0) {
                // Access geometry.location from the first result
                const location = data.results[0].geometry.location;
                pins.push({ key: title, location: { lat: location.lat, lng: location.lng } });

                return location; // Return the location for further use
            } else {
                console.error('No results found or API error:', data.status);
                return null;
            }
        }
        await fetchData();
    }
}

const runScript = async () => {
    await run();
    fs.writeFileSync("pins.json", JSON.stringify(pins, null, 2));
};

runScript();
