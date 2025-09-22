import puppeteer from "puppeteer";
import fs, { stat } from "fs";

const scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = "https://www.z.co.nz/find-a-station";

    await page.goto(url);

    const stationLinks = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href*="/find-a-station/station/"]');
        return Array.from(links).map(link => ({
            name: link.textContent.trim(),
            link: link.href, // This will be the full URL
            relativePath: link.getAttribute('href') // This will be "/find-a-station/station/z-aerodrome-road-truck-stop"
        }));
    });

    console.log(`Found ${stationLinks.length} station links. Now scraping each station page...`);

    // NEW: Scrape data from each individual station page
    const detailedStations = [];

    for (let i = 0; i < stationLinks.length; i++) {
        const station = stationLinks[i];
        
        console.log(`Processing ${i + 1}/${stationLinks.length}: ${station.name}`);

        try {
            // Navigate to the individual station page
            await page.goto(station.link, { waitUntil: 'networkidle2' });

            // Scrape detailed data from this station's page
            const stationData = await page.evaluate((s) => {
                const data = {
                    name: s.name,
                };

                const stationInfo = document.querySelector('.station-details__location-info');

                if (stationInfo) {
                    // Try to extract address
                    const addressElement = stationInfo.querySelector('.station-details__location-address.h5');
                    if (!addressElement) {
                        data.address = "N/A";
                    } else {
                        data.address = addressElement.textContent.trim();
                    }

                    // Try to extract hours
                    const openingHours = stationInfo.querySelector('.station-details__location-opening-hours');
                    if (openingHours) {
                        const table = openingHours.querySelector('tbody');

                        if (table) {
                            const rows = table.querySelectorAll("tr");
                            returnHours = Array.from(rows).map(row => {
                                const cells = row.querySelectorAll("td");
                                if (cells.length >= 2) {
                                    return { 
                                        day: cells[0].textContent.trim(),
                                        time: cells[1].textContent.trim()
                                    };
                                }
                            });
                            data.hours = returnHours;
                        }
                    }
                    else {
                        data.hours = "N/A";
                    }

                    // Try to extract phone
                    const phoneElement = stationInfo.querySelector('.station-details__location-phone');
                    if (phoneElement) {
                        data.phone = phoneElement.querySelector('a').textContent.trim();
                        if (data.phone === "") { data.phone = "N/A"; }
                    }
                    else {
                        data.phone = "N/A";
                    }

                    // Try to extract services
                    const serviceDiv = document.querySelector('.list-section.list-section--large');
                    if (serviceDiv) {
                        const serviceElements = serviceDiv.querySelectorAll('ul li');
                        if (serviceElements.length > 0) {
                            data.services = Array.from(serviceElements).map(s => s.textContent.trim());
                        } 
                        else {
                            data.services = "N/A";
                        }
                    }
                    else {
                        data.services = "N/A";
                    }

                    const fuelTypeDiv = document.querySelector('.list-section.list-section--min-col-3');
                    if (fuelTypeDiv) {
                        const fuelElements = fuelTypeDiv.querySelectorAll('ul li');
                        if (fuelElements.length > 0) {
                            data.fuelTypes = Array.from(fuelElements).map(f => f.textContent.trim());
                        }
                    }
                    else {
                        data.fuelTypes = "N/A";
                    }

                }

                return data;
            }, station);

            detailedStations.push(stationData);
            console.log(`✓ Scraped: ${station.name}`);

        } catch (error) {
            console.error(`✗ Error scraping ${station.name}:`, error.message);
        }
    }

    fs.writeFileSync("detailedStations.json", JSON.stringify(detailedStations, null, 2));

    console.log(`Scraping complete! Processed ${detailedStations.length} stations.`);
    console.log('Station links saved to: stationLinks.json');
    console.log('Detailed station data saved to: detailedStations.json');

    await browser.close();
}

scrape();