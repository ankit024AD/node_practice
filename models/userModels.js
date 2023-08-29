const mongoose = require("mongoose")
const bcrypt = require('bcrypt')


const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
   },
   email:{
    type:String,
    format: 'email',
    required:true,
   },
   password:{
    type:String,
    required:true,
    minlength:[8,"Password length should be 8 characters"]
   },
    address: {
    type: [addressSchema],
    validate: [
      {
        validator: function (addresses) {
          return addresses.length >= 1 && addresses.length <= 5;
        },
        message: "Must have a minimum of 1 and maximum of 5 preferred delivery addresses",
      },
    ],
  },
  role:{
    type:String,
    enum:['admin','user'],
    default:'user'
  }
   });
   userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
   }

  module.exports=mongoose.model('user', userSchema);