const { response } = require('express');
const express = require('express');
const db = require('../db');
const router =  express.Router();
const requireLogin = require('../middleware/requireLogin');


router.get('/me',requireLogin,(req, res) => {
  if (!req.user)
    return res.status(403).json({ errors: ["login to get the info"] });
  
  return res.status(200).json({ data: req.user });
});

router.post('/postScore',requireLogin,(request,response)=>{
  console.log(request.body.score);
  const {id} = request.user;
  const {score} = request.body;
  db.query('UPDATE players set scores = array_append(scores,$1) where id=$2',[score,id],(err,res)=>{
    console.log(res.rows)
    if(err){
      return response.status(400).json({error:"you must be logged in"})
    }
    return response.status(200).json({message:"successfully inserted scores"})
  })
})

router.get('/scorelist',requireLogin,(request,response)=>{
  console.log(request);
 const {scores} = request.user
   return response.json({score:scores});
 })
 

 router.get('/all',(request,response)=>{
  db.query('select * from players',(err,res)=>{
    if(err){
      return response.status(400).json({error:"you must be logged in"})
    }
    return response.json(res.rows);
  })
 })

router.post('/words/:type',(request,response)=>{
  const type = request.params.type;
  const {word} = request.body;
  console.log(word,type)
  db.query("insert into wordtbl(words,type) values ($1,$2)",[word,type],(err,res)=>{
    if(err){console.log(err)}
    response.json(res);
  })
})

router.get('/words',(request,response)=>{
  db.query("select * from wordtbl",(err,res)=>{
    if(err){console.log(err)}
    response.json({words:res.rows});
  })
})

module.exports=router