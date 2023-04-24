if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./src/config/passportConfig');

const ExpressError = require('./src/utils/ExpressError');
const flashMsg = require('./src/middlewares/flash');
const {currentUser} = require('./src/middlewares/authMiddlewares');

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

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24,
        maxAge: 1000*60*60*24
    }
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(flashMsg);
app.use(currentUser);

app.use((req, res, next)=>{
    // console.log(req.session);
    // console.log(req.user);
    // console.log(req.originalUrl);
    next();
})

app.use('/', require('./src/routes/users'));
app.use('/campgrounds', require('./src/routes/campgrounds'));
app.use('/campgrounds/:id/reviews', require('./src/routes/reviews'));

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