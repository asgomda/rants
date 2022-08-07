const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc Authenticate with Google
//@route /auth/google
router.get('/google', passport.authenticate('google', {scope: ['profile']}))

// @desc callback for Google Authentication
//@route /auth/gogle/callback
router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        res.redirect('/dashboard')
    }
)


module.exports = router