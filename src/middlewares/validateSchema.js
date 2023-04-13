const Joi = require('joi');
const ExpressError = require('../utils/ExpressError');

const validateCampground = (req, res, next)=>{
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required(),
        }).required()
    })

    checkError(campgroundSchema, req, next);
}

const validateReview = (req, res, next)=>{
    const reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            body: Joi.string().required()
        }).required()
    })
   
    checkError(reviewSchema, req, next);
   
}
module.exports = {validateCampground, validateReview};


/*  */

function checkError(schema, req, next){
    const {error} = schema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}