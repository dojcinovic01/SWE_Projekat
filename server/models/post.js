const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
idkorisnika:{
   type:String,
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
 likes:{
 type:Number,
 default:0
 },
 likesIDS:{
    type:Array,
    default:[]
 },
 commentIDS:{
  type:Array,
  default:[]
 },
 dateCreated: {
   type: Date,
   default: Date.now
 },
 free:{
   type:Boolean,
   default:false
 },
 marked: {
  type: Boolean,
  default: false,
},
reports: {
  type: Array,
  default: [],
  required: function() {
    return this.marked === true;
  }
}
});
const Post= mongoose.model("posts",UserSchema);
module.exports=Post;