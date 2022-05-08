const express = require('express');
const router = express.Router();
var moment = require('moment');
const Story = require('../models/Story');
const { ensureAuth, ensureGuest } = require('../middleware/auth')
//@desc Login/landing page
//@route GET/

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: './layout/login'
    })
})

//@desc  Dashboard
//@route GET /dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            stories,
            layout: './layout/layout',
            username: req.user.firstName,
            moment,

        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }

})

module.exports = router;


