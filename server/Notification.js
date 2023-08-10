const User = require('./models/user.js');
const mongoose = require('mongoose');

class Notification {
    constructor( recipient,actionBy, actionType, createdAt,message) {
      this.actionBy = actionBy;
      this.recipient = recipient;
      this.actionType = actionType;
      this.createdAt = createdAt || new Date();
      this.message=message;
      this.seen=false;
    }
}

async function sendNotification(primalacid, kreatorid, tip){
  try{
   let primalac=await User.findById(primalacid);
   let kreator=await User.findById(kreatorid);
  
   if(!primalac || !kreator || primalacid.toString()===kreatorid.toString())
   return;
   
   let poruka;
   switch(tip){
    case 'Lajk': poruka='User ' + kreator.username + ' je lajkovao vašu objavu'; break;
    case 'Report':poruka='Vaša objava je prijavljena administratorima'; break;
    case 'Subscribe':poruka='Korisnik ' + kreator.username + ' vas je upravo zapratio'; break;
    case 'Comment':poruka='Korisnik ' + kreator.username + ' je upravo komentarisao vašu objavu'; break;
    case 'Delete':poruka='Vaša objava je izbrisana od strane administratora'; break;
    case 'Vrati':poruka='Vaša objava je sačuvana od strane administratora'; break;
    //default:break;
   }

   let notifikacija=new Notification(primalacid,kreatorid,tip,Date.now(),poruka);
   primalac.notifications.push(notifikacija);

   await primalac.save();
  }
  catch(error){
   console.log(error);
   return res.status(405).json({error})
  }
}

const flagNotification = async(req, res)=>{
  const ulogovan=await User.findById(req.user.userId);
  
  if(!ulogovan)
  return res.status(404).json({message:'Token nije validan'});

  const notifikacije=ulogovan.notifications;
  for(let notifikacija of notifikacije){
    if(!notifikacija.seen){
      return res.status(202).json({message:"true"});
    }
  }
  return res.status(202).json({message:"false"});
}


module.exports = {
  sendNotification:sendNotification,
  flagNotification:flagNotification
}