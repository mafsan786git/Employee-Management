const express = require('express');
const router = express.Router();
const util = require('util');

const {ensureAuthenticated} = require('../config/auth');


router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        user:req.user
    });
    // res.send(req.user);
});

module.exports = router;