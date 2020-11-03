'use strict'

var express = require('express');
var app = express();

const port = process.env.PORT || 3000 ;

var fetch = require('node-fetch');
var https = require('https');


var cors = require('cors');

var corsOptions = {
    origin: 'https://marwa10.github.io',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

//serves static files
app.use(express.static('docs'));


//ROUTES

app.get("/:name", function(req, res){
    res.send("hello : " + req.params.name );
})






// Fetch list of countries
app.get("/data/pays", cors(corsOptions), function(req, res){
    let names = [] ;
    let pays = [] ;
    let url = "https://api.openaq.org/v1/countries" ;
    fetch(url)
    .then(res => res.json())
    .then(json => {
    let results = json.results ;
    results.forEach(function(results){
      names.push(results.name);
    });

    pays = names.filter(function( element ) {
      return element !== undefined;
    });
    console.log(pays);
    res.send("data fetched look your console");
    });
})



// Fetch measurments of a specific country and date range
app.get("/fetchair/tout", cors(corsOptions), function(req, res){
    let country = "FR";
    let d_from="2020-10-01";
    let d_to ="2020-10-30";

    let url = "https://api.openaq.org/v1/measurements?country=" +country +
               "&date_from="+ d_from+ "&date_to="+ d_to +"&parameter[]=co&parameter[]=pm25";
    fetch(url)
    .then(res => res.json())
    .then(json => {
        console.log("fetchair", json);

        res.format({
            'text/html': function () {
            res.send("data fetched look your console");
            },
            'application/json': function () {
                res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                res.set('Content-Type', 'application/json');
                res.json(json);
              }
            })
    });
})




app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});
