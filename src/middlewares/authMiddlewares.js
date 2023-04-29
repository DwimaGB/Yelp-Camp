
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.currentUser = (req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
}

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login')
    }
    next();
}

module.exports.isAuthor = async(req, res, next)=>{
    const {id} = req.params;
    try{
        const campground = await Campground.findById(id);

        if(!campground.author.equals(req.user.id)){
            req.flash('error', 'You are not authorized to do that!');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
    }
    catch(e){
        next(e);
    }
}
module.exports.isReviewAuthor = async(req, res, next)=>{
    const {id, reviewId} = req.params;
    try{
        const review = await Review.findById(reviewId);

        if(!review.author.equals(req.user.id)){
            req.flash('error', 'You are not authorized to do that!');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
    }
    catch(e){
        next(e);
    }
}
