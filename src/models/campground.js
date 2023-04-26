const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./review');
const geocoder = require('../config/geocoding');

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: {
        type: String,
    },
    images: [ImageSchema],
    price: {
        type: Number,
    },
    description: {
        type: String,        
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
       
        },
        coordinates: {
            type: [Number],
            
        }
    },
    location: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }]
});

CampgroundSchema.pre('save', async function(next){
   
    if(!this.isModified('location')) return next();

    const response = await geocoder.forwardGeocode({
        query: this.location,
        limit: 1,
    }).send();

    this.geometry = response.body.features[0].geometry;
    next();


});

CampgroundSchema.post('findOneAndDelete', async function(campground){
    if(campground){
        await Review.deleteMany({_id: {$in: campground.reviews}});
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);