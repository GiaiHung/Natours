/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations)

mapboxgl.accessToken =
  'pk.eyJ1IjoiZ2lhaWh1bmciLCJhIjoiY2xjcHZ0ZHZpMmFtaDN2bXR4djRnY3U0OCJ9.i2DCVtl7hAuiJdrfxDSBUQ'
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/giaihung/clcpxl9pm000914o4fzgourso',
  scrollZoom: false,
  doubleClickZoom: false,
  //   center: [-117, 35],
  //   zoom: 7,
  //   interactive: false
})

const bounds = new mapboxgl.LngLatBounds()

locations.forEach((loc) => {
  // Add marker
  const el = document.createElement('div')
  el.className = 'marker'

  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map)

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map)

  bounds.extend(loc.coordinates)
})

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100,
  },
})
