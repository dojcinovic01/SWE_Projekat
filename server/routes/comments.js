const express = require("express");
const router=express.Router()
const {createComment,deleteComment,loadComment}=require("../controllers/comments.js")
const {authenticateToken}=require("../middleware/auth.js")

router.post("/createComment",authenticateToken,createComment);

router.post("/deleteComment",authenticateToken,deleteComment);

router.post("/loadComment",authenticateToken,loadComment);

module.exports = router;