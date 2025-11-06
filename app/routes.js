// app/routes.js
module.exports = function (app, passport, db) {
  
  // HOME PAGE (with login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // LOGIN ===============================
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // ✅ where to go if login successful
    failureRedirect: '/login',
    failureFlash: true
  }));

  // SIGNUP ==============================
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // ✅ redirect here after successful signup
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // PROFILE SECTION =====================
  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', { user: req.user });
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}


//   // LIKE / DISLIKE / DELETE =============
//   app.put('/messages', (req, res) => {
//     db.collection('messages')
//       .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
//         $inc: { thumbUp: 1 }
//       }, { returnDocument: 'after' })
//       .then(result => res.send(result))
//       .catch(err => res.send(err));
//   });

//   app.put('/messageDown', (req, res) => {
//     db.collection('messages')
//       .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
//         $inc: { thumbUp: -1 }
//       }, { returnDocument: 'after' })
//       .then(result => res.send(result))
//       .catch(err => res.send(err));
//   });

  app.delete('/messages', (req, res) => {
    db.collection('messages')
      .findOneAndDelete({ name: req.body.name, msg: req.body.msg })
      .then(() => res.send('Deleted'))
      .catch(err => res.status(500).send(err));
  });

  // LOGIN & SIGNUP ======================
  app.get('/login', (req, res) => res.render('login.ejs', { message: req.flash('loginMessage') }));
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', (req, res) => res.render('signup.ejs', { message: req.flash('signupMessage') }));
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // NEW FEATURE: CITY DETAILS ============
  app.get('/city/:name', async (req, res) => {
    const city = req.params.name.toLowerCase();
    const cities = {
      paris: {
        img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
        info: 'Known for the Eiffel Tower and romantic vibes, Paris is perfect for culture lovers.'
      },
      tokyo: {
        img: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c',
        info: 'A mix of ancient tradition and cutting-edge technology — Tokyo never sleeps!'
      },
      dubai: {
        img: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a',
        info: 'Luxury, innovation, and desert adventure — Dubai offers unforgettable experiences.'
      }
    };
    const data = cities[city] || {
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      info: 'City not found, but the world is waiting — pick your next destination!'
    };
    res.render('city.ejs', { city, data });
  });

  // UNLINK ACCOUNT ======================
  app.get('/unlink/local', isLoggedIn, (req, res) => {
    const user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(err => res.redirect('/profile'));
  });
};


// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
