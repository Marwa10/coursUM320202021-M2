const port = process.env.PORT || 3000

var express = require("express")/* npm install express */
var fetchUrl = require("fetch").fetchUrl
var cors = require('cors');
var ejs = require('ejs');

const fs = require('fs')
var ville = ""
var cp = ""
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(cors());


// Page d'acceuil On revoit la page html --------------------------------
app.get('/', function (req, res) {
        res.setHeader('Content-Type','text/html');
        res.sendFile(__dirname + '/index.html');
})

app.get('/index', function(req,res) {
   
    fs.readFile('index.html', function(err, html) {
    if(err){throw err;}
    res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(html)
        res.end()

})
})


// Ici on recupere les données du formulaire qui seront enreigstrées dans des variables globales ---------
app.get('/form', function(req, res) {
    
    console.log("on est form")
     ville = req.query.Vname
     cp = req.query.cp
     
     res.redirect('/')
    
})









app.listen(port, function () {
    console.log('Running')
  });
