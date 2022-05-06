const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const expressLayout = require('express-ejs-layouts')
const connectDb = require('./config/db')

const app = express()

// Load config
dotenv.config({ path: './config/config.env' })

// passport config
require('./config/passport')(passport);

connectDb();

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


app.set('views', path.join(__dirname, 'views'));
app.use('/css', express.static(__dirname + 'public/css'))

// view engine
app.use(expressLayout)
app.set('layout', './layout/layout.ejs')
app.set('view engine', 'ejs')

//Session
app.use(session({
    secret: "no secret!!:)",
    resave: false,
    saveUninitialized: false
}))

// passport middleware

app.use(passport.initialize())
app.use(passport.session())

//static file
app.use(express.static(path.join(__dirname, 'public')))



const port = process.env.PORT || 5000

//routes

app.use("/", require('./routes/index'));
app.use('/auth', require('./routes/auth'))

app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}!`)) 