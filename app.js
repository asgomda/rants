const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ehbs = require('express-handlebars')
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

// displaying loggin details in dev
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// helpers for handlebars
const {formatDate} = require('./helpers/hbs')

// express handlebars 
app.engine('.hbs', ehbs.engine({helpers: {
    formatDate,
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

// static folders
app.use(express.static(path.join(__dirname, 'public')))

// router
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/rants', require('./routes/rants'))

const PORT = process.env.PORT || 8095

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on the port ${PORT}`))