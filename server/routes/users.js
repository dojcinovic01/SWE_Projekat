const express = require("express");
const {getUser,getUserFriends,isFriend,register,Subscribe,deleteAccount,pretrazi,popular,recommended,patchFriends,reklamiraj,reklama, getNotifications,changePassword,dodajNalog,oceniTrejdera,sacuvajPromene} = require("../controllers/users.js");
const { verifyToken,authenticateToken } = require("../middleware/auth.js");
const {convertCurrency,sendEmail,decodeVerificationCode}=require("../controllers/Konfiguracije.js");
const {flagNotification}=require("../Notification.js");
const multer=require('multer');

const router = express.Router();
//FILE STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, "public/assets");  
    },
    filename: function (req, file, cb) {
    cb(null, file.originalname);
    }
    });
const upload = multer({storage});
//FILE STORAGE
//CREATE
router.post("/register", upload.single('picture'),register);

/* READ */
router.get("/:userId", authenticateToken, getUser);
router.get("/:userId/friends", verifyToken, getUserFriends);

/* UPDATE */

router.post("/sendEmail", async (req, res) => {
  const { username } = req.body;
  try {
    const message = await sendEmail(username, "sifra", null);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: "Slanje emaila nije uspesno" });
  }
});


router.post("/subscribe",authenticateToken,Subscribe); //da li ovde treba post?


router.post("/getNotifications",authenticateToken,getNotifications);

router.post("/reset-password",decodeVerificationCode,changePassword);

router.post("/pretrazi",pretrazi);

router.post("/convertCurrency", async (req, res) => {
    const { amount, from, to } = req.body;
  
    convertCurrency(amount, from, to)
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        res.status(500).json({ error: "Failed to convert currency" });
      });
  });

router.post("/isFriend",authenticateToken,isFriend);

router.post("/reklamiraj",authenticateToken, reklamiraj);

router.post("/recommended",authenticateToken,recommended);

router.post("/patchFriends",authenticateToken,patchFriends);

//DELETE
router.post("/deleteAccount",authenticateToken,deleteAccount);

router.post('/dodajNalog-instagram',authenticateToken,dodajNalog);

router.post('/dodajNalog-linkedin',authenticateToken,dodajNalog);

router.post('/oceniTrejdera',authenticateToken,oceniTrejdera);

router.post('/flagNotification', authenticateToken, flagNotification);

router.post('/reklama',authenticateToken, reklama);

router.post('/popular',authenticateToken, popular);

router.post('/sacuvajPromene',authenticateToken, upload.single('picture'), sacuvajPromene);

module.exports = router;
