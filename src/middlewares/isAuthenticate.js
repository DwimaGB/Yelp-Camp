module.exports = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; // after login return the user to the exact url
        req.flash('error', 'You must be signed in first');
        res.redirect('/login')
    }
    next();
}