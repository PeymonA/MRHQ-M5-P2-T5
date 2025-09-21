import puppeteer from "puppeteer";
import fs from "fs";

const scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = "https://www.z.co.nz/find-a-station";

    await page.goto(url);
    
    const stations = await page.evaluate(() => {
        const stationElements = document.querySelectorAll(".locator-result");
        return Array.from(stationElements).map(station => {
            const title = station.querySelector("h2 a");
            const address = station.querySelector("p");
            const hours = station.querySelector("div button");
            const services = station.querySelectorAll("ul li");
            return {
                title: title ? title.textContent.trim() : null,
                address: address ? address.textContent.trim() : null,
                hours: hours ? hours.textContent.trim() : null,
                services: services ? Array.from(services).map(s => s.textContent.trim()) : []
            };
        });
    });

    fs.writeFileSync("stations.json", JSON.stringify(stations, null, 2));

    console.log('data scraped');

    await browser.close();
}

scrape();