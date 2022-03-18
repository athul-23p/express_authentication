const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.get('',async (req,res) => {
    try {
        let users = await User.find();
        return res.status(200).send(users);
    } catch (error) {
        return res.status(400).send(error);
    }
})
module.exports = router;