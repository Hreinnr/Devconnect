/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();

//@route  Get api/posts/test
//Dec     Test post route
//Access  public
router.get('/test', (req, res) => res.json({msg: "Posts works"}));

module.exports = router;
