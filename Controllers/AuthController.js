const userModel = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const signUp = async(req,res)=>{
    const {name,email,password,role,profile} = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({message: 'Name, email and password are required'});
    }
    try{
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role:role || "student",
            profile
        })  
        
        newUser.password = undefined; // Exclude password from the response
        const token = jwt.sign({id:newUser._id, role:newUser.role},process.env.JWT_SECRET,{expiresIn:'1d'})
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(201).json({message: 'User created successfully', user: newUser});
    }
    catch(err){
        return res.status(500).json({message: 'Error creating user', error: err.message});
    }
}

const signIn = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: 'Invalid email or password'});
        }
        user.password = undefined; // Exclude password from the response
            const token = jwt.sign({id:user._id, role:user.role},process.env.JWT_SECRET,{expiresIn:'1d'})
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        res.status(200).json({message: 'User signed in successfully', user});
    }
    catch(err){
        return res.status(500).json({message: 'Error signing in', error: err.message});
    }
}

module.exports = {signUp, signIn};