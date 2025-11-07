
module.exports = function(app, passport, db) {

  // the home page
  app.get('/', (req, res) => res.render('index.ejs', {message: req.flash('loginMessage')}));

  // login page
  app.get('/login', (req, res) => res.render('login.ejs', { message: req.flash('loginMessage') }));
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // signup page
  app.get('/signup', (req, res) => res.render('signup.ejs', { message: req.flash('signupMessage') }));
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));


  // profile page
  app.get('/profile', isLoggedIn, async (req, res) => {
    try {
      const cities = await db.collection('city').find({}).toArray();
      res.render('profile.ejs', { user: req.user, messages: cities });
    } catch(err) {
      console.error(err);
      res.render('profile.ejs', { user: req.user, messages: [] });
    }
  });


  // add city here
  app.post('/travelApp', async (req, res) => {
    try {
      await db.collection('city').insertOne({ name: req.body.name, msg: req.body.msg });
      res.redirect('/profile');
    } catch(err) {
      res.status(500).send(err);
    }
  });


  // delete city
  app.delete('/messages', async (req, res) => {
    try {
      await db.collection('city').findOneAndDelete({ name: req.body.name, msg: req.body.msg });
      res.send('Deleted');
    } catch(err) {
      res.status(500).send(err);
    }
  });


  // city images and info
  app.get('/city/:name', async (req, res) => {
    const city = req.params.name.toLowerCase();
    const citiesData = {
      paris: { img: 'https://cdn.britannica.com/31/255531-050-B7E07090/eiffel-tower-paris-france-champ-de-mars-view.jpg', info: 'Paris is known for the Eiffel Tower and romantic vibes, Paris is perfect for culture lovers.' },
      tokyo: { img: 'https://www.universalweather.com/blog/wp-content/uploads/2019/07/tokyo-ops-7-19.jpg', info: 'A mix of ancient tradition and cutting-edge technology — Tokyo never sleeps!' },
      dubai: { img: 'https://deih43ym53wif.cloudfront.net/dubai-palm-jumeirah-island-shutterstock_1291548640.jpg_3ab124c2b9.jpg', info: 'Luxury, innovation, and desert adventure — Dubai offers unforgettable experiences.' },
      london: { img: 'https://www.jonesaroundtheworld.com/wp-content/uploads/2019/10/Fun-Facts-About-London.jpg', info: 'known for its rich history, royal heritage, and iconic landmarks like Buckingham Palace and the Tower of London' },
      beijing: { img: 'https://www.travelandleisure.com/thmb/b2-ee45Q1DEjuzOa51XLhJ7Rfmc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/great-wall-china-tourists-GWOC0417-10bddbf0783644c386178f62117b2132.jpg', info: 'Beijing is known as China capital and a center for politics, culture, and history, with famous landmarks like the Forbidden City and the Great Wall.' },
      miami: { img: 'https://www.henrosahotel.com/wp-content/uploads/2022/12/history-sobe.jpg', info: 'Miami is known for its beautiful beaches, vibrant nightlife, and diverse culture, including a strong Cuban influence.' },
      sydney: { img: 'https://media.istockphoto.com/id/512882300/photo/sydney-opera-house.jpg?s=612x612&w=0&k=20&c=W-CpLxrNiqZsuMzKnntkiWw3ODFaXjMfLRzU5cKY9zk=', info: 'Sydney is known for its iconic landmarks, especially the Sydney Opera House and Sydney Harbour Bridge, and its famous beaches, such as Bondi Beach' },
      cairo: { img: 'https://krakow.wiki/wp-content/uploads/2021/09/Pyramids-Giza-Cairo.jpg', info: 'Cairo is known for its ancient wonders, including the Pyramids of Giza and the Sphinx, and its rich Islamic history' },
      kigali: { img: 'https://www.volcanoesnationalpark.org/wp-content/uploads/2023/02/rwanda-gorilla-trekking.jpg', info: 'Kigali is known as the "Land of a Thousand Hills" for its mountainous landscape, its high population of mountain gorillas in Volcanoes National Park' },
      bangok: { img: 'Bangkok is known for its stunning temples, vibrant street life, and bustling markets', info: 'https://www.worldatlas.com/upload/7b/c1/48/shutterstock-2461072741.jpg' },
      lisbon: { img: 'https://www.planetware.com/photos-large/P/st-georges-castle.jpg', info: 'Lisbon is known for its historic trams, hilltop views, and soulful Fado music, alongside a vibrant mix of old-world charm and modern creativity' },
      boston: { img: 'https://assets.princess.com/is/image/princesscruises/boston-massachusetts-charles-river-esplanade-aerial-city-view:16x9?ts=1747238693188', info: 'Boston is known for its pivotal role in the American Revolution, its prestigious universities like Harvard and MIT.' },
      chicago: { img: 'https://cdn.apartmentlist.com/image/fetch/f_auto,q_auto,t_renter_life_article/https://images.ctfassets.net/jeox55pd4d8n/6G174TfVr9RgodgRiI1zlX/0daf3e7f6c672fe72c2b4b93a382f8cd/What_is_Chicago_Known_For_-_2.png', info: 'Chicago is known for its iconic architecture, diverse food scene (especially deep-dish pizza), vibrant music genres like blues and house' }
    };
    const data = citiesData[city] || { img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', info: 'City not found, but the world is waiting — pick your next destination!' };
    res.render('city.ejs', { city, data });
  });


  // logout
  app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });


  // unlink account
  app.get('/unlink/local', isLoggedIn, (req, res) => {
    const user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(err => res.redirect('/profile'));
  });


  // MIDDLEWARE
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
  }


};
