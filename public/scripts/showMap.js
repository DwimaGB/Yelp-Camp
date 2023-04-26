
mapboxgl.accessToken = mapboxToken;
const campground = JSON.parse(campgroundJson);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates.length === 0? [-74.5, 40]: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates.length === 0? [-74.5, 40]: campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(`<h3>${campground.title}</h3> <p>${campground.location}</p>`)
    )
    .addTo(map)