/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();

//@route  Get api/profile/test
//Dec     Test profile route
//Access  public
router.get('/test', (req, res) => res.json({msg: "Profile works"}));

module.exports = router;
