const express = require('express');

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const qs = require('querystring')
const User = require('../model/userModel')
const fs = require("fs");
const formidable = require('formidable');
const path = require('path')
const moment = require('moment');
const router = express.Router();
const cloudinary = require('cloudinary')
const fileParser = require('connect-multiparty')()

cloudinary.config({
  cloud_name: 'afrikal',
  api_key: '345824351715158',
  api_secret: '55TwfraW6ST15TGvq6tjHSF9NfA'
})

const salt = 10

/* GET home page. */

//user login route
router.post('/api/login', function (req, res, next) {
  var password = req.body.password
  var email = req.body.email;
  var error = {}
  if (email == "") error.email = "email is required";
  if (password == "") error.password = "password is required";
  if (error.password || error.email) {
    return res.json(error)
  }
  var data = {
    password: password,
    email: email
  }
  User.find().then((user) => console.log(user))
  User.findOne({
    email: req.body.email
  }).then((user) => {
    if (user) {
      console.log(user)
      data.username = user.username
      data.id = user._id
      console.log(user);
      bcrypt.compare(password, user.password).then((valid) => {
        var token = jwt.sign(data, "secretkey").toString();
        console.log(token)
        res.header('x-auth', token).json({ "token": token });
      }).catch((error) => (console.log(error)));
    } else res.json({ "email": "Username/Password Incorrect" })
  }).catch((error) => res.json("An error has occured. please try again later"))

});

//user signin route
router.post('/api/registration', function (req, res, next) {
  console.log(req.body)
  var { fullname, email, password, cpassword, interest, dob, bio, avatar } = req.body;
  var date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
  var error = {}
  if (fullname == "") error.name = "Full Name is required";
  if (password == "") error.password = "Password is required";
  if (email == "") error.email = "Email is required";
  if (cpassword == "") error.cpassword = "Confirm password cannot be empty";
  if (dob == "") error.dob = "DOB is required";
  if (interest == "") error.interest = "Interest field cannot be empty";

  if (error.name || error.password || error.email || error.cpassword || error.dob || error.interest) {
    return res.json({ error: error })
  }
  if (password !== cpassword) return res.json({ "error": { cpassword: "Password Does Not Match" } })
  User.findOne({ email: email }).then((user) => {
    if (user) {
      error.email = "Email already exist"
      return res.json({
        error: error
      })
    }
    else bcrypt.hash(password, salt).then((hash) => {
      var newUser = new User({
        fullname: fullname,
        email: email,
        password: hash,
        bio: bio,
        dob: dob,
        avatar: avatar,
        interest: interest,
        date: date
      });
      newUser.save().then((user) => {
        if (user) res.json({ success: "Account Created Successfully" }); else res.json({ error: "error. please try again later" })
      }).catch((error) => { console.log(error); res.json({ "error": "An error has occured" }); })
    }).catch((err) => { res.json({ "error": "An error has occured. Please try again later" }); console.log(err) })

  })


});

router.post('/api/updateProfile', function (req, res, next) {
  var { fullname, email, currentPassword, newPassword, cNewPassword, interest, dob, bio, avatar } = req.body;
  var field = {}
  if (fullname) field.fullname = fullname
  if (newPassword) field.password = newPassword
  if (dob) field.dob = dob
  if (avatar) field.avatar = avatar
  if (bio) field.bio = bio;
  if (interest.length) field.interest = interest
  var check = {}
  if (email == "") check.email = "Email cannot be empty";
  if (currentPassword == "") check.currentPassword = "Password is required";

    if (cNewPassword !== newPassword) return res.json({ error: { cNewPassword: "Password does not match" } })
    User.findOne({ email: email }).then((user) => {
      if (user) {
        bcrypt.compare(req.body.currentPassword, user.password).then((valid) => {
          if (valid) {
            User.update({ email: req.body.email }, field)
              .then((user) => { if (user) res.json({ "success": "Account Updated Successfully" }); else res.json({ error: { email: "Failed to update user" } }) })
              .catch((error) => { console.log(error); res.json({ error: "an error has occured. Please try again" }) })
          } else res.json({ error: { currentPassword: "Password does not match" } })
        }).catch((error) => (console.log(error)));

      } else res.json({ "error": { email: "User does not exist" } })
    }).catch((error) => { console.log(error); res.json({ "error": { email: "An error has occured" } }) })

 
})
//user signin route
// router.post('/api/updateUser', function (req, res, next) {

// });

module.exports = router;
