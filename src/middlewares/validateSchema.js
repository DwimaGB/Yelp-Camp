const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const ExpressError = require('../utils/ExpressError');

const Joi = BaseJoi.extend((joi)=>( {
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label} must not include HTML!}'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHtml(value);
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
}));


module.exports.validateCampground = (req, res, next)=>{
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required().escapeHTML(),
            price: Joi.number().required().min(0),
            // image: Joi.string().required(),
            location: Joi.string().required().escapeHTML(),
            description: Joi.string().required().escapeHTML(),
        }).required(),
        deleteImages: Joi.array(),
    })


    checkError(campgroundSchema, req, next);
}

module.exports.validateReview = (req, res, next)=>{
    const reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            body: Joi.string().required().escapeHTML()
        }).required()
    })
   
    checkError(reviewSchema, req, next);
   
}

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