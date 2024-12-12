const User = require('../models/User.model');
const Account = require('../models/Account.model')
const jwt = require('jsonwebtoken');
const zod = require('zod')

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
    password : zod.string().min(3).optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional()
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

    await Account.create({
        userId,
        balance : 10000
    })

    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET);
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
        }, process.env.JWT_SECRET)
        res.status(200).json({
            token
        })
        return;
    }
    if(!user){
        res.status(411).json({
            message : "Incorrect username or Password"
        })
    }
    // res.status(411).json({
    //     message : "Error while logging in"
    // })
}

exports.update = async(req, res)=> {
    const { success } = updateBody.safeParse(req.body);
    if(!success) {
        return res.status(411).json({
            message : "Error while updating information"
        })
    }
    await User.updateOne({ _id: req.userId }, req.body);
    res.status(200).json({
        message: "Updated successfully"
    })
}

exports.bulk = async(req, res) =>{
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })
    res.json({
        users : users.map(user=>({
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id
        }))
    })
}