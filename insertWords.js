const fs = require('fs');
const http = require('http');
const words = require('./data/dictionary.json')
const { Readable } = require('stream');
var stream = require('stream')
var liner = new stream.Transform( { objectMode: true } )

/* const Stream = require('stream')
const readable = new Stream.Readable()
readable.push(null); */

const readable = Readable.from(words);
liner._transform = function (chunk, encoding, done) {
  var data = chunk;
  let type ="";
   console.log(typeof chunk);
  if(data.length<=4){
   type = "easy"
  }
  else if(data.length<=8){
      type = "medium"
  }
  else{
      type = "hard"
  }
  return new Promise((resolve,reject)=>{
    var option ={
      host:'localhost',
      port: '5000',
      path: '/api/words/'+type,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    }
    }
    
   var postserver = http.request(option, (res)=>{
    res.setEncoding('utf8');
    res.on('data', function (chunks) {
       console.log(chunks);
        resolve(done());
    });
    res.on('error',(err)=>{
      console.log(err); 
     reject(err)
    })
    })
    postserver.write(JSON.stringify({"word":data}));
    postserver.end();
  })
}

readable.pipe(liner)


liner._flush = function (done) {
  if (this._lastLineData) this.push(this._lastLineData)
  this._lastLineData = null
  done()
}

/* liner.on('readable', function () {
  var line
  while (null !== (line = liner.read())) {
    let type ="";
    if(line.length<=4){
     type = "easy"
    }
    else if(line.length<=8){
        type = "medium"
    }
    else{
        type = "hard"
    }
    console.log(line)
  return  new Promise((resolve,reject)=>{
      var option ={
        host:'localhost',
        port: '5000',
        path: '/api/words/'+type,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      }
      }
      
     var postserver = http.request(option, (res)=>{
      res.setEncoding('utf8');
      res.on('data', function (chunks) {
         console.log(chunks);
          resolve(chunks);
      });
      res.on('error',(err)=>{
        console.log(err); 
       reject(err)
      })
      })
      postserver.write(JSON.stringify({"word":line}));
      postserver.end();
    })
  }
}) */



