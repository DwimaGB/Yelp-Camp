require('dotenv').config();

const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

const ExpressError = require('./src/utils/ExpressError');

const app = express();

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', ()=>console.log("Database connected"))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(expressLayouts);

app.use('/campgrounds', require('./src/routes/campground'));

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message){
        err.message = "Something Went Wrong!!";
    }
    res.status(statusCode).render('error', {err});
})


app.listen(process.env.PORT || 3000);