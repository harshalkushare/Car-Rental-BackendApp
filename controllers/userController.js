const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const { createToken } = require('../utils/jwt');

const userRegister = async (req,res) =>{
    try {
        const {name,email,password,phone} = req.body;

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                success:false,
                message:'user already exists'
            })
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role:'user'
        })

        res.status(201).json({
            success:true,
            token:createToken(user),
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success:false
        })
    }
}

const loginUser = async (req,res) =>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'please provide email or password'
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:'invalid email or password'
            })
        }

        if(user.status === 'Banned'){
            return res.status(403).json({
                success:false,
                message:"Your account has been banned please contact support/admin."
            })
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid password"
            })
        }

        res.json({
            success:true,
            token:createToken(user),
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone
            }
        })
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
            success:false,
            message:"server error during login"
        })
    }
}

//Get user profile with all bookings
const getProfileWithBookings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const userId = req.user._id
        const bookings = await Booking.find({ userId })
            .populate({
                path: "carId",
                select: "name brand year model transmission price image fuelType seats features"
            })
            // .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    joinedDate: user.createdAt
                },
                bookings
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const updateProfile = async (req,res) => {
    try {
        const {name,email,phone} = req.body;

        const existingUser = await User.findOne({email, _id : { $ne : req.user._id }});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Email already in use"
            })
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {name,email,phone},
            {new:true}
        ).select('-password')      

        res.json({
            success:true,
            message:"profile upadated successfully",
            data:{
                user:{
                     _id:user._id,
                     name:user.name,
                     email:user.email,
                     phone:user.phone,
                     joinedDate:user.createdAt
                }
            }
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const changePassword = async (req,res) => {
    try {
        const {currentPassord,newPassword} = req.body;

        const user = await User.findById(req.user._id);

        if(!await user.matchPassword(currentPassord)){
            return res.status(400).json({
                success:false,
                message:"Current password is incorrect"
            })
        }
        user.password = newPassword;
        await user.save();

        res.json({
            success:true,
            message:"password is changed successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {
    userRegister,
    loginUser,
    updateProfile,
    changePassword,
    getProfileWithBookings
}