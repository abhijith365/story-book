const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const { ensureAuth } = require('../middleware/auth')
const { stripTags, truncate, editIocn, select } = require('../helper/ejs')


//@desc show add page
//@route GET /stories/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})
//@desc  edit stories
//@route GET /stories/edit/:id

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findOne({ _id: req.params.id }).lean()


        if (!story) {
            res.render('error/404');
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', { story, select })
        }
    } catch (err) {
        console.error(err)
    }

})
//@desc  re-save stories
//@route GET /stories/edit/

router.post('/edit', ensureAuth, async (req, res) => {
    try {
        let story = await Story.updateOne({ _id: req.params.id })
        res.redirect('stories')
    } catch (err) {
        console.error(err)
    }

})

//@desc post data 
//@route POST /stories/
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.image = req.user.image
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

//@desc show post 
//@route GET /stories/
router.get('/', ensureAuth, async (req, res) => {
    try {
        let stories = await Story.find({
            status: 'public'
        }).populate('user').sort({ createAt: 'desc' }).lean()
        let user = req.user
        res.render('stories/index', { stories, stripTags, truncate, editIocn, user })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})



module.exports = router;