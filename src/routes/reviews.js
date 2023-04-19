
const express = require('express')
const router = express.Router({mergeParams: true});

const {validateReview} = require('../middlewares/validateSchema');
const {isLoggedIn, isReviewAuthor} = require('../middlewares/authMiddlewares');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, reviews.createReview);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview);

module.exports = router;