const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide a name"]
    },
    email:{
        type:String,
        required:[true,"please provide a email"]
    },
    password:{
        type:String,
        required:[true,"please provide a password"],
        minlength: 6
    },
    phone:{
        type:Number,
        required:[true,"please provide a Phone Number"]
    },
    status:{
        type:String,
        enum:['Active','Banned'],
        default:'Active'
    },
    role:{
        type:String,
        required:[true,"please provide your role"]
    },
},{
    timestamps:true
})

userSchema.pre('save',async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model('User',userSchema);