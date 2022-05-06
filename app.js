const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
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

// handlebar
app.set('view engine', "hbs")

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

//r0uters list 
const routerIndex = require('./routes/index')


const port = process.env.PORT || 5000

//routes

app.use("/", routerIndex);
app.use('/auth', require('./routes/auth'))

app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}!`)) 