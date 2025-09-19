const pins = async () => {
        const response = await fetch('http://localhost:3000/geocodes');
        const data = await response.json();
        return data;  
    }

const locations = await pins();

console.log(locations);