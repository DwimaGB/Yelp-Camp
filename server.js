require('dotenv').config();

const express = require('express')
const path = require('path');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', ()=>console.log("Database connected"))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.listen(process.env.PORT || 3000);