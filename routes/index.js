const express = require('express');

const router = express.Router();

// @desc Login/Landing page
//@route /
router.get('/', (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc dashboard page
//@route /dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})


module.exports = router