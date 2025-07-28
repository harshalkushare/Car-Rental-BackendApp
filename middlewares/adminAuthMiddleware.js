const {verifyToken} = require('../utils/jwt');
const Admin = require('../models/adminModel');

exports.protect = async (req,res,next) => {
     const authHeader = req.headers.authorization;

     if(!authHeader){
        return res.status(401).json({message:"Authorization is missing"});
     }

     if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message:"Token must be bearer token"});
     }

     const token = authHeader.split(' ')[1]
     if (!token) {
        return res.status(401).json({message:"Token not provided"});
     }

     //verify token
     const decoded = verifyToken(token);

     if (!decoded) {
        return res.status(401).json({message:"invalid or expire token"})
     }

     const admin = await Admin.findById(decoded.id);
     if (!admin) {
        return res.status(401).json({message:"User is not found"})
     }
     
     req.admin = admin;
     next();
}
