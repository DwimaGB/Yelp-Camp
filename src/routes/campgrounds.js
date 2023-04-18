
const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const handleAsync = require('../utils/handleAsync');
const {validateCampground} = require('../middlewares/validateSchema');
const isAuthenticated = require('../middlewares/isAuthenticate');


router.get('/', handleAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });

}));

router.get('/new', isAuthenticated, (req, res) => {
    res.render('campgrounds/new', { campground: new Campground() });
})


router.get('/:id', handleAsync(async (req, res, next) => {

    const campground = await Campground.findById(req.params.id).populate('reviews').exec();
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });

}))


router.get('/:id/edit', isAuthenticated, handleAsync(async (req, res, next) => {

    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });

}))

router.post('/', isAuthenticated, validateCampground, handleAsync(async (req, res, next) => {

    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground.id}`);

}))

router.put('/:id', isAuthenticated, validateCampground, handleAsync(async (req, res, next) => {

    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground.id}`)

}))

router.delete('/:id', isAuthenticated, handleAsync(async (req, res, next) => {

    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');

}))

/* Reviews */ 



module.exports = router;