
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require('../config/cloudinary');
const upload = multer({storage});

const { validateCampground } = require('../middlewares/validateSchema');
const { isLoggedIn, isAuthor } = require('../middlewares/authMiddlewares');
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, upload.array('image'), validateCampground, campgrounds.createCampground)

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);


router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'),validateCampground, campgrounds.updateCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground)





module.exports = router;