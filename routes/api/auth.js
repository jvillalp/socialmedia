const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// need a second para, of middleware and check if username, if username, if length is same, check if there are any errors or if name is there
const { check, validationResult } = require('express-validator')


const auth = require('../../middleware/auth');
const User = require('../../models/User');

//@route          GET api/auth
//@desc           Test Route
//@access value    Public (do not need a token will create auth middleware)
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
}
);
//@route          POST api/auth
//@desc           auth user & get token
//@access value    Public (do not need a token will create auth middleware)

router.post("/", [
    check('email', "Please include a valid email").isEmail(),//formated as email address
    check('password', 'Password is required').exists()
],
    //to use await, you have to define an async function
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })//this will return if one of those checks fails
        }


        const { email, password } = req.body;

        try {
            //see if user exists
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ errors: [{ message: 'Invalid email' }] });//getting a headers error because did not add return at the beginning - happens if it is not the last res.json in file
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ message: 'Invalid password' }] });//getting a headers error because did not add return at the beginning - happens if it is not the last res.json in file
            }

            //return jsonwebtoken
            // res.send('User Registered');//to check if user is registered

            const payload = {
                user: {
                    id: user.id //because of mongose don't need user_id
                }
            }

            jwt.sign( //this signature will be part of the json token
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },//optional
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });//send token back to client if no error
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

module.exports = router;