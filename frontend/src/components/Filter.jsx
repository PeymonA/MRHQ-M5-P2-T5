import '../styles/Filter.css'

function Filter() {

  return (
    <div className='filter-container'>
      <div className='label-container'>
        <label for="pet-select">Choose a pet:</label>
        <label for="color-select">Choose a color:</label>
        <label for="size-select">Choose a size:</label>
      </div>
      <div className='filter-container-child'>
        <select id="pet-select">
          <option value="someOption">Some option</option>
          <option value="otherOption">Other option</option>
        </select>
        <select id="color-select">
          <option value="someOption">Some option</option>
          <option value="otherOption">Other option</option>
        </select>
        <select id="size-select">
          <option value="someOption">Some option</option>
          <option value="otherOption">Other option</option>
        </select>
        <button>Apply Filters</button>
      </div>
    </div>
  )
}

export default Filter