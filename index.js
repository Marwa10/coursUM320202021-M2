'use strict'

var fetch = require('node-fetch');
var express = require('express');
var app = express();
const port = process.env.PORT || 3000 ;
var https = require('https');
var cors = require('cors');
var countries = require("i18n-iso-countries");


var corsOptions = {
    origin: 'https://marwa10.github.io',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

let init = [] ;
let pays = [] ;
async function initialize(){
  let url = "https://api.openaq.org/v1/countries";
  init = await fetch(url).then(response => response.json());

  //console.log("liste: ", pays);
  let results = init.results ;
  //console.log("liste: ", results);
  results.forEach(function(result){
    //console.log("resultat result",result.name)
     if (result.name) pays.push(countries.getAlpha2Code(result.name, "en"));
   });
   //console.log("liste: ", pays);


  console.log("now can start server");

  app.use(express.static('docs'));



// Fetch measurments of a specific country and date range
 app.get("/fetchair/tout", cors(corsOptions), function(req, res){
   /*
    let country = "FR";
    let d_from="2020-10-01";
    let d_to ="2020-10-30";
    +"&parameter[]=co&parameter[]=pm25"
    */

    let country_name = req.query['country'];
    //country_name = countries.getAlpha2Code(country_name, "en")
    let d_from = req.query['date_from'];
    let d_to = req.query['date_to'];

    let url = "https://api.openaq.org/v1/measurements?country=" +country_name +
               "&date_from="+ d_from+ "&date_to="+ d_to;
    console.log(url);

    //let url = "https://api.openaq.org/v1/measurements";
    fetch(url)
    .then(res => res.json())
    .then(country_air => {
        console.log("fetchair", country_air);
        res.format({
            'text/html': function () {
            res.send("data fetched look your console");
            },
            'application/json': function () {
                res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                res.set('Content-Type', 'application/json');
                res.json(country_air);
              }
            });
    });
})

app.get("/pays", function(req, res) {
  res.send(pays);
})
// API Covid
app.get("/fetchcovid/action_begin", cors(corsOptions), function(req, res) {
  var date_begin = req.query["date_from"];
  var pays = req.query["pays"];
  let url = "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/actions/"+pays+"/"+date_begin;
  fetch(url)
    .then(res => res.json())
    .then(json => {
      console.log("covid", json);
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

app.get("/fetchcovid/action_fin", cors(corsOptions), function(req, res) {
  let date_end = "2020-06-20";
  let pays = "ABW";
  let url = "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/actions/"+pays+"/"+date_end;
  fetch(url)
    .then(res => res.json())
    .then(json => {
      console.log("covid", json);
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


}

//serves static files



/*Fetch list of countries
//app.get("/data/pays", cors(corsOptions), function(req, res){
    let names =;
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
    document.getElementById('liste_pays').innerHTML = pays;
    console.log(pays);
    res.send("data fetched look your console");
    });
*/



initialize();
