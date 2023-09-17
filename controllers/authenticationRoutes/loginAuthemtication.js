import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import bcrypt from 'bcrypt';

export const login= async (req, res) =>{
    try{
        const {email, password}= req.body.values;
        const user = await User.findOne({email: email});
        // console.log(req.body.values.email)
        // console.log(password)
        if(!user) return res.status(400).json({msg:'User does not exit'});

        const isMatch= await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({msg: 'credentials does not match'});

        const token =jwt.sign({id: user.id}, process.env.JWT_SECRET)
        delete user.password;
        res.status(200).json({user, token})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}