const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require('express-flash');
const mongoose = require("mongoose");
require('dotenv').config();
const bcrypt = require('bcryptjs')

const indexRouter = require("./routes/index");

const mongoDb = process.env.MONGO_STRING;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
const User = require("./models/user");

passport.use(
    new LocalStrategy(async(username, password, done) => {
        try {
            const user = await User.findOne({ username: username});
            if (!user) {
                return done(null, false, { message: "Incorrect username" })
            };
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: "Incorrect password"})
                }
            })
        } catch (err) {
            return done(err);
        };
    })
)

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err);
    };
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use('/', indexRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));