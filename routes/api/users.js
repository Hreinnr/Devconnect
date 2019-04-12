/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();

//@route  Get api/users/test
//Dec     Test users route
//Access  Private
router.get('/test', (req, res) => res.json({msg: "User works"}));

module.exports = router;
