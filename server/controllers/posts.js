const Post=require("../models/post.js");
const Comment=require("../models/comment.js");
const User=require("../models/user.js");
const mongoose = require('mongoose');
const accountSid = 'AC7795cc9f767eafdcc0b50073b9b0a08f';
const authToken = '8249a66324c95152d77b51f4d47d0ea4';
const axios = require('axios');
const client = require('twilio')(accountSid, authToken);
const {getStockData}=require("../controllers/Konfiguracije.js");
const {sendNotification} = require("../Notification.js");

let statusi = [
  {
    objava: String,
    ime: String,
    username: String,
    picture: String,
    id: String,
    likes: Number,
  },
];
class Report {
  constructor(reason, time = new Date().toISOString(), userId) {
    this.reason = reason;
    this.time = time;
    this.userId = userId;
  }
}
const sendwhatsappmess=async(req,res)=>{
    client.messages
      .create({
        body: "Ovo je poruka za ristu",
        from: 'whatsapp:+381611710281',
        to: "whatsapp:+381648603979"
      })
      .then(message => console.log(message.sid))
      .catch(error => console.error(error));
 
}



//CREATE//
const createPost=async(req,res)=>{
  const session = await mongoose.startSession();
  session.startTransaction();
    try{
      const { userId, description } = req.body;
      const ajdi=req.user.userId;
      const user= await User.findById(ajdi);
      console.log(userId)
if(!user){
  return res.status(200).json({message:'Aborted'});
}

let fotografija="";
if(req.file!=null){ 
fotografija = req.file.path; 
 }

 let tipObjave;
 if(req.body.free==undefined || req.body.free==="true"){
   tipObjave=true;
 }
  else{
   tipObjave=false;
  }

const newPost = new Post({
  idkorisnika: userId,
  content: req.body.description,
  picturePath:fotografija,
  dateCreated: Date.now(),
  free:tipObjave
});
    await newPost.save({ session: session });
    user.postIDs.push(newPost);
    await user.save({ session: session });
    await session.commitTransaction();

    const povratak={
      objava: newPost.content,
      ime: user.name,
      username: user.username,
      picture: newPost.picturePath,
      id: newPost._id,
      likes: newPost.likesIDS,
      user:user._id,
      profilePicture:user.picturePath,
      dateCreated:newPost.dateCreated
    }

    return res.status(201).json({povratak});
    }
    catch(err) {
       session.abortTransaction()
        res.status(409).json({ message: err.message });
      }
      finally {
        session.endSession();
}
}

const changePost = async (req, res) => {
try{
  const ulogovan=await User.findById(req.user.userId);

  const { postId, postContent } = req.body;

  if(!ulogovan)
  return res.status(202).json({message:'Greska-ulogovan error 404'})

  const post = await Post.findById(postId);

  if(!post){
    console.log("Greska, post ne postoji");
  return res.status(404).json({message:'Greska, post ne postoji'})
  }

  if(ulogovan._id.toString()!==post.idkorisnika.toString()){
  console.log("Pokusali ste da izmenite tudji post")
  return res.status(404).json({message:'Pokusali ste da izmenite tudji post'})
  }

  post.content = postContent;
  await post.save();
   let vrati = {
    objava: post.content,
    ime: ulogovan.name,
    username: ulogovan.username,
    picture: post.picturePath,
    id: post._id,
    likes: post.likesIDS,
    user:ulogovan._id,
    profilePicture:ulogovan.picturePath,
    dateCreated:post.dateCreated,
   }
  res.status(201).json({ message: 'Post je uspešno ažuriran.', post: vrati });
}
catch(error){
  return res.status(405).json({error:error})
}
}


//READ
const seePosts = async (req, res) => {
  try {
    let tradingnews=[];
    let ajdi=req.user.userId; //ovo dobija iz tokena koji se dobija kao middleware u ruti
    const user = await User.findById(req.user.userId);
    let statusi=[];
    if (!user) {
      return res.status(404).json({ message: "Korisnik not found" });
    }
    let tip = user.tip;
    let korisnici=[];

    const idjevi=user.friends;
    for(ajdi of idjevi){
      korisnici.push(await User.findById(ajdi));
    }
  
    for(let korisnik of korisnici) {
      let postovi=korisnik.postIDs;
      for(let postId of postovi){
         let post = await Post.findById(postId);
         if(post){
          let nizkomentara=await Comment.find({idobjave:post._id});
          let komentari=[];
          for(let komentar of nizkomentara){
            komentari.push({
             id:komentar._id,
             content:komentar.content,
             username:komentar.username,
             picture:""
            })
          }
    //if(post.marked){
      statusi.push({
        objava: post.content,
        ime: korisnik.name,
        username: korisnik.username,
        picture: post.picturePath,
        id: post._id,
        likes: post.likesIDS,
        user:korisnik._id,
        profilePicture:korisnik.picturePath,
        dateCreated:post.dateCreated,
        //komentari:komentari
      });
    }
  }
  //}
  }
  try{
    tradingnews=await getStockData();
    }
    catch(error){
      console.log("Greska- getStockData" + error);
      statusi=statusi.reverse();
      return res.status(200).json({message:"Trenutno nije moguće dobiti informacije o berzi",statusi});
    }

  if (tradingnews != undefined) {
    if(statusi.length>0 && tradingnews.length > 0){ 
    statusi = statusi.flatMap((status, index) => [status, tradingnews[index]]);
    }
    else if(statusi.length==0 && tradingnews.length > 0){
      statusi=tradingnews;
    }
  }
   

     return res.status(200).json({statusi});
  } catch (err) {
    return res.status(404).json({ message:"Nazalost, seeposts ne radi " + err.message });
  }
};
   
const profilePosts=async (req, res) =>{
  try{
    const korisnik=await User.findById(req.body.userId); //ovo se dobija kroz req.body
    const ulogovan=await User.findById(req.user.userId); //ovo se dobija kroz token
    if(korisnik==null || ulogovan==null)
    return res.status(303).json({message:'Greska u profile posts metodi'});
    const statusi=korisnik.postIDs;
     let rezultati=[];
    if(ulogovan.friends.includes(korisnik._id.toString()) || req.body.userId===req.user.userId.toString() || korisnik.tip!=='profi'){
      for(let status of statusi){
        let ubac=await Post.findById(status)
        rezultati.push({
          objava: ubac.content,
          ime: korisnik.name,
          username: korisnik.username,
          picture: ubac.picturePath,
          id: ubac._id,
          likes: ubac.likesIDS,
          user:korisnik._id,
          profilePicture:korisnik.picturePath,
          dateCreated:ubac.dateCreated

        })
      }   
    }
    else{
      for(let status of statusi){
        const nesto=await Post.findById(status);
        if(nesto.free){
        rezultati.push({
          objava: nesto.content,
          ime: korisnik.name,
          username: korisnik.username,
          picture: nesto.picturePath,
          id: nesto._id,
          likes: nesto.likesIDS,
          user:nesto.idkorisnika,
          profilePicture:korisnik.picturePath,
          dateCreated:nesto.dateCreated
        })
      }
      }}
      // console.log(rezultati);
      rezultati=rezultati.reverse()
    
      if(ulogovan.tip==="Admin")
      return res.status(200).json({rezultati:[]});

    return res.status(200).json({rezultati});
  }
  catch(error){
console.log(error);
return res.status(400).json({error:error});
  }
}

async function tradingAPI(){
  try{
    const vrati=await axios.get('https://api.polygon.io/v1/open-close/AAPL/2023-01-09?adjusted=true&apiKey=p5XHzI0pjLd4wJcc9wE5kun3RXKNJsTK');
    return vrati;
    const statusi = [
      {
        objava: String,
        ime: String,
        username: String,
        picture: String,
        id: String,
        likes: Number,
      },
    ];
    for(let status of statusi){
      statusi.push({objava:"NEWS",ime:status.T,username:status.T})
    }
    //return statusi;
    return vrati.data;
  }
  catch(error){
    throw error;
  }
}


//UPDATE
const patchLikes = async (req, res) => {
  try {
    const ulogovan = await User.findById(req.user.userId);
    const objava = await Post.findById(req.body.objava);
    const kreator = await User.findById(objava.idkorisnika);
    if (!(objava && ulogovan && kreator)) {
      return res.status(404).json({ message: 'Greska' });
    }
    let status = 
    {
      objava: objava.content,
      ime: kreator.name,
      username: kreator.username,
      picture: objava.picturePath,
      id: objava._id,
      likes: objava.likesIDS,
      user:objava.idkorisnika,
      profilePicture:kreator.picturePath,
      dateCreated:objava.dateCreated,
    };
    if (objava.likesIDS.includes(req.user.userId)) {
      objava.likesIDS = objava.likesIDS.filter(like => like.toString() !== req.user.userId);
      await objava.save();
      status=
      {
        objava: objava.content,
        ime: kreator.name,
        username: kreator.username,
        picture: objava.picturePath,
        id: objava._id,
        likes: objava.likesIDS,
        user:objava.idkorisnika,
        profilePicture:kreator.picturePath,
        dateCreated:objava.dateCreated, 
      }
      return res.status(202).json({ status,message: 'Uspesno ste uklonili lajk' });
    }
    objava.likesIDS.push(req.user.userId);
    await objava.save();
    const resp= await sendNotification(kreator._id,ulogovan._id,'Lajk')
    // console.log(resp);
    return res.status(202).json({ status,message: 'Uspesno ste lajkovali objavu' });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
     const ulogovan = await User.findById(req.user.userId);

    if (!ulogovan) {
      return res.status(403).json({ error: 'No permission' });
    }
 
    const post = await Post.findById(req.body.postId);
    if(ulogovan.tip==='Admin'){
      if(post.marked===true){
        const kreator=await User.findById(post.idkorisnika);
        if(kreator==null)
        return res.status(404).json({ error: 'error' });

        kreator.postIDs = kreator.postIDs.filter(post => post._id.toString() !== req.body.postId);
        await kreator.save();
        await Post.deleteOne({ _id: post._id });
        await sendNotification(kreator._id,ulogovan._id,"Delete");
        return res.status(202).json({  message: 'Objava uspesno izbrisana' });

      }
      else{
        return res
        .status(404)
        .json({ error: 'error' });
      }
    }
    if (!post || post.idkorisnika != req.user.userId) {
      return res
        .status(404)
        .json({ error: 'Objava nije pronadjena ili nije napisana od strane ulogovanog user-a' });
    }

    ulogovan.postIDs = ulogovan.postIDs.filter(post => post._id.toString() !== req.body.postId);
    
    await ulogovan.save();

    await Post.deleteOne({ _id: post._id });

    return res.json({ message: 'Objava uspesno izbrisana' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Greska: ' + err });
  }
};

 const prijaviObjavu = async(req,res) => {
try{
  const ulogovan=await User.findById(req.user.userId);
  const objava=await Post.findById(req.body.postId);
  const kreator=await User.findById(objava.idkorisnika);
  if(!ulogovan && !objava && !kreator) 
  return res.status(202).json({message:'User ili Post ne postoji'});
 
  if(kreator.tip==="profi" && objava.free===false && !ulogovan.friends.includes(objava.idkorisnika))
  return res.status(202).json({message:'Nije moguca prijava'})

  objava.marked=true;
  const report = new Report(req.body.reportMsg, Date.now(), req.user.userId);
  objava.reports.push({report});
  
  await objava.save();
  await sendNotification(objava.idkorisnika,ulogovan._id,'Report')

  return res.status(202).json({message:'Hvala Vam sto ste prijavili objavu'});

}
catch(error){
return res.status(404).json({message:error});
}

 }

 const zadrziObjavu = async (req,res) => {
 try{
 const admin=await User.findById(req.user.userId);
 if(!admin && admin.tip!='Admin'){
 return res.status(303).json({message:'Nemate dozvolu da izbrišete objavu'})
 }
 
 const objava=await Post.findById(req.body.postId);
 if(!objava || !objava.marked){
 return res.status(303).json({message:'Greška, status ne postoji ili nije reportovan'});
 }
 
 objava.marked=false;
 objava.reports=[];

 await objava.save();
 await sendNotification(objava.idkorisnika,admin._id,"Vrati");
 return res.status(202).json({message:'Objava odradjena'});
}
catch(error){
  console.log(error);
  return res.status(404).json({error:error});
}
 }

 const seeAdminPosts = async(req,res) => { 
  try {
    const Admin=await User.findById(req.user.userId);

    if(!Admin)
    return res.status(404).json({message:"Greska"})

    const objave=await Post.find({marked:true});
    let vrati = [];
    let messages=[];
    for(let objava of objave){
      let poruke=objava.reports;
      messages=[]
      for(let poruka of poruke){
      messages.push(poruka.report.reason);

      }
      vrati.push({
        objava: objava.content,
        picture: objava.picturePath,
        id: objava._id,
        dateCreated:objava.dateCreated,
        reports:messages
        //reports:messages.length > 1 ? messages : messages[0] 
      })
    }
    // console.log(vrati);
    return res.status(200).json({statusi:vrati});
  }
  catch(error){
     
  }
 }


  module.exports={
    createPost:createPost,
    patchLikes:patchLikes,
    seePosts:seePosts,
    profilePosts:profilePosts,
    sendwhatsappmess:sendwhatsappmess,
    tradingAPI:tradingAPI,
    deletePost:deletePost,
    prijaviObjavu:prijaviObjavu,
    zadrziObjavu:zadrziObjavu,
    seeAdminPosts:seeAdminPosts,
    changePost:changePost
  }