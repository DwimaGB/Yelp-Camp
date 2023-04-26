const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
module.exports = mbxGeocoding({accessToken: mapBoxToken});

