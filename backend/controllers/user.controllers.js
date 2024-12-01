const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const zod = require('zod')
const { JWT_SECRET } = require('../config')

const signupBody = zod.object({
    username : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string()
})

const signinBody = zod.object({
    username : zod.string().email(),
    password : zod.string()
})

const updateBody = zod.object({
    password : zod.string().min(3),
    firstName : zod.string(),
    lastName : zod.string()
})

exports.signup = async(req, res)=>{
    const { success } = signupBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message : "Incorrect Inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            message : "Email already taken"
        })
    }

    const user = await User.create({
        username : req.body.username,
        password : req.body.password,
        firstName : req.body.firstName,
        lastName : req.body.lastName
    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);
    res.status(200).json({
        message : "User created successfully",
        token
    })
}

exports.signin = async(req, res)=> {
    const { success } = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message : "Incorrect Inputs"
        })
    }
    
    const user = await User.findOne({
        username : req.body.username,
        password : req.body.password
    });
    
    if(user){
        const userId = user._id;
        const token = jwt.sign({
            userId
        }, JWT_SECRET)
        res.status(200).json({
            token
        })
        return;
    }
    res.status(411).json({
        message : "Error while logging in"
    })
}

exports.update = async(req, res)=> {
    const { success } = updateBody.safeParse(req.body);
    if(!success) {
        return res.status(411).json({
            message : "Error while updating information"
        })
    }
    const user = await User.findOne({
        _id : req.userId
    })
    if(!user) {
        return res.status(411).json({
            message : "Error while updating information"
        })
    }
    user.password = req.body.password;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.save();
    res.status(200).json({
        message: "Updated successfully"
    })
}