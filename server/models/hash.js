const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  expirationTime: { 
    type: Date, 
    expires: '2h', 
    default: Date.now
   },
  code: { 
    type: String, 
    required: true,
    unique:true 
  },
  userId: { type: mongoose.Schema.Types.ObjectId,
     required: true
     },
});

const verificationCodeSchema= mongoose.model("hash",UserSchema);
module.exports=verificationCodeSchema;