const axios=require('axios');
// const whatsAppClient = require("@green-api/whatsapp-api-client");
const wbm = require('wbm');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const User = require('../models/user.js');
const verificationCodeSchema=require('../models/hash.js');

async function generateVerificationCode(userId) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codeLength = 8;
  let code = '';

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  const encodedUserId = Buffer.from(userId).toString('base64');
  code += encodedUserId;

  const verificationCode = new verificationCodeSchema({
  code:code,
  userId:userId
  })
  await verificationCode.save();
  return code;
}


 const decodeVerificationCode = async (req,res,next) => {
  try{

  const kod=await verificationCodeSchema.findOne({code:req.body.kod});
  if(!kod)
  return res.status(303).json({message:'Greska'});
  
  const korisnik = await User.findOne({
    $or: [
      { username: req.body.korisnik }, 
      { email: req.body.korisnik } 
    ]
  });
  
  if(!korisnik){
  return res.status(404).json({message:'Greska'});
  }
  if(korisnik._id.toString()!==kod.userId.toString()){
  return res.status(405).json({message:'Greska'});
  }
  next();
}
catch(error){
  console.error('Greška prilikom dekodiranja verifikacionog koda:', error);
  return res.status(404).json({error:error})
}
}


function getRandomNumber() {
    return Math.floor(Math.random() * 100000) + 1;
  }

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async function getStockData() {
    return new Promise(async (resolve, reject) => {
    try {
      const apiUrl = 'https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/';
      const apiKey = process.env.API_STOCK;
      
      //const currentDate = new Date();
      //currentDate.setDate(currentDate.getDate() - 38);
      //const formattedDate = formatDate(currentDate);

       const fiksni = new Date('2023-05-05'); 
       const formatirani = formatDate(fiksni);
      const url = `${apiUrl}${formatirani}?adjusted=true&apiKey=${apiKey}`;

      //const url = `${apiUrl}${formattedDate}?adjusted=true&apiKey=${apiKey}`;
      const response = await axios.get(url);
      const data = response.data;
      const results = data.results.slice(0, 20);
      const statusi=[]
      for (let rezultat of results) {
        statusi.push({
          objava: `Today's high is ${rezultat.h}$, while Today's low is ${rezultat.l}$. The trading volume is ${rezultat.v}, and the number of transactions is ${rezultat.n}`,
          ime: rezultat.T,
          username: rezultat.T,
          picture: "",
          id: getRandomNumber(),
          likes: [],
          user: getRandomNumber(),
          profilePicture:"",
          dateCreated:new Date().getDate()
        });
      }
      resolve(statusi)
    }
     catch (error) {
      reject(error)
      //console.error('Greška prilikom poziva API-ja, mozda morate sacekati jos minut da bi API ponovo bio dostupan: ', error.message);
    }
  })
}

async function convertCurrency(amount, from, to) {
  const options = {
    method: 'GET',
    url: 'https://currency-converter-exchange-rates1.p.rapidapi.com/convert',
    params: {
      amount: amount,
      from: from,
      to: to
    },
    headers: {
      'X-RapidAPI-Key': 'af7aca0d8cmsh3cece44dbfba574p18e3efjsna024a27de9db',
      'X-RapidAPI-Host': 'currency-converter-exchange-rates1.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
async function sendEmail(to,tema,info){
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 465, 
      secure: true, 
      auth: {
        user: "ficadojc24@gmail.com", 
        pass: process.env.APP_PASSWORD, 
      },
    });
    const korisnik = await User.findOne({
      $or: [
        { username: to }, 
        { email: to } 
      ]
    });

     if(!korisnik)
     return res.status(303).json({message:'Neispravni podaci'});

    let username=korisnik.username;
    let subject;let html;
    switch(tema){
      case "sifra" :
     let kod=await generateVerificationCode(korisnik._id)
     subject="Zaboravljena sifra"
     html = `
    <p>Poštovani, ${username}</p>
    <p>Zaboravili ste lozinku? Ukoliko jeste, molimo Vas da u polje za potvrdu zahteva unesete sledeći kod:</p>
    <p><b>${kod}</b></p>
    Takodje, molimo Vas da imate na umu da će ovaj kod važiti samo narednih 2h.
    <div style="text-align: right;">
      <p>Vaš<b><span style="color: blue;"></span> <span style="color: blue; font-weight: bold;">TradeTime</span></b></p>
    </div>
    `; break;

    case "isticanje" :
    subject="Vaša subskripcija uskoro ističe"
    html = `
   <p>Poštovani, ${username}</p>
   <p>Podsećamo Vas da vaša subskripcija na profil profesionalnog trejdera ${info} ističe sutra</p>
     <p>Vaš<b><span style="color: blue;"></span> <span style="color: blue; font-weight: bold;">TradeTime</span></b></p>
   </div>
   `; break;

     case "isteklo" :  subject="Zaboravljena sifra"
     html = `
    <p>Poštovani, ${username}</p>
    <p>Vaša subskripcija na profil profesionalnog trejdera je istekla danas.</p>
      <p>Vaš<b><span style="color: blue;"></span> <span style="color: blue; font-weight: bold;">TradeTime</span></b></p>
    </div>
    `; break;

    case "reklama" :   subject="Reklamiranje profila"
     html = `
    <p>Poštovani, ${username}</p>
    <p>Vaša reklama na našoj platformi je uspešno postavljena.</p>
      <p>Vaš<b><span style="color: blue;"></span> <span style="color: blue; font-weight: bold;">TradeTime</span></b></p>
    </div>
    `; break;
    }
    
    let info = await transporter.sendMail({
      from: '"You" <ficadojc24@gmail.com>',
      to: korisnik.email,
      subject: subject,
      html: html,
    });
  
    //console.log(info.messageId); 
  } catch (error) {
    console.log("Error sending email:", error);
  }
}
module.exports ={
    formatDate:formatDate,
    getStockData:getStockData,
    convertCurrency:convertCurrency,
    sendEmail:sendEmail,
    decodeVerificationCode:decodeVerificationCode
}  