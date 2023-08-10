const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../models/user.js");
const generateToken=require("../middleware/auth.js");
const { passwordStrength } = require('check-password-strength')



/* REGISTER USER */
 const register = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation
      } = req.body;
      console.log(passwordStrength(password).value)
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  /* LOGGING IN */
  const login = async (req, res) => {
    const { username, password } = req.body;
    
    //Korisnik mozda zeli da se prijavi s username-om, a mozda zeli i s emailom
    const korisnik = await User.findOne({
      $or: [{ username: username }, { email: username }]
    });
  
    if (!korisnik) {
        return res.status(400).json({
            korisnik: null,
            token: null,
            message:'Korisnicki podaci nisu ispravni'
          });    
         }
    
    let tip=korisnik.tip;

    const passwordMatch = await bcrypt.compare(password, korisnik.password);
  
    if (!passwordMatch) {
        return res.status(400).json({
            korisnik: null,
            token: null,
            message:'Korisnicki podaci nisu ispravni'
          });    }
    const token = jwt.sign({ userId: korisnik._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
    res.setHeader('Type', korisnik.tip);

    const user={
      name:korisnik.name,
      username:korisnik.username,
      age:korisnik.age
    }
  
    return res.status(200).json({
        user,
        token
      }); 
  };
  module.exports = {
    register: register,
    login:login
  };