const User = require('../models/user');

module.exports.renderSignUpForm=(req, res) => {
    res.render('user/singup');
};

module.exports.signUp=async (req, res) => {
    try {
    let { username, email, password } = req.body;
    const user = new User({ username, email }); 
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Wanderlust!');
        res.redirect('/listings');
    });
   }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginForm= (req, res) => {
    res.render('user/login');
};

module.exports.login= async (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.logout= (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success","you have logged out successfully!");
        res.redirect('/listings');
      });
}