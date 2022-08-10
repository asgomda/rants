const express = require('express');

const router = express.Router();
const Rant = require('../models/Rant')
const {ensureAuthenticated} = require('../middleware/auth')

// @desc add rant page
//@route /rants/add
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('rants/add')
})

// @desc parse the form data
//@route /rants/
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        req.body.user = req.user; // adding the user to the body for the rant model
        await Rant.create(req.body)
        res.redirect('/dashboard')
    }catch (err) {
        console.log(err)
        res.render('errors/500')
    }
})


module.exports = router