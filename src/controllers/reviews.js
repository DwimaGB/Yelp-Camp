const Review = require('../models/review');
const Campground = require('../models/campground');

const handleAsync = require('../utils/handleAsync');

module.exports.createReview = handleAsync(async(req, res, next)=>{
    const campground = await Campground.findById(req.params.id);
  
    const review = new Review(req.body.review);
    review.author = req.user.id;
    await review.save();

    campground.reviews.push(review);
    await campground.save();
    
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${campground.id}`);
   
})

module.exports.deleteReview = handleAsync(async(req, res, next)=>{
    const {id, reviewId} = req.params;
    await Campground.updateOne({_id: id}, {$pull: {"reviews": reviewId}});

    await Review.findByIdAndDelete(reviewId, {new: true});

    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);

})