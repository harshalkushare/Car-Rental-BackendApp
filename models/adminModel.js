const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide a name"]
    },
    email:{
        type:String,
        required:[true,"please provide a email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"please provide a password"],
        minlength: 6
    },
    phone:{
        type:Number,
        required:false
    },
    lastLogin:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})

adminSchema.pre('save',async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model('Admin',adminSchema);
