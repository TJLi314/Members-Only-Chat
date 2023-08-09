const User = require("./models/user");
const Message = require("./models/message");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const e = require("express");

exports.index = (req, res, next) => {
    res.render("index");
}

exports.sign_up_get = (req, res, next) => {
    res.render("sign_up", {errors: null});
}

exports.sign_up_post = [
    body("username", "Name must not be empty").trim().isLength({min: 1}).escape(),
    body("username").custom(async value => {

        const user = await User.findOne({username: value});
        if (user) {
            throw new Error("Username already in use");
        }
    }),
    body("password", "Password must not be empty").trim().isLength({min: 1}).escape(),
    body("confirmPassword", "Confirm Password must match Password").custom((value, { req }) => {
        return value === req.body.password;
    }),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            res.render('sign_up', {errors: errors.array()});
        } else {
            bcrypt.hash(req.body.password, 10, (error, hashedpassword) => {
                if (error) {
                    return next(error);
                } else {
                    signUpSuccess = true;
                    User.create({
                        username: req.body.username,
                        password: hashedpassword,
                        membership: false,
                    })
                    .then(result => res.render('sign_up_success', {username: req.body.username}))
                    .catch(error => next(error));
                }
            });
        }
    }),
];

exports.log_in_get = (req, res, next) => {
    res.render("log_in");
}

exports.log_in_post = passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/log-in",
    failureFlash: true
})

exports.home_get = (req, res, next) => {
    res.render("home", {user: res.locals.currentUser});
}

exports.membership_get = (req, res, next) => {
    res.render("membership", {user: res.locals.currentUser, error: false});
}

exports.membership_post = asyncHandler(async (req, res, next) => {
    if (req.body.password !== process.env.SECRET_PASSWORD) {
        res.render("membership", {user: res.locals.currentUser, error: true});
    } else {
        const user = new User({
            username: res.locals.currentUser.username, password: res.locals.currentUser.password, 
            membership: true, _id: res.locals.currentUser._id,
        });

        await User.findByIdAndUpdate(res.locals.currentUser, user);
        res.render("membership_success", {user: res.locals.currentUser});
    }
})

exports.log_out = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    })
}

exports.chat_room_get = (req, res, next) => {
    res.render("chat_room", {user: res.locals.currentUser});
}

