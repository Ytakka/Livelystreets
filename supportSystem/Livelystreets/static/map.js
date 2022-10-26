const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  ///mapbox://styles/ytakka/cl763q0dt000c15ntvebhlto5   
  center: [30.28, 59.947615],
  maxZoom: 13,
  minZoom: 9,
  zoom: 12,
  scrollZoom: true
});
// Holds visible street features for filtering
let streets = [];
// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({ closeButton: false });
const filterEl = document.getElementById('feature-filter');
const listingEl = document.getElementById('feature-listing');

function renderListings(features) {
  const empty = document.createElement('p');
  // Clear any existing listings
  listingEl.innerHTML = '';
  if (features.length) {
    for (const feature of features) {
      const itemLink = document.createElement('a');
      const label = `${feature.properties.name_trans}`;
      itemLink.target = '_blank';
      itemLink.textContent = label;
      itemLink.addEventListener('mouseover', () => {
        // Highlight corresponding feature on the map
        popup
          .setLngLat(feature.geometry.coordinates)
          .setText(label)
          .addTo(map);
      });
      listingEl.appendChild(itemLink);
    }

    // Show the filter input
    filterEl.parentNode.style.display = 'block';
  } else if (features.length === 0 && filterEl.value !== '') {
    empty.textContent = 'No results found';
    listingEl.appendChild(empty);
  } else {
    empty.textContent = 'Wait for appearing data and drag the map to populate results';
    listingEl.appendChild(empty);

    // Hide the filter input
    filterEl.parentNode.style.display = 'none';

    // remove features filter
     map.setFilter('street', ['has', 'name_trans']);
  }
}

function normalize(string) {
  return string.trim().toLowerCase();
}

// Because features come from tiled vector data,
// feature geometries may be split
// or duplicated across tile boundaries.
// As a result, features may appear
// multiple times in query results.
function getUniqueFeatures(features, comparatorProperty) {
    const uniqueIds = new Set();
    const uniqueFeatures = [];
    for (const feature of features) {
        const id = feature.properties[comparatorProperty];
        if (!uniqueIds.has(id)) {
            uniqueIds.add(id);
            uniqueFeatures.push(feature);
          }
    }
    return uniqueFeatures;
}


    
map.on('load', () => {
  map.addLayer({
    id: 'street',
    type: 'circle',
    source: {
      type: 'geojson',
      data: `/api/facilities/`
    },
    paint: {
      'circle-radius': 3,
      'circle-opacity': 0.2,
      'circle-color': 'rgb(12, 0, 173)'
    },
  });
    
  map.on('movestart', () => {
    // reset features filter as the map starts moving
    map.setFilter('street', ['has', 'name_trans']);
  });

  map.on('moveend', () => {
    const features = map.queryRenderedFeatures({ layers: ['street'] });

    if (features) {
      const uniqueFeatures = getUniqueFeatures(features, 'name_trans', 'dailyCount');
      // Populate features for the listing overlay.
      renderListings(uniqueFeatures);

      // Clear the input container
      filterEl.value = '';

      // Store the current features in sn `streets` variable to
      // later use for filtering on `keyup`.
      streets = uniqueFeatures;
    }
  });

  map.on('mousemove', 'street', (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    // Populate the popup and set its coordinates based on the feature.
    const feature = e.features[0];
    popup
      .setLngLat(feature.geometry.coordinates)
      .setText(
        `${feature.properties.name_trans}`
      )
      .addTo(map);
  });

  map.on('mouseleave', 'street', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });

  filterEl.addEventListener('keyup', (e) => {
    const value = normalize(e.target.value);

    // Filter visible features that match the input value.
    const filtered = [];
    for (const feature of streets) {
      const name = normalize(feature.properties.name_trans);
      if (name.includes(value)) {
        filtered.push(feature);
      }
    }

    // Populate the sidebar with filtered results
    renderListings(filtered);

    // Set the filter to populate features into the layer.
    if (filtered.length) {
      map.setFilter('street', [
        'match',
        ['get', 'name_trans'],
        filtered.map((feature) => {
          return feature.properties.name_trans;
        }),
        true,
        false
      ]);
    }
  });

  // Call this function on initialization
  // passing an empty array to render an empty state
  renderListings([]);
});