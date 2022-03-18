const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => jwt.sign({user},process.env.SECRET_KEY);
const register = async (req,res) => {
    try {
        
        // check if email is already registred
        let user = await User.findOne({email : req.body.email}).lean().exec();

        if(user){
            return res.status(400).send({msg: "Email is already registered"});
        }

        user = await User.create(req.body);
        // console.log(user);
        return res.status(400).send(user);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const login = async (req,res) => {
    try {
        const user = await User.findOne({email : req.body.email});
        // console.log(user);
        if(!user){
            return res.status(400).send("Wrong Email or Password");
        }
        
        const match = user.checkPassword(req.body.password);
        // console.log(match);
        if(!match){
            return res.status(400).send("Wrong Email or Password");

        }

        const token = generateToken(user);
        
        return res.status(200).send({user,token});

    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = {register,login};