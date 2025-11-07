
const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');


module.exports = function(passport) {


    // serialize user
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });


    // deserialize user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });


    // our local signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        User.findOne({ 'local.email': email }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, false, req.flash('signupMessage', 'That email is already taken.'));


            const newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);


            newUser.save(err => {
                if (err) throw err;
                return done(null, newUser);
            });
        });
    }));


    // our local login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        User.findOne({ 'local.email': email }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
            if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            return done(null, user);
        });
    }));
};
