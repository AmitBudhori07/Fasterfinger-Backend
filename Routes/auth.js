const express = require('express');
const db = require('../db')
const router =  express.Router();
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const {JWT_SECRET} =  require('../Secrets/keys')

router.post('/signup',(request,response)=>{

    const {name,email,password} = request.body;
    console.log(request.body);
    if(!name ||!email || !password){
      return response.status(402).json({error:"please add all the fields"})
    }  
        bcrypt.hash(password,12)
         .then((hassedpassword)=>{
           db.query("insert into players(name,email,password) values ($1,$2,$3)",[name,email,hassedpassword],(err,res)=>{
             if(err || !res){
               return response.status(402).json({error:"Email already present"})
             };
            return  response.status(200).json({message:"successfully posted"})
            })
         })
         .catch(error=>{
           console.log(error)
         })
    })
   
    router.post('/signin',(request,response)=>{
      console.log(request.body)
      const {email,password} = request.body;
      if(!email || !password){
       return response.status(402).json({error:"please add all the fields"})
     }
     
     db.query('SELECT * FROM players WHERE email=$1',[email],(err,res)=>{
       if(err || (res.rows.length === 0)){
         return response.status(402).json({error:"Invalid Username or Password"})
       }

       bcrypt.compare(password,res.rows[0].password)
        .then((domatch)=>{
          if(domatch){
             const token = jwt.sign({_id:res.rows[0].id},JWT_SECRET);
            return response.status(200).json({token})       
          }
          else{
           return response.status(402).json({error:"Invalid Username or Password"})
          }
        })
        .catch(err=>{
          console.log(err);
        })
     })
    })

    module.exports=router