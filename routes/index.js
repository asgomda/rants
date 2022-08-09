const express = require('express');

const router = express.Router();
const Rant = require('../models/Rant')
const {ensureAuthenticated, ensureGuest} = require('../middleware/auth')

// @desc Login/Landing page
//@route /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc dashboard page
//@route /dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        // finding stories in dashboard
        const rants = await Rant.find({user: req.user.id})
        res.render('dashboard', {
            name: req.user.firstName,
            rants
        })
    } catch (error) {
        console.log(error)
    }
    

})


module.exports = router