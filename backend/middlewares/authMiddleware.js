const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config.js')
const User = require('../models/User.model.js')
// console.log(JWT_SECRET)

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(403).json({
            message : "Authorization denied"
        })
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({_id : decoded.userId})
        if(user){
            req.userId = decoded.userId;
            next();
        }
        else{
            res.status(403).json({
            message : "User does not exits"});
        }
    } catch (error) {
        console.log("Error at authMiddleware " + error)
        return res.status(403).json({
            message : "User not verified"
        });
    }
}

module.exports = authMiddleware;