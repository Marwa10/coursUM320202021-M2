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
let pays3 = [];
async function initialize(){
  let url = "https://api.openaq.org/v1/countries";
  init = await fetch(url).then(response => response.json());

  //console.log("liste: ", pays);
  let results = init.results ;
  //console.log("liste: ", results);
  results.forEach(function(result){
    //console.log("resultat result",result.name)
     if (result.name) pays.push(result.name);
     if (result.name) pays3.push(countries.getAlpha3Code(result.name, "en"));
   });
   //console.log("liste: ", pays);


  console.log("now can start server");

  app.use(express.static('docs'));



// Fetch measurments of a specific country and date range
 app.get("/airquality/:country/:date_from/:date_to",
 //app.get("/airquality/country/",
       cors(corsOptions), function(req, res){
    /*
    let country_name = "FR";
    let d_from="2020-10-01";
    let d_to ="2020-10-30"; */

    let country_name =  countries.getAlpha2Code(req.param("country"));
    console.log(country_name);
    //country_name = countries.getAlpha2Code(country_name, "en")
    let d_from = req.param("date_from");
    let d_to = req.param("date_to");

    let url = "https://api.openaq.org/v1/measurements?country=" +country_name +
               "&date_from="+ d_from+ "&date_to="+ d_to + "&limit=10";
    console.log(url);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log("fetchair", json);
        res.format({
              //'text/html': function () {
              //res.send("data fetched look your console");
              //},
              'application/json': function () {
                  res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                  res.set('Content-Type', 'application/json');
                  res.json(json);
                }
              })
      });

    //let url = "https://api.openaq.org/v1/measurements";
    /*
    fetch(url)
    .then(res => {
      if(res.ok){
        res.json();
        console.log("success");
      }else {
        console.log('erreur de response', res.statusText)}
      })
    .then(json => {
        res.format({
            'text/html': function () {
            res.send("data fetched look your console");
            },
            'application/json': function () {
                res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                res.set('Content-Type', 'application/json');
                res.json(json);
              }
            });
            console.log("fetchair", json);

    }); */
})




app.get("/pays", function(req, res) {
  res.send(pays);
})



// API Covid
app.get("/covid/:country/:start", cors(corsOptions), function(req, res) {
  let country_name =  countries.getAlpha3Code(req.param("country"));
  let date_start = req.param("start");
  console.log(country_name);

  /*
  for (var i = 0; i<pays3.length; i++){
    if(pays3[i]){
      if(pays3[i].substring(0,2)==test){
        pays = pays3[i]
    }
  }
} */
  let url = "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/actions/"+country_name+"/"+date_start;
  console.log("2url", url)
  fetch(url)
    .then(res => res.json())
    .then(json => {
      console.log("covid", json);
      res.format({
            /*'text/html': function () {
            res.send("data fetched look your console");
          },*/
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


initialize();
