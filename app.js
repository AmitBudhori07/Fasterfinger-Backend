const express = require('express');
const app = express();

const routes = require('./Routes')


app.use(express.json({limit: '50mb'}));
app.use(routes);
app.use(require('./Routes/auth'))


app.listen(5000,()=>{
    console.log("Listning on the port 5000")
})

