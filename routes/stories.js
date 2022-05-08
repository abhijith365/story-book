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
//@desc  update stories
//@route PUT /stories/edit/

router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            res.render('error/404');
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            }),
                res.redirect('/dashboard')
        }


    } catch (err) {
        console.error(err)
    }

})
//@desc delete post 
//@route DELETE /:id

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            res.render('error/404');
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndDelete({ _id: req.params.id }),
                res.redirect('/dashboard')
        }


    } catch (err) {
        console.error(err)
    }
})

//@desc show sigle story
//@route GET /:id

router.get('/:id', ensureAuth, async (req, res) => {

    try {
        let story = await Story.findById(req.params.id)
        if (story) {
            res.render('stories/view_story', { story, editIocn })
        } else {
            res.render('error/404')
        }
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})





module.exports = router;