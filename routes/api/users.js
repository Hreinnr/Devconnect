/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load User model
const User = require('../../models/User');

//@route    Get api/users/test
//Dec       Test users route
//Access    Private
router.get('/test', (req, res) => res.json({
  msg: "User works"
}));

// @route   Get api/users/register
// @desc    Register users
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: 'Email alredy exists'
        });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', //Size
          r: 'pg', //Rating
          d: 'mm' // Default
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// @route   Get api/users/login
// @desc    Login User / Returning token JWT token
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by Email
  User.findOne({
      email
    }) // email: email same same
    .then(user => {
      //Check for users
      if (!user) {
        return res.status(404).json({
          email: 'User not found'
        });
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            //User Matched

            //Create JTW payload
            const payload = { id: user.id, name: user.name, avatar: user.avatar };
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
            });
          } else {
            return res.status(400).json({
              password: 'Password incorrect'
            });
          }
        });
    });
});

// @route   Get api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { sesssion:false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
