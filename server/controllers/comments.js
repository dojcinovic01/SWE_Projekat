const User = require('../models/user.js');
const Post = require('../models/post.js');
const mongoose = require('mongoose');
const Comment=require('../models/comment.js');
const {sendNotification}=require('../Notification.js');

//CREATE
const createComment = async (req, res) => {
    try {
      const korisnik = await User.findById(req.user.userId);
      //const korisnik = await User.findById(req.body.userId);
      const content = req.body.content;
      const objavaid = await Post.findById(req.body.objavaId);
      const kreator= await User.findById(objavaid.idkorisnika);
  
      if(!korisnik)
      return res.status(200).json({ message: 'Korisnik ne postoji' });

      if(!objavaid || !kreator || (kreator.tip==='profi' && !korisnik.friends.includes(kreator._id.toString()) && korisnik.username!=kreator.username))
      return res.status(404).json({ message: 'Greska, objava' });

      const komentar = new Comment({
        idobjave: objavaid._id,
        content: content,
        idkorisnika: korisnik._id
      });

      let comment=({
        id: objavaid._id,
        username:korisnik.username,
        content: content,
        picture:korisnik.picturePath,
        kreator: korisnik._id
      });

      objavaid.commentIDS.push(komentar._id);

      await objavaid.save();
      await komentar.save();
      await sendNotification(kreator._id,korisnik._id,"Comment")

      res.status(200).json({ message: 'Uspešno ste kreirali komentar',comment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //DELETE
  const deleteComment = async (req, res) => {
    try {
      //const korisnik = await User.findById(req.user.userId);
      const ulogovan = await User.findById(req.user.userId);
      const komentar=await Comment.findById(req.body.komentarId);
      const objava=await Post.findById(komentar.idobjave);
      const kreatorObjave=await User.findById(objava.idkorisnika);
      const kreatorKomentara=await User.findById(komentar.idkorisnika);

      if(!ulogovan)
      return res.status(200).json({ message: 'Korisnik ne postoji' });

      if(!objava)
      return res.status(200).json({ message: 'Objava ne postoji' });

      if(komentar.idobjave.toString()!=objava._id.toString())
      return res.status(200).json({ message: 'Nije moguce izbrisati ovaj komentar' });
      
     if(kreatorKomentara.username===ulogovan.username || ulogovan.username===kreatorObjave.username ||  ulogovan.tip==="Admin"){
     const index = objava.commentIDS.indexOf(req.body.komentarId);
      if (index !== -1) {
      objava.commentIDS.splice(index, 1);
      }

      await objava.save();
      await Comment.findByIdAndDelete(req.body.komentarId);
     
      res.status(200).json({ message: 'Uspesno ste izbrisali komentar'});

    }
    else {
      res.status(404).json({ message: 'Nije moguce izbisati komentar'});
    }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const loadComment = async (req, res) => {
    try {
      const ulogovan = await User.findById(req.user.userId);
      const objava = await Post.findById(req.body.objava);
  
      if (!ulogovan || !objava)
        return res.status(303).json({ message: 'Korisnik ili objava ne postoje' });
  
      const kreator = await User.findById(objava.idkorisnika);
  
      if (!kreator)
        return res.status(305).json({ message: 'Nije moguce dobiti komentare' });
      if(ulogovan.tip!="Admin"){
        if (kreator.tip == 'profi' && !ulogovan.friends.includes(objava.idkorisnika) && ulogovan.username !== kreator.username) {
          return res.status(304).json({
            message: `Nije moguće dobiti komentare profesionalnog trejdera '${kreator.username}', jer ga vi '${ulogovan.username}' ne pratite`
          });
        }
      }
  
      let komentari = [];
  
      const objavaKomentari = await Comment.find({ idobjave: objava._id });
      for (a of objavaKomentari) {
        let n = a.idkorisnika;
        const komentator = await User.findById(n)
  
        if (komentator) {
          komentari.push({
            id: a._id,
            username: komentator.username,
            content: a.content,
            picture: komentator.picturePath,
            kreator: komentator._id,
          });
        } else {
          // komentari.push({
          //   id: a._id,
          //   username: "Izbrisan Nalog",
          //   content: a.content,
          //   picture: "",
          //   kreator: "",
          // });
        }
      }
  
      res.status(200).json({ komentari });
    } catch (error) {
      console.log(error)
      res.status(404).json({ error });
    }
  }
  

module.exports = {
    createComment:createComment,
    deleteComment:deleteComment,
    loadComment:loadComment
}