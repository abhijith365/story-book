const express = require('express');
const router = express.Router();

//@desc Login/landing page
//@route GET/

router.get('/', (req, res) => {
    res.render('../views/login.hbs', {
        layout: '../views/layout/login.hbs'
    })
})

//@desc  Dashboard
//@route GET /dashboard

router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        layout: 'main'
    })
})

module.exports = router;