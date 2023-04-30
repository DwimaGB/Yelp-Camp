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
const passport = require('./src/config/passport');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo'); 

const ExpressError = require('./src/utils/ExpressError');
const flashMsg = require('./src/middlewares/flash');
const {currentUser} = require('./src/middlewares/authMiddlewares');

const app = express();

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
  ];
  const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
  ];
  const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
  ];
  const fontSrcUrls = ["https://res.cloudinary.com/dkyoa3ps4/"];
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://res.cloudinary.com/dkyoa3ps4/",
          "https://images.unsplash.com",
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
      },
    })
  );

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.use(mongoSanitize());



const sessionConfig = {
    name: 'session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24,
        maxAge: 1000*60*60*24
    },
    store: MongoStore.create({mongoUrl: process.env.DATABASE_URL, collectionName: 'sessions'})
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(flashMsg);
app.use(currentUser);


app.use('/', require('./src/routes/index'));
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