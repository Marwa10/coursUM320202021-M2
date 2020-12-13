'use strict'

var fetch = require('node-fetch');
var express = require('express');
var app = express();
const port = process.env.PORT || 3000 ;
var https = require('https');
var cors = require('cors');
var countries = require("i18n-iso-countries");
var n = require('country-js');




var corsOptions = {
    origin: 'https://marwa10.github.io',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


let results_fetch = {};

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

    let country_name =  countries.getAlpha2Code(req.param("country"), "en");
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
                  //res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
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



// API Covid start date
app.get("/covid/:country/:start", cors(corsOptions), function(req, res) {
  let country_name =  countries.getAlpha3Code(req.param("country"), "en");
  let date_start = req.param("start");
  console.log(country_name);
  let url = "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/actions/"+country_name+"/"+date_start;
  console.log("2url", url)
  fetch(url)
    .then(res => res.json())
    .then(json => {
      //console.log("covid", json);
      res.format({
            /*'text/html': function () {
            res.send("data fetched look your console");
          },*/
            'application/json': function () {
                //res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                res.set('Content-Type', 'application/json');
                res.json(json);
              }
            })
    });
})



app.get("/covidinfo/enddate/:country/:end", cors(corsOptions), function(req, res) {
  let country_name =  countries.getAlpha3Code(req.param("country"), "en");
  let date_end = req.param("end");
  let url = "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/actions/"+country_name+"/"+date_end;
  fetch(url)
    .then(res => res.json())
    .then(json => {
      //console.log("covid end", json);
      res.format({
            /*'text/html': function () {
            res.send("data fetched look your console");
          },*/
            'application/json': function () {
                //res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                res.set('Content-Type', 'application/json');
                res.json(json);
              }
            })
    });
})

app.get("/CovidAirQuality/:country/:date", cors(corsOptions), function(req, res) {
  //var date = null;
  //var country_name = null;
  let country_name = req.param("country");
  console.log("country",country_name);
  let date = req.param("date");
  console.log("date",date);
  let country3code = countries.getAlpha3Code( country_name, "en");
  let country2code = countries.getAlpha2Code(country_name, "en");

  let geo_2code = n.search(country2code);




  let url_airquality = "https://api.openaq.org/v1/measurements?country=" +country2code +
             "&date_from="+ date+ "&date_to="+ date + "&limit=50";
  console.log("url air:",url_airquality);
  fetch(url_airquality)
  .then(function(response) {
    response.json()
      .then(function(data) {
        results_fetch.Country = country_name ;
        results_fetch.Date = date ;
        results_fetch.Geo = geo_2code[0].geo;
        let AirQualityMeasure = [];
        let results = data.results;
        //console.log( "results air1",data);
        //console.log( "results air2",data.results);

        results.forEach(function(result){
          //console.log("resultat result",result.name)
           AirQualityMeasure.push( {
                                      Parameter : result.parameter,
                                      Value: result.value ,
                                      Unit : result.unit,
                                      Coordinates : result.coordinates,
                                      City : result.city});
         });

      results_fetch.AirqualityMeasure = AirQualityMeasure;
      })
  })

  let url_covid = "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/actions/"+country3code+"/"+date;
  console.log("url covid",url_covid);
  fetch(url_covid)
  .then(function(response) {
    response.json()
      .then(function(data) {
        //onsole.log("data covid", data);
        let policyActions = [];
        let results_policyActions = data.policyActions;
        //console.log( data.policyActions);
        results_policyActions.forEach(function(result){
          //console.log("resultat result",result.name)
           policyActions.push( { Policy : result.policy_type_display,
                                 //Policy_value: result.policyvalue,
                                 //Policy_value_actual: result.policyvalue_actual,
                                 Flagged: result.flagged,
                                 Notes: result.notes,
                                 Field : result.flag_value_display_field });
         });
        //console.log( 'results::',policyActions);
        //results_fetch.Resultat = policyActions;

         let stringencyData = [];
         let results_stringencyData = data.stringencyData;
           //console.log("resultat result",result.name)
         stringencyData.push( { Confirmed : results_stringencyData.confirmed,
                                Deaths: results_stringencyData.deaths,
                                Stringency: results_stringencyData.stringency});
         //let CovidInfoStartData = {PolicyActions : policyActions, StringencyData : stringencyData };
        // console.log("covid info", CovidInfoStartData)
         //results_fetch.CovidInfo = CovidInfoStartData;
         results_fetch.CovidInfo = {PolicyActions : policyActions, StringencyData : stringencyData };
         console.log( " dans le fetch ",results_fetch);

      })
      res.format({
            /*'text/html': function () {
            res.send("data fetched look your console");
          },*/
            'application/json': function () {
                //res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                res.set('Content-Type', 'application/json');
                res.json(results_fetch);
                //console.log( " dans le format ",results_fetch);
              }
            })
  })




  //res.send(results_fetch);


})


app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});


}


initialize();
