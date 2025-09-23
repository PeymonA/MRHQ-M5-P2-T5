import '../styles/Filter.css'
import { useState } from 'react'
import Select from 'react-select'

function Filter(props) {
  const [selectedServices, setSelectedServices] = useState([]);

  const options = [
    { value: "EV Charging - Fast", label: "EV Charging - Fast" },
    { value: "EV Charging - Ultra-Fast", label: "EV Charging - Ultra-Fast" },
    { value: "EV Charging - Fast &/or Ultra-Fast", label: "EV Charging - Fast &/or Ultra-Fast" },
    { value: "EV Charging - Coming Soon", label: "EV Charging - Coming Soon" },
    { value: "f'real", label: "f'real" },
    { value: "Pre-order Coffee", label: "Pre-order Coffee" },
    { value: "Pay in app", label: "Pay in app" },
    { value: "Z Espress Coffee & Fresh Food", label: "Z Espress Coffee & Fresh Food" },
    { value: "Z2O carwash", label: "Z2O carwash" },
    { value: "Trailer hire", label: "Trailer hire" },
    { value: "LPG SWAP'n'GO", label: "LPG SWAP'n'GO" },
    { value: "24/7 Pay at pump", label: "24/7 Pay at pump" },
    { value: "Super long hoses", label: "Super long hoses" },
    { value: "Bathrooms", label: "Bathrooms" },
    { value: "A-Z Screen", label: "A-Z Screen" },
    { value: "Pay by plate", label: "Pay by plate" },
    { value: "Compostable Cups", label: "Compostable Cups" },
    { value: "AdBlue Diesel Exhaust Fluid", label: "AdBlue Diesel Exhaust Fluid" },
    { value: "Fast fill Diesel lane", label: "Fast fill Diesel lane" },
    { value: "ATM", label: "ATM" }
  ]

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Build formJson manually
    const formJson = {};
    for (const [key, value] of formData.entries()) {
      formJson[key] = value;
    }
    
    // Add the services from react-select state
    if (selectedServices.length > 0) {
      formJson['services'] = selectedServices.map(service => service.value);
    }
    console.log(JSON.stringify(formJson));
    props.setState(formJson);
  }

  return (
    <div className='filter-container'>
      <form method="post" onSubmit={handleSubmit}>
        <div className='dividerServices'>
          <label htmlFor="services-select">Services</label>
          <Select 
            id="services-select" 
            name='services' 
            options={options} 
            isMulti={true}
            value={selectedServices}
            onChange={setSelectedServices}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
        <div className='divider'>
          <label htmlFor="station-type-select">Station Type</label>
          <select id="station-type-select" name="stationType">
            <option value="no station">Select Station Type</option>
            <option value="Truck Stop">Truck Stop</option>
            <option value="Service Station">Service Station</option>
          </select>
        </div>
        <div className='divider'>
          <label htmlFor="fuel-type-select">Fuel Type</label>
          <select id="fuel-type-select" name="fuelType">
            <option value="no fuel">Select Fuel Type</option>
            <option value="Diesel with Techron D">Diesel with Techron D</option>
            <option value="ZX Premium">ZX Premium</option>
            <option value="Z91 Unleaded">Z91 Unleaded</option>
            <option value="Z Diesel">Z Diesel</option>
            <option value="Z DEC">Z DEC</option>
          </select>
        </div>
        <div className='divider'>
          <label htmlFor="sort-by-select">Sort By</label>
          <select id="sort-by-select">
            <option value="no sort">Sort By</option>
          </select>
        </div>
        <div className='divider'>
          <label htmlFor="apply-filters-button" id='apply-filters-button-label'>Apply Filters</label>
          <button type="submit" className='filter-button' id='apply-filters-button'>
            <p>Apply Filters</p>
          </button>
        </div>
      </form>
    </div>
  )
}

export default Filter