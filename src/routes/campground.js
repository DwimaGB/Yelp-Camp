
const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const handleAsync = require('../utils/handleAsync');
const validateCampground = require('../middlewares/validateCampground');

router.get('/', handleAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });

}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new', { campground: new Campground() });
})


router.get('/:id', handleAsync(async (req, res, next) => {

    const campground = await Campground.findById(req.params.id);

    res.render('campgrounds/show', { campground });

}))



router.get('/:id/edit', handleAsync(async (req, res, next) => {

    const campground = await Campground.findById(req.params.id);

    res.render('campgrounds/edit', { campground });

}))

router.post('/', validateCampground, handleAsync(async (req, res, next) => {

    const campground = new Campground(req.body.campground);
    await campground.save();

    res.redirect(`/campgrounds/${campground.id}`);

}))

router.put('/:id', validateCampground, handleAsync(async (req, res, next) => {

    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });

    res.redirect(`/campgrounds/${campground.id}`)

}))

router.delete('/:id', handleAsync(async (req, res, next) => {

    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');

}))

module.exports = router;