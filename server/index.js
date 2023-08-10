const bodyParser=require("body-parser");
const jwt = require('jsonwebtoken');
const cors=require('cors');
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const helmet=require("helmet");
const morgan=require("morgan");
const express=require("express");
const path=require("path");
const bcrypt=require("bcrypt");
const cookieParser=require('cookie-parser');
const {search}=require('./controllers/users.js')
require("dotenv").config();
var axios=require("axios");

// const { register } = require('./controllers/auth.js');
//const { login } = require('./controllers/auth.js');

const app=express();
const User=require("./models/user.js");
const Post=require("./models/post.js");
const Comment=require("./models/comment.js");
const authRoutes=require("./routes/auth.js");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const { verifyToken } = require("./middleware/auth");
//const { users, posts } = require("./data/index");

app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb" , extended: true }));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));


mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@tt.v38urrv.mongodb.net/TTDatabase?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Uspešno povezan sa MongoDB bazom");
  })
  .catch((error) => {
    console.error("Greska prilikom povezivanja sa MongoDB bazom:", error);
  });





//ROUTES WITH FILES//
//app.use("/auth/register", upload.single("picture"),register);
//app.post("/posts", verifyToken, upload.single("picture"), createPost);
//ROUTES WITH FILES//


//ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

//ROUTES
//sendwhatsappmess();
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }]
    });
  
    if (!user) {
        return res.status(400).json({
            user: null,
            token: null,
            message:'Incorrect username'
          });     
        }
    
    let tip=user.tip;

    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (!passwordMatch) {
        return res.status(400).json({
            user: null,
            token: null,
            message:'Incorrect password'
          });    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '2h',
    });
    res.setHeader('Type', user.tip);

    let ratinzi=[]
    if(user.rating!=undefined){
    for(let a of user.rating){
    ratinzi.push(a.number)
    }
  }

    let korisnik={
    tip:user.tip,
    name:user.name,
    id:user._id,
    username:user.username,
    age:user.age,
    profilePicture:user.picturePath,
    ratinzi:ratinzi,
    socials:user.socials,
    friendsNumber: user.friends.length
    }

    return res.status(200).json({
        user:korisnik,
        token
        //name:user.name
      });
      
    
  });


app.get("/vidiObjave", async (req,res)=>{
    const user= await User.findById(req.body.id);
    //IF TOKEN THEN CONTINUE ELSE REDIRECT LOGIN
    const statusi=[
        {
        objava:String,
        ime:String,
        username:String,
        picture:String,
        id:String
   }];
    if(!user){
        return res.status(404).json({ message: 'Korisnik not found' }); //naivni korisnik, treba promeniti metodu eventually 
    }
    let tip=user.tip;
    const sveobjave=[];
    if(tip=="Admin")
    {
       await User.find({}).then(found=>
            {
                found.forEach(korisnik=>
                korisnik.post.forEach(objava => {
                    statusi.push({objava:objava, ime:korisnik.name,username:korisnik.username,picture:"slika", id:korisnik.id})
                })
                )
            })  
    }  
    else{
       await Promise.all(user.friends.map(async ajdi =>  { 
       const novi= await User.findById(ajdi);
       if(novi!=null){
        novi.post.forEach(objava=>
        statusi.push({objava:objava, ime:novi.name,username:novi.username,picture:"slika", id:novi.id}))
        }
    }));
}
return res.status(200).json(statusi);        

}); 
app.post("/change", async(req,res)=>{
const zaPromenu=res.body;
if(zaPromenu!="email" || zaPromenu!="username"){
    return;
}
const user=User.findById

});
const usedMemory = process.memoryUsage();
const heapTotalGB = usedMemory.heapTotal / (1024 * 1024 * 1024);
console.log(`heapTotal: ${heapTotalGB} GB`);



app.listen(3001,() => {
    console.log("Server runs");
})
app.get('/',(req,res)=>res.render('home'));

//COOKIES
app.get('/read-cookies',(req,res)=>{

});

app.get('/set-cookies',(req,res)=>{
res.cookie('userType',false,{maxAge:1000*60*60});

});
//COOKIES

function funkcija(){
  var data = getTextMessageInput(process.env.RECIPIENT_WAID, 'Welcome to the Movie Ticket Demo App for Node.js!');
  
  sendMessage(data)
    .then(function (response) {
      return;
    })
    .catch(function (error) {
      console.log(error);
      console.log(error.response.data);
      return;
    });
};
//funkcija();

function sendMessage(data) {
  var config = {
    method: 'post',
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: data
  };

  return axios(config)
}

function getTextMessageInput(recipient, text) {
  return JSON.stringify({
    "messaging_product": "whatsapp",
    "preview_url": false,
    "recipient_type": "individual",
    "to": recipient,
    "type": "text",
    "text": {
        "body": text
    }
  });
}