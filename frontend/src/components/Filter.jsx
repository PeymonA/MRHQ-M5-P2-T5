import '../styles/Filter.css'

function Filter(props) {

  const handleSubmit = (e) => {
    // Fix so that multiple selections are captured
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Build formJson manually to handle multi-select
    const formJson = {};
    for (const [key, value] of formData.entries()) {
      if (formJson[key]) {
        // If already exists, convert to array or push
        if (Array.isArray(formJson[key])) {
          formJson[key].push(value);
        } else {
          formJson[key] = [formJson[key], value];
        }
      } else {
        formJson[key] = value;
      }
    }
    // For multi-select, ensure array for 'services'
    if (formData.getAll('services').length > 1) {
      formJson['services'] = formData.getAll('services');
    }
    props.setState(formJson);
  }

  return (
    <div className='filter-container'>
      <div className='filter-items'>
        <div className='label-container'>
          <div className='services-label'>
            <label htmlFor="services-select">Services</label>
          </div>
          <div className='other-labels'>
            <label htmlFor="station-type-select">Station Type</label>
            <label htmlFor="fuel-type-select">Fuel Type</label>
            <label htmlFor="sort-by-select">Sort By</label>
          </div>
        </div>
        <div className='filter-container-child'>
          <form method="post" onSubmit={handleSubmit}>
            <select id="services-select" name='services' multiple={true}>
              <option value="EV Charging - Fast">EV Charging - Fast</option>
              <option value="EV Charging - Ultra-Fast">EV Charging - Ultra-Fast</option>
              <option value="EV Charging - Fast &/or Ultra-Fast">EV Charging - Fast &/or Ultra-Fast</option>
              <option value="EV Charging - Coming Soon">EV Charging - Coming Soon</option>
              <option value="f'real">f'real</option>
              <option value="Pre-order Coffee">Pre-order Coffee</option>
              <option value="Pay in app">Pay in app</option>
              <option value="Z Espress Coffee & Fresh Food">Z Espress Coffee & Fresh Food</option>
              <option value="Z2O carwash">Z2O carwash</option>
              <option value="Trailer hire">Trailer hire</option>
              <option value="LPG SWAP'n'GO">LPG SWAP'n'GO</option>
              <option value="24/7 Pay at pump">24/7 Pay at pump</option>
              <option value="Super long hoses">Super long hoses</option>
              <option value="Bathrooms">Bathrooms</option>
              <option value="A-Z Screen">A-Z Screen</option>
              <option value="Pay by plate">Pay by plate</option>
              <option value="Compostable Cups">Compostable Cups</option>
              <option value="AdBlue Diesel Exhaust Fluid">AdBlue Diesel Exhaust Fluid</option>
              <option value="Fast fill Diesel lane">Fast fill Diesel lane</option>
              <option value="ATM">ATM</option>
            </select>
            <div className='select-single-container'>
              <select id="station-type-select" name="stationType">
                <option value="no station">Select Station Type</option>
                <option value="Truck Stop">Truck Stop</option>
                <option value="Service Station">Service Station</option>
              </select>
            </div>
            <div className='select-single-container'>
              <select id="fuel-type-select" name="fuelType">
                <option value="no fuel">Select Fuel Type</option>
                <option value="Diesel with Techron D">Diesel with Techron D</option>
                <option value="ZX Premium">ZX Premium</option>
                <option value="Z91 Unleaded">Z91 Unleaded</option>
                <option value="Z Diesel">Z Diesel</option>
                <option value="Z DEC">Z DEC</option>
              </select>
            </div>
            <div className='select-single-container'>
              <select id="sort-by-select">
                <option value="no sort">Sort By</option>
              </select>
            </div>
            <button type="submit" className='filter-button'>Apply Filters</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Filter