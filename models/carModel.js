const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"please add car name"]
  },
  category:{
    type:String,
    enum:['hatchback','suv','sedan'],
    required:true
  },
  brand:{
    type:String,
    required:[true,"please add brand"]
  },
  model:{
    type:String,
    required:[true,"please add name"]
  },
  year:{
    type:Number,
    required:[true,"please add year"]
  },
  price:{
    type:Number,
    required:[true,"please add a price per day"]
  },
  image:{
    type:String,
    required:[true,"please add image"]
  },
  feature:[{
    type:String
  }],
  transmission:{
    type:String,
    enum:['manual','automatic'],
    required:true
  },
  fuelType:{
    type:String,
    enum:['petrol','disel','electric','hybrid'],
    required:true
  },
  seats:{
    type:Number,
    required:true
  },
  isAvaible:{
    type:Boolean,
    required:true
  }
},{timestamps:true})

module.exports = mongoose.model('Car',carSchema);