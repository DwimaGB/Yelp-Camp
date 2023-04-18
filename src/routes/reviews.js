
const express = require('express')
const router = express.Router({mergeParams: true});
const Review = require('../models/review');
const Campground = require('../models/campground');

const handleAsync = require('../utils/handleAsync');
const {validateReview} = require('../middlewares/validateSchema');
const {isLoggedIn, isReviewAuthor} = require('../middlewares/authMiddlewares');

router.post('/', isLoggedIn, validateReview, handleAsync(async(req, res, next)=>{
    const campground = await Campground.findById(req.params.id);
  
    const review = new Review(req.body.review);
    review.author = req.user.id;
    await review.save();

    campground.reviews.push(review);
    await campground.save();
    
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${campground.id}`);
   
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, handleAsync(async(req, res, next)=>{
    const {id, reviewId} = req.params;
    await Campground.updateOne({_id: id}, {$pull: {"reviews": reviewId}});

    await Review.findByIdAndDelete(reviewId, {new: true});

    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);

}))

module.exports = router;