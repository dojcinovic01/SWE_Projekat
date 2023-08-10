const mongoose = require("mongoose");
const { isEmail } = require('validator');
const Notification = require("./notification.js");
const UserSchema = new mongoose.Schema({
name: {
type: String,
required: true,
min:2,
max:50
},
age: {
type: Number,
min:16,
max:103,
required: true
},
username: {
type: String,
required:true,
unique:true,
min:4,
max:15
},
picturePath: {
type:String,
default:""
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    validate:[isEmail,'Molimo Vas unesite validnu email adresu']
},
password:{
    type:String,
    required:true,
    min:5
},
friends:{
    type:Array,
    default:[]
},
// friends: {
//   type: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     friendshipDate: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   default: []
// },
tip: {
  type: String,
  default: "begginer",
  enum: ["profi", "Trejder", "Admin", "begginer"]
},
postIDs:{
    type:Array,
    default:[]
},
picturePath:{
    type:String,
    default:"",
    required:false
},
dateCreated: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: [{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Korisnik'
      },
      number: {
        type: Number,
        min: 1,
        max: 5
      }
    }],
    default: function() {
      if (this.tip === 'Admin' || this.tip==='beginner') {
        return undefined;
      }
      return [];
    }
  },
  socials: {
    instagram: {
      type: String,
      default: "",
      set: function(value) {
        if (this.tip !== 'profi') {
          return "";
        }
        return value;
      }
    },
    linkedin: {
      type: String,
      default: "",
      set: function(value) {
        if (this.tip !== 'profi') {
          return "";
        }
        return value;
      }
    }
  },
  notifications: [Notification.schema],

  reklama: {
    postoji:{
      type:Boolean
    },
    vremeNastanka: {
      type: Date,
      Default:Date.now
    },
    tipReklame: {
      type: String,
      enum: ["Mala", "Velika"]
    },
    slogan:{
      type: String,
      min:5,
      max:200
    }
  },
viewedProfile:{
  type:Number,
  default:0
}
});
UserSchema.pre("save", function (next) {
  if (this.tip !== "profi") {
    this.reklama = undefined;
  }
  next();
});
const User= mongoose.model("users",UserSchema);
module.exports=User;