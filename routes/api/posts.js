const express = require('express');
const router = express.Router();
//@route          GET api/posts
//@desc           Test Route
//@acess value    Pubic (do not need a token will create auth middleware)
router.get("/", (req, res) => res.send("Posts Route"));

module.exports = router;