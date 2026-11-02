/* eslint-disable  */

export const displayMap = (locations) => {
  const map = new mapboxgl.Map({
    accessToken: 'pk.eyJ1IjoiaDNsYWxsIiwiYSI6ImNtdnkxZWRsMjE1bjUyeXF4YW43eTNzN2IifQ.FDawprOtEhq1Ry15lzgplw',
    container: 'map', // container ID
    style: 'mapbox://styles/h3lall/cmvy1xlns004u01s86v2xhgag',
    scrollZoom: false
    // center: [-118.113491, 34.1117745], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    // zoom: 10, // starting zoom
    // interactive: false
  });
  
  
  const bounds = new mapboxgl.LngLatBounds();
  
  
  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    
    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);
    
    // Add popup
    new mapboxgl.Popup({
      offset: 30
    }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
    
    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
}
  