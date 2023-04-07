require('dotenv').config();

const mongoose = require('mongoose');
const Campground = require('../src/models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));


const seedDB = async()=>{
    let randomCity;
    try{
        await Campground.deleteMany({});

        for(let i=0; i<50; i++){
            randomCity = cities[randomIntNum(0, 1000)];
            const camp = new Campground({
                location: `${randomCity.city}, ${randomCity.state}`,
                title: `${sample(descriptors)}, ${sample(places)}`
            })

            await camp.save();
        }
        console.log("Seed generated");

    }
    catch(e){
        console.log(e);
    }
}

seedDB().then(()=>mongoose.connection.close());

function sample(arr){
    return arr[randomIntNum(0, arr.length)];
}

function randomIntNum(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}