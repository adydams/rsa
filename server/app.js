var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
const recurringSavingsRoute= require('./routes/recurringSavings')
const usersRoute = require('./routes/users');
const savingsRoute = require('./routes/saves');
const cors = require('cors');

var app = express();

var mongooseConnectString = 'mongodb://localhost:27017/ribyProject'
mongoose.connect(mongooseConnectString);
mongoose.connection.on('connected', function(err) {
  console.log("Connected to DB using chain: " + mongooseConnectString);
});


let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));  

app.use(cors({origin:"http://127.0.0.1:5500"}));
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, HEAD");
  return next();
})
// app.use(cors());
app.use('/users',usersRoute);
app.use('/saves',savingsRoute);
app.use('/recurringSavings',recurringSavingsRoute);

app.listen(3000, ()=>{
    console.log('Server running on port 3000');
})

// Setup a default catch-all route that sends back a welcome message in JSON format.
// app.get('*', (req, res) => res.status(200).send({
//   message: 'Welcome to Riby Saving App.',
// })); 


module.exports = app;
