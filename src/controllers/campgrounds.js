
const handleAsync = require('../utils/handleAsync');
const Campground = require('../models/campground');
const {cloudinary} = require('../config/cloudinary');

module.exports.index = handleAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });

})

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new', { campground: new Campground() });
}

module.exports.showCampground = handleAsync(async (req, res, next) => {

    const campground = await Campground.findById(req.params.id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author').exec();

    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });

})

module.exports.createCampground = handleAsync(async (req, res, next) => {

    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user.id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground.id}`);

})

module.exports.renderEditForm = handleAsync(async (req, res, next) => {

    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });

})

module.exports.updateCampground = handleAsync(async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    campground.images.push(...req.files.map(f => ({url: f.path, filename: f.filename})));
    campground.save();

    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }

    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${id}`);

})

module.exports.deleteCampground = handleAsync(async (req, res, next) => {

    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');

})