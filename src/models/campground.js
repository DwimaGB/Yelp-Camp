const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String,
    },
    price: {
        type: String,
    },
    description: {
        type: String,        
    },
    location: {
        type: String,s
    }
});


module.exports = mongoose.model('Campground', CampgroundSchema);