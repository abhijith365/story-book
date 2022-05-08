const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const connectDb = require('./config/db')

const app = express()

// body parser
app.use(express.urlencoded({ 'extended': false }))
app.use(express.json())

// Load config
dotenv.config({ path: './config/config.env' })

// passport config
require('./config/passport')(passport);

connectDb();

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// static file 
app.set('views', path.join(__dirname, 'views'));
app.use('/css', express.static(__dirname + 'public/css'))

// view engine
app.use(expressLayout)
app.set('layout', './layout/layout.ejs')
app.set('view engine', 'ejs')

// cache handleing 
app.use((req, res, next) => {
    if (!req.user) {
        res.header('cache-control', 'private,no-cache,no-store,must revalidate')
        res.header('Express', '-1')
        res.header('paragrm', 'no-cache')
    }
    next()
})

//Session
app.use(session({
    secret: "no secret!!:)",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

// passport middleware

app.use(passport.initialize())
app.use(passport.session())

//static file
app.use(express.static(path.join(__dirname, 'public')))


// method overriding 
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))



const port = process.env.PORT || 5000

//routes
app.use("/", require('./routes/index'));
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}!`)) 