const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// need a second para, of middleware and check if username, if username, if length is same, check if there are any errors or if name is there
const { check, validationResult } = require('express-validator')
//@route          GET api/users
//@desc           Test Route
//@access value    Public (do not need a token will create auth middleware)

//do not need .get request, only to check connection on postman
// router.get("/", (req, res) => res.send("User Route"));

//@desc           Regsiter User

const User = require('../../models/User')


// []= is for the second param for the check
//needed this validation to make sure user has entered the correct data when they make request
router.post("/", [
    check('name', 'Name is required').not().isEmpty(),
    check('email', "Please include a valid email").isEmail(),//formated as email address
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
    //to use await, you have to define an async function
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })//this will return if one of those checks fails
        }


        const { name, email, password } = req.body;

        try {
            //see if user exists
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ message: 'User already exists' }] });//getting a headers error because did not add return at the beginning - happens if it is not the last res.json in file
            }


            // get users gravatar 
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            });
            //encrypt password susing bycrpt

            //or can do call-backs (.then, . catch)
            //await is much more elegent and readable
            const salt = await bcrypt.genSalt(10); //create salt to do hashing with

            user.password = await bcrypt.hash(password, salt);//take password and hash it

            await user.save(); //anything you have to return, have to create a promise - here we are saving user to database

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