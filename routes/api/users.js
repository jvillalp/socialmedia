const express = require('express');
const router = express.Router();
// need a second para, of middleware and check if username, if username, if length is same, check if there are any errors or if name is there
const { check, vaidationResult, validationResult } = require('express-validator')
//@route          GET api/users
//@desc           Test Route
//@acess value    Pubic (do not need a token will create auth middleware)

//do not need .get request, only to check connection on postman
// router.get("/", (req, res) => res.send("User Route"));

//@desc           Regsiter User


// []= is for the second param for the check
router.post("/", [
    check('name', 'Name is required').not().isEmpty(),
    check('email', "Please include a valid email").isEmail(),//formated as email address
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })//this will return if one of those checks fails
    }
    console.log(req.body)
    res.send("User Route");
});

module.exports = router;