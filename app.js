const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const ehbs = require('express-handlebars')
const session = require('express-session');
const passport = require('passport')
const connectDB = require('./config/database')


// Load Configurations
dotenv.config({path: './config/config.env'})

// Passport configuration
require('./config/passport')(passport)
connectDB()

const app = express()

// displaying loggin details in dev
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// express handlebars 
app.engine('.hbs', ehbs.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// express session 
app.use(session({
    secret: 'veryUniqueSecret',
    resave: false,
    saveUninitialized: false
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session())

// static folders
app.use(express.static(path.join(__dirname, 'public')))

// router
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 8095

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on the port ${PORT}`))