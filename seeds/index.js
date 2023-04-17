require('dotenv').config();

const axios = require('axios');
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

        const images = await generateRandomImages();


        for(let i=0; i<images.data.length; i++){
            randomCity = cities[randomIntNum(0, 1000)];
            const camp = new Campground({
                location: `${randomCity.city}, ${randomCity.state}`,
                title: `${sample(descriptors)}, ${sample(places)}`,
                image: images.data[i].urls.small,
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem ducimus dolores minus tempora.",
                price: randomIntNum(50, 100),
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





function generateRandomImages(){
    return axios.get(`https://api.unsplash.com/photos/random?count=30&collections=0PS93s3CcF4&client_id=${process.env.UNSPLASH_ACCESS_KEY}`);
}

function sample(arr){
    return arr[randomIntNum(0, arr.length)];
}

function randomIntNum(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}