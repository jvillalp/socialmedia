const express = require('express');
const router = express.Router();
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

module.exports = router;