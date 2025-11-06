
const express = require('express');
const app = express();
//const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const configDB = require('./config/database.js');
const mongoose = require('mongoose')

const port = process.env.PORT || 5050;

// Middleware setup
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

//connecting to mongodb
mongoose.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

//passport configuration
require('./config/passport')(passport);


    // Required for passport
app.use(session({
    secret: 'rcbootcamp2021b',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes (pass db and passport)
require('./app/routes.js')(app, passport);

// Launch server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
//.catch(err => console.error('Database connection failed:', err));
