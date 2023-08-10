const express = require("express");
const User=require("../models/user.js");
const {getFeedPosts,getUserPosts,createPost,changePost,seePosts,profilePosts,deletePost,zadrziObjavu,patchLikes,prijaviObjavu,seeAdminPosts} = require("../controllers/posts.js");
const {verifyToken,authenticateToken}=require("../middleware/auth.js");
const multer=require('multer');
const router=express.Router();
//FILE STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, "public/assets"); //Ja nemam ovu putanju jos 
    },
    filename: function (req, file, cb) {
    cb(null, file.originalname);
    }
    });
const upload = multer({storage});
//FILE STORAGE
//READ
router.get("/",verifyToken);
router.get("/:userId/posts",verifyToken);


  router.get("/seePosts", authenticateToken, async (req, res, next) => {
    const korisnik = await User.findById(req.user.userId);
    
    if (korisnik === null || korisnik === undefined) {
      return res.json([]); // Vraća prazan niz kao odgovor
    }
    
    let tip = korisnik.tip;
    
    if (tip === "Admin" || tip === "admin") {
      seeAdminPosts(req, res);
    } else {
      seePosts(req, res);
    }
  });
  

router.post("/profilePosts",authenticateToken,profilePosts);
router.post("/zadrziObjavu",authenticateToken,zadrziObjavu);

//UPDATE
router.patch("/likePost", authenticateToken, patchLikes);


//CREATE
router.post("/createPost",authenticateToken, upload.single('picture'),createPost);

router.post("/changePost",authenticateToken, upload.single('picture'),changePost);


router.post("/prijaviObjavu",authenticateToken, prijaviObjavu);

router.delete("/deletePost", authenticateToken, deletePost);



module.exports = router;