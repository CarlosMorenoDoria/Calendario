const express = require('express');
const morgan =require('morgan');
//initializations

const app = express();


//settings
app.set('port', process.env.PORT || 3000);


//Middlewares
app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
// app.use(express.bodyParser());

//Global Variables

// Routes
app.use(require('./routes'));
//Public 

//Starting Server
app.listen(app.get('port'),()=>{
    console.log("server on Port=", app.get('port'));
})