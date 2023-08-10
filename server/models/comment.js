const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
idobjave:{
   type: mongoose.Schema.Types.ObjectId,
   ref:'Post',
   required:true
},
idkorisnika:{
   type: mongoose.Schema.Types.ObjectId,
   ref:'User',
   required:true
},
 picturePath:{
    type:String,
    required:false
 },
 content:{
 type:String,
 required:true,
 min:2
 },
 likeIDs:{
 type:Array,
 default:[]
 },
 marked: {
   type: Boolean,
   default: true
 }
});
const Comment= mongoose.model("comments",UserSchema);
module.exports=Comment;