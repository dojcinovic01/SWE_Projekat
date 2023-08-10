const express=require("express");
const {login} = require("../controllers/auth.js");
const {generateToken}=require("../controllers/auth.js");

const router = express.Router();

router.post("/login", login);

module.exports = router;