const express = require('express');
const app = express();
const mongoose = require('mongoose');
//const {MONGOURI} = require('./config/key');
const MONGOURI = "mongodb+srv://ArushEnterprises:2V1D8FTsdsZRruNB@cluster0.oojvq.mongodb.net/Arush_Enterprices?retryWrites=true&w=majority"
const PORT = process.env.PORT || 5000;
var bodyParser = require('body-parser');
var cors = require('cors')
app.use(cors())
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json',
    )
    next()
  })

// app.use(cors({
//     origin: '*'
// }));

mongoose.connect(MONGOURI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
})

mongoose.connection.on('connected', () =>{
    console.log("Connected to mongo");
})

mongoose.connection.on('error', (err) => {
    console.log("err connecting",err);
})

require('./models/product')
require('./models/user')
require('./models/medical')
require('./models/order')
app.use(require('./routes/product'))
app.use(require('./routes/auth'))
app.use(require('./routes/medical'))
app.use(require('./routes/order'))

// if(process.env.NODE_ENV == "production"){
//     app.use(express.static('Arush_enterprices_frontend/build'))
//     const path = require('path')
//     app.get('*',(req,res)=>{
//         res.sendFile(path.resolve(__dirname,'Arush_enterprices_frontend','build','index.html',))
//     })
// }

app.listen(PORT, () => {
    console.log("Server listening on port "+PORT);
  });