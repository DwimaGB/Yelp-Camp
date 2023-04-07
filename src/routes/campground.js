
const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');

router.get('/', async(req, res)=>{
    try{
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', {campgrounds});
    }
    catch(e){
        console.log(e);
    }
})

router.get('/new', (req, res)=>{
    res.render('campgrounds/new', {campground: new Campground()});
})


router.get('/:id', async(req, res)=>{
    try{    
        const campground = await Campground.findById(req.params.id);

        res.render('campgrounds/show', {campground});
    }
    catch(e){
        console.log(e);
    }
})



router.get('/:id/edit', async(req, res)=>{
    try{
        const campground = await Campground.findById(req.params.id);

        res.render('campgrounds/edit', {campground});
    }
    catch(e){

    }
})

router.post('/', async(req, res)=>{
    try{
        const campground = new Campground(req.body.campground);
        await campground.save();

        res.redirect(`/campgrounds/${campground.id}`);
    }
    catch(e){
        console.log(e)
    }
})

router.put('/:id', async(req, res)=>{
    try{
        const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});

        res.redirect(`/campgrounds/${campground.id}`)
    }
    catch(e){
        console.log(e);
    }
})

router.delete('/:id', async(req, res)=>{
    try{
        await Campground.findByIdAndDelete(req.params.id);
        res.redirect('/campgrounds');
    }
    catch(e){
        console.log(e);
    }
})

module.exports = router;