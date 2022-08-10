const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ehbs = require('express-handlebars')
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const passport = require('passport')
const connectDB = require('./config/database');
const { urlencoded } = require('body-parser');


// Load Configurations
dotenv.config({path: './config/config.env'})

// Passport configuration
require('./config/passport')(passport)
connectDB()

const app = express()

// middleware to parse form data in req.body
app.use(urlencoded({extended: true}))
app.use(express.json())

// method override middleware
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))


// displaying loggin details in dev
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// helpers for handlebars
const {formatDate, stripHTMLTags, truncateText, editIcon, select} = require('./helpers/hbs')

// express handlebars 
app.engine('.hbs', ehbs.engine({helpers: {
    formatDate,
    stripHTMLTags,
    truncateText,
    editIcon,
    select,
}, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// express session 
app.use(session({
    secret: 'veryUniqueSecret',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI,
        // mongooseConnection: mongoose.connection 
    })
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session())

// set user global variable
app.use(function(req, res, next){
    res.locals.user = req.user || null;
    next()
})

// static folders
app.use(express.static(path.join(__dirname, 'public')))

// router
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/rants', require('./routes/rants'))

const PORT = process.env.PORT || 8095

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on the port ${PORT}`))