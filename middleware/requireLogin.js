const jwt =  require('jsonwebtoken');
const {JWT_SECRET} =  require('../Secrets/keys');
const db = require('../db')

module.exports=(request,response,next)=>{
 const {authorization} = request.headers;
 
 if(!authorization){
     return response.status(403).json({error:"you must be logged in"})
 }

 const token = authorization.replace("Bearer ","");
 jwt.verify(token,JWT_SECRET,(error,payload)=>{
     if(error){
         return response.status(403).json({error:"you must be logged in"})
     }

     const {_id} = payload;
     db.query('SELECT * FROM players WHERE id=$1',[_id],(err,res)=>{
        if(err){
            return response.status(403).json({error:"you must be logged in"})
        }
         request.user = res.rows[0];
         next();
     })
 })
}