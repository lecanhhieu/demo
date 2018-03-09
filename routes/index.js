// const routes = require('express').Router();

// routes.get('/', (req, res) => {
//   res.status(200).json({ message: 'Connected!' });
// });

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

//database collections
let User = require('../models/user');
let Products = require('../models/products');


const userController = require('../controller/UserController');
//Day la vi du, dung controler. chuyen tat ca function vao controler nhe
router.get('/users/signup', userController.signup);
router.get("/user", userController.user);

router.post('/login', userController.login);


router.get('/home', function (req, res) {
    //console.log xet loi
    console.log(req.session)
    if (!req.session.user) {
        return res.status(401).send();
    }

    return res.status(200).send('Wellcome to Login Demo Web');
});

router.post('/users/signup', function (req, res) {
    const { name, email, username, password } = req.body;
    // const name = req.body.name;
    // const email = req.body.email;
    // const username = req.body.username;
    // const password = req.boby.password;

    //console.log(req.boby.password);

    req.checkBody('name', 'Name is require').notEmpty();
    req.checkBody('email', 'Email is require').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is require').notEmpty();
    req.checkBody('password', 'Password is require').notEmpty();

    let errors = req.validationErrors();

    console.log('coming up');

    if (errors) {
        res.render('signup', {
            messages: { errors: errors }
        });
    } else {
        console.log('ok');
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        //Nhin cho nay. m hash pasword truwosc khi dua vao db
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        res.render('login', {
                            messages: 'You are now registered and can log in'
                        });
                    }
                });
            });
        });
    }

});

router.get('/login', function (req, res) {
    res.render('login', { messages: {} });
});

router.get('/products', function (req, res, next) {
    Products.find(function (err, docs) {
        console.log('docs >>', docs)
        if (err) throw err;
        res.render('home.pug', { data: docs });
    });
});



router.post('/addProduct', function (req, res, next) {

    const product = new Products({
        name: req.body.name,
        desc: req.body.desc
    })

    product.save(function (err, result) {
        if (err) { throw err; }
        res.redirect('/products');
    })
});

router.post('/edit', function (req, res, next) {

    console.log(req.body);

    Products.findOneAndUpdate({ _id: req.body.id },
        {
            name: req.body.name,
            desc: req.body.desc
        }, { upsert: true }, function (err, data) {
            if (err) return res.send(500, { error: err });
            res.redirect('/products');
        })
});

router.get('/delete', function (req, res, next) {
    var id = req.query.id;

    Products.remove({ _id: id }, function (err) {
        if (!err) {
            res.redirect('/products')
        }
        else {
            throw err;
        }
    });
    //res.redirect('/products')
});


module.exports = router;    