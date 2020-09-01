const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');


const auth = require('../../middleware/auth')
const profile = require('../../models/Profile')
const User = require('../../models/User');
const Profile = require('../../models/Profile');
//@route          GET api/profile/me
//@desc           Get current users profile
//@acess value    Private (needs to send a toke, auth middleware required)
router.get("/me", auth, async (req, res) => {
    try {
        const progile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            res.status(400).json({ msg: "There is no profile for this user" });
        }

        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});
//@route          POST api/profile/
//@desc           create or update a user profile
//@acess value    Private (needs to send a toke, auth middleware required)
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (website) profileFields.website = website;
    if (bio) profileFields.bio = bio;



    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    // console.log(profileFields.skills);

    // res.send("Hello");
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;

    // console.log(profileFields.social.twitter)

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            //update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile)
        }
        //create 
        profile = new Profile(profileFields);

        await profile.save();
        res.json(Profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

});
//@route          GET api/profile/
//@desc           get all profiles
//@acess value    Public
router.get('/', async (req, res) => {
    try {
        cont profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})
module.exports = router;