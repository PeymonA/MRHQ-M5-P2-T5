import puppeteer from "puppeteer";
import fs from "fs";

const scrape = async () => {
    const browser = await puppeteer.launch({ headless: false }); // Show browser for debugging
    const page = await browser.newPage();

    const url = "https://www.z.co.nz/find-a-station";

    await page.goto(url);
    
    // Wait for the page to load completely
    await page.waitForSelector(".locator-result");
    
    console.log("Looking for hours buttons...");
    
    // Find and click all buttons that might reveal hours
    const hoursButtons = await page.$$(".locator-hours button");
    console.log(`Found ${hoursButtons.length} hours buttons`);

    for (let i = 0; i < hoursButtons.length; i++) {
        try {
            console.log(`Clicking button ${i + 1}...`);
            // Scroll button into view first
            await hoursButtons[i].scrollIntoView();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Try clicking with JavaScript 
            await page.evaluate(button => button.click(), hoursButtons[i]);
            
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for content to load
            console.log(`Successfully clicked button ${i + 1}`);
        } catch (e) {
            console.log(`Failed to click button ${i + 1}:`, e.message);
        }
    }
    
    console.log("Taking screenshot...");
    await page.screenshot({ path: 'debug-page.png', fullPage: true });
    
    const stations = await page.evaluate(() => {
        const stationElements = document.querySelectorAll(".locator-result");
        return Array.from(stationElements).map((station, index) => {
            const title = station.querySelector("h2 a");
            const address = station.querySelector("p");

            const hoursDiv = station.querySelector(".locator-hours");
            let hours;
            if (hoursDiv) {
                // Look for table (should be visible now after button clicks)
                const table = hoursDiv.querySelector("table");
                
                if (table) {
                    const rows = table.querySelectorAll("tr");
                    
                    // Try different selectors for table cells
                    const allCells = table.querySelectorAll("td");
                    
                    hours = Array.from(rows).map(row => {
                        const cells = row.querySelectorAll("td");
                        if (cells.length >= 2) {
                            return { 
                                day: cells[0].textContent.trim(),
                                time: cells[1].textContent.trim()
                            };
                        }
                        // Fallback to original selectors
                        const dayCell = row.querySelector(".locator-hours__table-cell--day") || row.querySelector("td:first-child");
                        const timeCell = row.querySelector(".locator-hours__table-cell--hours") || row.querySelector("td:last-child");
                        return { 
                            day: dayCell ? dayCell.textContent.trim() : "N/A",
                            time: timeCell ? timeCell.textContent.trim() : "N/A"
                        };
                    }).filter(entry => {
                        // Filter out invalid entries (headers, empty rows, or N/A entries)
                        // Keep entries that have actual day names and times
                        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                        const dayLower = entry.day.toLowerCase();
                        const hasValidDay = validDays.some(day => dayLower.includes(day));
                        const hasValidTime = entry.time && 
                                           entry.time !== "N/A" && 
                                           entry.time.trim() !== "" &&
                                           (entry.time.includes(':') || entry.time.includes('am') || entry.time.includes('pm') || entry.time.includes('24'));
                        
                        return hasValidDay && hasValidTime;
                    });
                }
                else {
                    // If no table, get the button text or any text content
                    const button = hoursDiv.querySelector("button");
                    const textContent = hoursDiv.textContent.trim();
                    hours = button ? button.textContent.trim() : textContent;
                }
            } else {
                hours = "No hours div found";
            }
            
            const services = station.querySelectorAll("ul li");

            let phone;
            
            return {
                title: title ? title.textContent.trim() : null,
                address: address ? address.textContent.trim() : null,
                hours: hours,
                services: services ? Array.from(services).map(s => s.textContent.trim()) : []
            };
        });
    });

    fs.writeFileSync("stations.json", JSON.stringify(stations, null, 2));

    console.log('data scraped');

    await browser.close();
}

scrape();