const User = require('../models/user.js');
const Post = require('../models/post.js');
const Comment = require('../models/comment.js');
const mongoose = require('mongoose');
const Sib = require('sib-api-v3-sdk')
require('dotenv').config()
const SibApiV3Sdk = require('sib-api-v3-sdk');
const bcrypt=require('bcrypt');
const posts = require('./posts.js');
const { passwordStrength } = require('check-password-strength')
const {sendEmail}=require('./Konfiguracije.js');
const {sendNotification}=require('../Notification.js');
const path=require("path");
const bodyParser=require("body-parser");

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/* READ */
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const korisnik = await User.findById(userId);
    if(!korisnik)
    return res.status(404).json({message:"Korisnik ne postoji"});
    let ratinzi=[]
    if(korisnik.rating!=undefined){
    for(let a of korisnik.rating)
    ratinzi.push(a.number)
    }
    const user = {
      name: korisnik.name,
      username: korisnik.username,
      tip: korisnik.tip,
      age: korisnik.age,
      friendsNumber:korisnik.friends.length,
      id:korisnik._id,
      profilePicture:korisnik.picturePath,
      ratinzi:ratinzi,
      socials:korisnik.socials
    };
    
    res.status(200).json({user});
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


 const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */


 const dodajPrijatelja = async (req,res)=>{
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    try{
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronadjen' });
    }
    if (!friend) {
      return res.status(404).json({ message: 'Prijatelj nije pronadjen' });
    }
   
    user.friends.forEach(prijateljid => {
        if(prijateljid==friendId)
        user.friends = user.friends.filter(izbaci => izbaci.id !== friendId);
        // return res.status(202).json({ message: 'Ovi korisnici su vec prijatelji' });
    });
    user.friends.push(friend._id);
    await user.save();
    res.json(user);
  
   
    }
    catch(err){
       res.json(err.message);
    }

}
const pretrazi = async(req,res)=>{
try{
  const {q}=req.query;
  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { username: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ],
  });
  if (!q || q.trim().length === 0) {
    res.json([]);
  } else {
    res.json(users.splice(0, 10));
  }
}
catch(error){
  return res.json({message:error});
}
}
const register= async(req,res)=>{
    // if(password!=confirmPassword){
    //     return res.status(301).json({
   //  user:null,
   //token:null,
   //message:'Passwordi se ne poklapaju'
   //
    //  });
   
    // }
    if(passwordStrength(req.body.password).value=="Too weak"){
      return res.status(202).json({message:'Password je previše slab'})
    }
    const postojeciemail = await User.findOne({ email: req.body.email });

    if (postojeciemail) {
      return res.status(400).json({   
        user:null,
         token:null,
        message:'Uneti email je zauzet'
         }); 
           }

    if(await User.findOne({username: req.body.username})){  
    return res.status(409).json({   
   user:null,
    token:null,
   message:'Uneti username je zauzet'
    });
    }

    const salt=await bcrypt.genSalt();
    const hashedPassword=await bcrypt.hash(req.body.password,salt);
    const email=req.body.email;
    if(!isValidEmail(email)) 
    {
    return res.status(400).json({ 
    user:null,
    token:null, 
    message:'Uneti email nije ispravan'  
    });
    } 
    let fotografija="";
   if(req.file!=null){ 
   fotografija = req.file.path; 
    }
    const user = new User;
    
    user.name=req.body.firstName,
    user.username=req.body.username,  
    user.age=req.body.age,   
    user.email=req.body.email,   
    user.password=hashedPassword,   
    user.picturePath=fotografija,   
    user.tip=req.body.typeTrader
   

    await user.save();

    res.status(200).json({  
    user:user,
    token:null, 
    message:'Success' 
    });
   };

   const Subscribe = async (req, res) => {
    try{
      const prvi=await User.findById(req.user.userId);//ulogovan
      const drugi=await User.findById(req.body.friendId);
      if(prvi.tip=='Admin' || drugi.tip=='Admin')
      return res.status(400).json({message:'Subscribe nije moguc'});
      
      if(!(prvi && drugi) || prvi.tip=='profi' || drugi.tip=='begginer'){
        return res.status(400).json({message:'Greska'});
      }
      const friendIdString = req.body.friendId.toString();
    
      if (prvi.friends.includes(friendIdString)) {
        prvi.friends = prvi.friends.filter(friend => friend.toString() !== friendIdString);
        await prvi.save();
        return res.status(200).json({
           message: "Uklonili ste korisnika iz liste praćenja",
           });
      }
      prvi.friends.push(drugi._id);

      await prvi.save();
      await sendNotification(drugi._id,prvi._id,'Subscribe');

      return res.status(200).json({message:"Uspešno ste zapratili korisnika " + drugi.username});
    }
    catch(error){
  return res.status(404).json({err:error.message});
    }
    }


    const isFriend = async (req, res) => {
      try {
        const ulogovan = await User.findById(req.user.userId);
        const korisnik = await User.findById(req.body.userId);
         
        if(!(ulogovan && korisnik)){
          return res.status(400).json({message:'Greska'});
        }
        if(ulogovan.username!=korisnik.username){
            korisnik.viewedProfile++;
            await korisnik.save();
        }
        if (ulogovan.friends.includes(req.body.userId)) {
          return res.status(200).json({ message:"true"});
        } else {
          return res.status(200).json({ message:"false"});
        }
      } catch (error) {
        return Promise.reject({ message: 'Greska' });
      }
    };
    

  const deleteAccount = async (req,res)=>{
    try{
      const ajdi=req.user.userId;//pametnije je da authenticateToken prosledjuje user-a ili null
      const user=await User.findById(ajdi);
      if(!user)
      return res.status(202).json({message:'nemoguce brisanje'});

      const email=req.body.email;
      const confirmPassword=req.body.password;

      console.log(req.body.email);

      if(user.tip==='Admin'){
        var zaBrisanje=await User.findById(req.body.userId)
        console.log(zaBrisanje);
        if(!zaBrisanje)
        return res.status(303).json({message:'Korisnik ne postoji'})
      }
      else {
         var zaBrisanje=user;
      }
      
      const passwordMatch = await bcrypt.compare(confirmPassword, user.password);
      const emailEqual= email.localeCompare(user.email);
      if (!passwordMatch || emailEqual!==0) {
        console.log("Niste uneli ispravnu lozinku");
        return res.status(404).json({ message: "Niste uneli ispravne podatke" });
      }

     //Brisu se statusi korisnika
     let nizStatusa=zaBrisanje.postIDs;
     for(let status of nizStatusa){
      const brisistatus=await Post.deleteOne({ _id: status._id });  
     }

      //Brisu se svi komentari
      let nizKomentara=await Comment.find({ idkorisnika: zaBrisanje._id });
      for(let komentar of nizKomentara){
        await Comment.deleteOne({ _id: komentar._id });  
       }

      // Pronalazak svih prijatelja korisnika
    const friends = await User.find({ _id: { $in: zaBrisanje.friends } });
   
    for (const friend of friends) {
      await User.updateMany(
        { _id: friend._id },
        { $pull: { friends: zaBrisanje._id } }
      );
    }
       //Na kraju se brise i sam korisnik
        const result = await User.deleteOne({ _id: zaBrisanje._id });
      return res.status(202).json({message:'Account je uspešno izbrisan'});
    }
    catch(error){
      return res.status(404).json({message:error});
    }
  }
   
  const recommended = async (req, res) => {
    try {
      const ulogovan=req.user.userId; ///token
      //const ulogovan=req.body.userId; //token

      const ulogovanKorisnik=await User.findById(req.user.userId);
      const profilKorisnika = await User.findById(req.body.id);

      if (!ulogovanKorisnik || !profilKorisnika) {
        return res.status(404).json({ message: 'Korisnik nije pronađen' });
      }

      let prijatelji=[];

      for(let a of profilKorisnika.friends){

        const covek=await User.findById(a.toString());

        prijatelji.push({
          id: covek._id,
          username: covek.username,
          name: covek.name,
          tip:covek.tip,
          picture:covek.picturePath
        })
      }

      if(req.user.userId===req.body.id){
        return res.status(202).json({prijatelji});
      }

      let prosledjeniId=ulogovanKorisnik._id.toString();
      const filtriraniPrijatelji = prijatelji.filter((prijatelj) => prijatelj.id !== prosledjeniId);
      //filtriraniPrijatelji.push(...prijatelji);
      let brojprijatelja=prijatelji.length;
      let randomFriends=[];
      if (brojprijatelja >= 3) {
        randomFriends = await getRandomElements(filtriraniPrijatelji, 3);
        return res.status(202).json({ prijatelji:randomFriends });
      } else {
        return res.status(202).json({prijatelji:filtriraniPrijatelji });
      }

    } catch (error) {
      return res.status(500).json({ message: 'Greška prilikom dohvatanja preporučenih prijatelja' });
    }
  };

  const changePassword=async(req,res)=>{
  try{
    const korisnik = await User.findOne({
      $or: [
        { username: req.body.korisnik }, 
        { email: req.body.korisnik } 
      ]
    });

    const password=req.body.password;
    if(passwordStrength(password).value=="Too weak"){
      return res.status(202).json({message:'Password je previše slab'})
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    korisnik.password=passwordHash;
    await korisnik.save();
    return res.status(202).json({message:'Uspešno ste promenili password'})
  }
  catch(error){
   return res.status(404).json({error:error})
  }
  }


  const patchFriends = async(req,res)=>{
    try{
       const ulogovan=await User.findById(req.user.userId);
       const korisnik=await User.findById(req.body.userId);
      if(ulogovan==null || korisnik==null)
      return res.json(303).json({message:"Greska u metodi patchFriends"});
      const prijatelji=[];
      const prijatelj={
        id:String,
        picture:String,
        name:String,
        username:String
      };
      const filteredFriends = korisnik.friends.filter((friend) => friend.id !== req.user.userId);
      let friends;

      if (korisnik._id.toString() === ulogovan._id.toString()) {
        friends = filteredFriends;
      } else {
        friends = filteredFriends.slice(0, 3);
      }

      //const friends=korisnik.friends.slice(0,korisnik.length>=3 ? 3 :korisnik.length);
      for(let friend of friends){
         const covek=await User.findById(friend)
         prijatelji.push({
          id:friend,
          picture:covek.picturePath,
          name:covek.name,
          username:covek.username
          })
      }
      return res.status(202).json({prijatelji})
    } 
    catch(error){
    return res.status(404).json({message: "patchFriends error" + error});
    }
  }

  const getNotifications = async(req,res) => {
      try{
      const ulogovan=await User.findById(req.user.userId);
      
      if(!ulogovan)
      return res.status(202).json({message:'No permission'})

      // let notifikacije={
      //   poruka:String,
      //   slika:String,
      //   tip:String
      // };
      let notifikacije=[];

      for(let a of ulogovan.notifications)
      {
        const kreator=await User.findById(a.actionBy.toString());
  
        notifikacije.push({
        poruka:a.message,
        tip:a.actionType,
        slika:(kreator!=null && a.actionType!='Report') ? kreator.picturePath : "",
        id:a._id
        })

        a.seen=true;
      }

      await ulogovan.save();

      notifikacije = notifikacije.reverse();
      return res.status(202).json({notifikacije});      
      }
      catch(error)
      {
        return res.status(404).json({error:error});
      }
  }
  
  // Pomocna funkcija za dobijanje nasumicnih prijatelja iz niza prijatelja
  async function getRandomElements(arr, count) {
    const shuffled = arr.sort(() => 0.5 - Math.random());

    const selected = shuffled.slice(0, count);

    let niz = [];

    for (let element of selected) {
      niz.push(element);
    }

    return niz;
  }

  const dodajNalog = async(req,res)=>{
    try{
     const korisnik=await User.findById(req.user.userId)

     if(!korisnik)
     return res.status(303).json({message:'Greska'})
     if(korisnik.tip!='profi')
     return res.status(303).json({message:'Greska'})

     const ruta = req.path;

     if(ruta==='/dodajNalog-linkedin'){
     const linkedInProfileRegex = /^https:\/\/www\.linkedin\.com\/.*$/;
     if (!linkedInProfileRegex.test(req.body.socials)) {
      return res.status(400).json({ message: 'Neispravna putanja do LinkedIn profila' });
    }
     korisnik.socials.linkedin=req.body.socials;
     await korisnik.save();
     return res.status(202).json({message:'Uspešno ste dodali Linkedin nalog'})
    }

     if(ruta==='/dodajNalog-instagram'){
      const instagramProfileRegex = /^https:\/\/www\.instagram\.com\/.*$/;
      if (!instagramProfileRegex.test(req.body.socials)) {
        return res.status(400).json({ message: 'Neispravna putanja do Instagram profila' });
      }

     korisnik.socials.instagram=req.body.socials;
     await korisnik.save();
     return res.status(202).json({message:'Uspešno ste dodali Instagram nalog'})
     }
     return res.status(404).json({message:'Greska'})
    }
    catch(error){
      return res.status(404).json({error:error})
    }
  }

  const oceniTrejdera = async(req,res) => {
    try{
      const korisnik=await User.findById(req.user.userId); //ulogovan
      //const korisnik=await User.findById(req.body.userId); 
      const trejder=await User.findById(req.body.trejder);
      
      if(!korisnik || !trejder || trejder.tip!='profi' || korisnik.tip==='profi' ||  korisnik.tip==='admin')
      return res.status(303).json({message:'Greska'})

      if(!korisnik.friends.includes(trejder._id.toString()))
      return res.status(303).json({message:'Greska, niste prijatelji'})

      const ocene=trejder.rating;

      for(let objekat of ocene){
        if(objekat.id.toString()===korisnik.id.toString()){
          objekat.number=req.body.ocena;
          await trejder.save();
          return res.status(303).json({message:'Upravo ste updateovali ocenu za korisnika ' + trejder.username})
        }
        
      }
      trejder.rating.push({
        id:korisnik._id,
        number:req.body.ocena
      })

      await trejder.save();
      return res.status(202).json({message:'Uspešno ste dodali ocenu za trejdera ' + trejder.username})
    }
    catch(error)
    {
      return res.status(404).json({error:error})
    }
  }


  const cleanupFriends = async () => {
    const users = await User.find({});
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    for (const user of users) {
      const expiringFriends = user.friends.filter(
        (friend) => friend.friendshipDate > oneMonthAgo && friend.friendshipDate < tomorrow
      );
  
      // sendNotification za korisnike cijim prijateljstvima ističe rok sutra
      for (const friend of expiringFriends) {
        await sendNotification(user._id, friend.user, 'Isticanje prijateljstva');
      }
  
      const updatedFriends = user.friends.filter(
        (friend) => friend.friendshipDate > oneMonthAgo
      );
  
      user.friends = updatedFriends;
      await user.save();
    }
  };
  //setInterval(cleanupFriends, 24 * 60 * 60 * 1000); 

  const reklamiraj = async (req,res) => {
    try{
      const ulogovan=await User.findById(req.user.userId);
      let tipReklame=req.body.tip;
      let trajanje=req.body.trajanje;
      let slogan=req.body.slogan;

      if (isNaN(trajanje)) {
        return res.status(303).json({ message: 'Trajanje reklame mora biti broj' });
      }
 
      if(!ulogovan || ulogovan.tip!="profi")
      return res.status(303).json({message:'Greska'})

      if (ulogovan.reklama && ulogovan.reklama.postoji)
      return res.status(303).json({ message: 'Nažalost, nije moguće postaviti novu reklamu dok Vam ne istekne postojeća reklama' });

      if((tipReklame!='Mala' && tipReklame!='Velika'))
        return res.status(303).json({message:'Reklama mora biti malog ili velikog tipa'})

        ulogovan.reklama = {
          postoji: true,
          tipReklame: tipReklame,
          vremeNastanka: new Date(),
          slogan:slogan
        };

      await ulogovan.save();
      await sendEmail(ulogovan.username,"reklama",null);
      res.status(202).json({message:'Uspešno ste kreirali reklamu'}) 
    }
    catch(error){
      console.log(error);
     res.status(404).json({error:error})
    }
  }
  
  const reklama = async (req, res) => {
    try {
      const ulogovan = await User.findById(req.user.userId);

      if (!ulogovan || ulogovan.tip === "Admin" )
        res.status(303).json({ message: "Greska" });
  
      const reklamiraniKorisnici = await User.find({
        tip: "profi",
        "reklama.postoji": true,
      });
  
      const reklamiraniKorisniciVelika = reklamiraniKorisnici.filter(
        (korisnik) => korisnik.reklama.tipReklame === "Velika"
      );
      const reklamiraniKorisniciMala = reklamiraniKorisnici.filter(
        (korisnik) => korisnik.reklama.tipReklame === "Mala"
      );
  
      const sansaVelika = reklamiraniKorisniciVelika.length *2
      const sansaMala =reklamiraniKorisniciMala.length;
  
      const slucajniBroj = Math.random() * ((sansaVelika+sansaMala));

      let nasumicniKorisnik;
      if (slucajniBroj > sansaMala) {
        nasumicniKorisnik =
          reklamiraniKorisniciVelika[
            Math.floor(Math.random() * reklamiraniKorisniciVelika.length)
          ];
      } else {
        nasumicniKorisnik =
          reklamiraniKorisniciMala[
            Math.floor(Math.random() * reklamiraniKorisniciMala.length)
          ];
      }
      if(nasumicniKorisnik==null || nasumicniKorisnik==undefined)
      return res.status(202).json({ reklama: [] });

      const reklamaPodaci = {
        id: nasumicniKorisnik._id,
        picture: nasumicniKorisnik.picturePath,
        name: nasumicniKorisnik.name,
        username: nasumicniKorisnik.username,
        slogan:nasumicniKorisnik.reklama.slogan!=undefined ? nasumicniKorisnik.reklama.slogan : "Profesionalni trejder naše TradeTime platforme!"
      };  
      return res.status(202).json({ reklama: reklamaPodaci });
    } catch (error) {
      console.log(error);
      res.status(404).json({ error });
    }
  };
    
  const popular = async (req, res) => {
    try {
      const ulogovan = await User.findById(req.user.userId);
      //const ulogovan = await User.findById(req.body.userId);
  
      if (!ulogovan)
        return res.status(303).json({ message: "Greška" });
  
      const profiTrejderi = await User.find({ tip: "profi" });

      profiTrejderi.sort((a, b) => {
        if (a.rating.number !== b.rating.number) {
          // Sortiranje po ratingu, od najveceg ka najmanjem
          return b.rating.number - a.rating.number;
        } else {
          // Ako su rejtinzi jednaki, sortiranje po viewNumberu, od najveceg ka najmanjem
          return b.viewNumber - a.viewNumber;
        }
      });
  
      //Fisher-Yates algoritma
      for (let i = profiTrejderi.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [profiTrejderi[i], profiTrejderi[j]] = [profiTrejderi[j], profiTrejderi[i]];
      }
  
      const najpopularniji = profiTrejderi.slice(0, 5).map(user => ({
        id: user._id,
        name: user.name,
        username: user.username,
        picture: user.picturePath
      }));
      
      res.status(200).json({ najpopularniji });
    } catch (error) {
      console.log(error);
      res.status(404).json({ error });
    }
  };
  
  const sacuvajPromene = async (req, res) => {
    try {
      const ulogovan = await User.findById(req.user.userId);
      // const ulogovan = await User.findById(req.body.userId);
  
      if (!ulogovan)
        return res.status(303).json({ message: "Korisnik ne postoji" });
  
      const ime = req.body.firstName;
      const godine = req.body.age;
      const korisnickoIme = req.body.username;
      const staraLozinka = req.body.oldPassword;
      const novaLozinka = req.body.newPassword;
      let poruka = "Izmenili ste ";
  
      if (korisnickoIme !== undefined && korisnickoIme !== "" && korisnickoIme !== " " && korisnickoIme!=ulogovan.username) {
        const same = await User.findOne({ username: korisnickoIme });
        if (same && same._id.toString() !== ulogovan._id.toString()) {
          return res.status(404).json({ message: "Korisničko ime je zauzeto" });
        }
        ulogovan.username = korisnickoIme;
        poruka += " korisničko Ime ";
      }
  
      if (staraLozinka !== undefined && staraLozinka !== "" && novaLozinka !== undefined && novaLozinka !== "") {
        const passwordMatch = await bcrypt.compare(staraLozinka, ulogovan.password);
        if (!passwordMatch) {
          console.log("Niste uneli ispravnu lozinku");
          return res.status(404).json({ message: "Niste uneli ispravnu lozinku" });
        }
  
        if (passwordStrength(novaLozinka).value === "Too weak")
          return res.status(404).json({ message: "Vaša nova lozinka je previše slaba" });
  
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(novaLozinka, salt);
        ulogovan.password = passwordHash;
        poruka += " password ";
      }
  
      if (ime !== undefined && ime !="" && ime!= ulogovan.name) {
        ulogovan.name = ime;
        poruka += " ime ";
      }
  
      if (godine !== undefined && godine !== "" && godine != ulogovan.age) {
        ulogovan.age = godine;
        poruka += " godine ";
      }
  
      let fotografija = "";
      if (req.file !== undefined && req.body.picturePath !== undefined && req.body.picturePath !== "" && req.body.picturePath !== null ) {
        fotografija = req.file.path;
        ulogovan.picturePath = fotografija;
        poruka += " profilnu sliku ";
      }
      
       if(poruka=="")
       return res.status(403).json({ message: "Vaši podaci nisu ažurirani"});

       let ratinzi=[]
       if(ulogovan.rating!=undefined){
       for(let a of ulogovan.rating)
       ratinzi.push(a.number)
       }

       const user = {
        name: ulogovan.name,
        username: ulogovan.username,
        tip: ulogovan.tip,
        age: ulogovan.age,
        friendsNumber: ulogovan.friends.length,
        id: ulogovan._id,
        profilePicture: ulogovan.picturePath,
        ratinzi: ratinzi,
        socials:ulogovan.socials
      };

       await ulogovan.save();
       return res.status(202).json({ message: "Uspešno ste ažurirali svoje podatke! " + poruka, user });
    } catch (error) {
      console.log(error);
      return res.status(404).json({error})
    }
  }
  
module.exports={
getUser:getUser,
getUserFriends:getUserFriends,
dodajPrijatelja:dodajPrijatelja,  
register:register,
Subscribe:Subscribe,
deleteAccount:deleteAccount,
pretrazi:pretrazi,
recommended:recommended,
patchFriends:patchFriends,
isFriend:isFriend,
getNotifications:getNotifications,
changePassword:changePassword,
dodajNalog:dodajNalog,
oceniTrejdera:oceniTrejdera,
reklamiraj:reklamiraj,
reklama:reklama,
popular:popular,
sacuvajPromene:sacuvajPromene
}