const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Rant = require('../models/Rant')
const {ensureAuthenticated} = require('../middleware/auth')

// @desc add rant page
//@route GET /rants/add
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('rants/add')
})

// @desc parse the form data
//@route POST /rants/
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

// @desc populate public rants
//@route GET /rants
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const rants = await Rant.find({status: 'public'})
                            .populate('user')
                            .sort({createdAt: 'desc'})
                            .lean()

        res.render('rants/index', {
            rants,
        })
    }catch (err) {
        console.log(err)
        res.render('errors/500')
    }
})

// @desc Show rant page
//@route GET /rants/:id
router.get('/:id', ensureAuthenticated, async (req, res) => {
    console.log(req.originalUrl)
    try {
        let rant = await Rant.findById(req.params.id)
                            .populate('user')
                            .lean()
        
        if (!rant){
            return res.render('error/400')
        }
        res.render('rants/show', {
            rant,
        })
    } catch (err) {
        console.log(err)
        res.render('error/400')
    }

})

// @desc edit rant page
//@route GET /rants/edit/:id
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {

    try {
        const rant = await Rant.findOne({_id: req.params.id}).lean()
    
        if (!rant){
            return res.redirect('errors/400');
        }
    
        if (rant.user != req.user.id){
            res.redirect('rants')
        } else{
            res.render('rants/edit', {
                rant,
            })
        }
        
    } catch (err) {
        console.log(err)
        res.render('errors/400')
    }
})

// @desc update rant
//@route PUT /rants/:id
router.put('/:id', ensureAuthenticated, async (req, res) => {

    try {
        let rant = await Rant.findOne({_id: req.params.id}).lean()
    
        if (!rant){
            return res.redirect('errors/400');
        }
    
        if (rant.user != req.user.id){
            res.redirect('rants')
        } else{
            rant = await Rant.findOneAndUpdate({_id: req.params.id}, req.body, {
                new: true,
                runValidators: true,
            })
            res.redirect('/dashboard')
        }
        
    } catch (err) {
        console.log(err)
        res.render('errors/400')
    }
})

// @desc Delete rant 
//@route DELETE /rants/:id
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Rant.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        return res.render('errors/500')
    }
})


// @desc show rants of a person
//@route GET /rants/user/:userId
router.get('/user/:userId', ensureAuthenticated, async (req, res) => {
    try {
        let rants = await Rant.find({
            user: mongoose.Types.ObjectId(req.params.userId),
            status: 'public',
        })
        .populate('user')
        .lean()
        res.render('rants/index', {
            rants,
        })
    } catch (err) {
        console.log(err)
        res.render('errors/400')
    }
})


module.exports = router