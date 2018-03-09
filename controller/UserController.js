const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongodb = require('mongodb');

//database collections
let User = require('../models/user');
let Products = require('../models/products');

function signup(req, res) {
    res.render('signup', { messages: {} })
}

function user(req, res, next) {
    console.log(req.params.id)
    if (req.params.id == 0) {
        res.json({ "message": "You must pass ID other than 0" });
    }
    else next();
}

function login(req, res) {
    const { username, password } = req.body;

    User.findOne({ username: username }, function (err, usr) {

        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        console.log('user >>>', usr)
        if (!usr) {
            return res.status(404).send();
        }
        console.log('begin to compared', password)


        // //No deo lay duoc function trong method
        usr.comparePassword(password, function (err, isMatch) {
            console.log('compared')
            if (!isMatch)
                res.end('wrong pass');
            res.redirect('/products')
            //res.render('home');
        })
    })
};


module.exports = {
    signup,
    user,
    login
}