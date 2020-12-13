'use strict'

var fetch = require('node-fetch');
var express = require('express');
var app = express();
const port = process.env.PORT || 3000 ;
var https = require('https');
var cors = require('cors');
var countries = require("i18n-iso-countries");
var n = require('country-js');
var negotiate = require('express-negotiate');




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
  let date = req.param("date");
  console.log("date",date);
  let country3code = countries.getAlpha3Code(country_name, "en");
  let country2code = countries.getAlpha2Code(country_name, "en");

  let geo_2code = n.search(country2code);

  let url_airquality = "https://api.openaq.org/v1/measurements?country=" +country2code +
             "&date_from="+ date+ "&date_to="+ date + "&limit=50";
  fetch(url_airquality)
  .then(function(response) {
    response.json()
      .then(function(data) {
        results_fetch.Country = country_name ;
        results_fetch.Date = date ;
        //results_fetch.Geo = geo_2code[0].geo;
        let AirQualityMeasure = [];
        let results = data.results;

        results.forEach(function(result){
           AirQualityMeasure.push( {
                                      Parameter : result.parameter,
                                      Value: result.value ,
                                      Unit : result.unit,
                                      Coordinates : result.coordinates,
                                      City : result.city
                                    });
         });

      results_fetch.AirqualityMeasure = AirQualityMeasure;

  let url_covid = "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/actions/"+country3code+"/"+date;
  fetch(url_covid)
  .then(function(response) {
    response.json()
      .then(function(data) {
        //onsole.log("data covid", data);
        let policyActions = [];
        let results_policyActions = data.policyActions;
        results_policyActions.forEach(function(result){
          //console.log("resultat result",result.name)
           policyActions.push( { Policy : result.policy_type_display,
                                 //Policy_value: result.policyvalue,
                                 //Policy_value_actual: result.policyvalue_actual,
                                 Flagged: result.flagged,
                                 Notes: result.notes,
                                 Field : result.flag_value_display_field
                               });
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


      req.negotiate(req.params.format,{
            'application/json': function () {
                //res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                res.set('Content-Type', 'application/json');
                res.json(results_fetch);
                //console.log( " dans le format ",results_fetch);
              },// application json,
              'application/xml':function() {
                res.setHeader("Content-disposition", "attachement; filename = CovidAirQuality.rdf ")
                var xmlrdf = `<?xml version="1.0"?>\n`
                xmlrdf += `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:si="https://www.w3schools.com/rdf/">\n`
                xmlrdf += '\t<projetodata:CovidAirQuality>\n'
                xmlrdf += '\t\t<projetodata:hasAirQualityMesure>\n'
                xmlrdf += '\t\t<projetodata:hasCountry>' + country_name + '</projetoD:hasCountry>\n'
                xmlrdf += '\t\t<projetodata:hasDate>' + date + '</projetoD:hasDate>\n'
              //  xmlrdf += '\t\t\t<projetodata:hasGeo>'+ geo_2code[0].geo +'</projetodata:hasGeo>\n';

                results_fetch.AirqualityMeasure.forEach(function(result){
                    xmlrdf += '\t\t\t<projetodata:City>\n'
                    xmlrdf += '\t\t\t<projetodata:City>' +result.City +'</projetodata:City>\n'
                    xmlrdf += '\t\t\t\t<projetodata:hasParameter>' + result.Parameter + '</projetodata:hasName>\n'
                    xmlrdf += '\t\t\t\t<projetodata:hasDate>' + result.Value + '</projetodata:hasName>\n'
                    xmlrdf += '\t\t\t\t<projetodata:hasName>' + result.Units + '</projetodata:hasName>\n'
                    xmlrdf += '\t\t\t\t<projetodata:hasName>' + result.Coordinates + '</projetodata:hasName>\n'
                    xmlrdf += '\t\t\t</projetodata:City>\n'
                  });
              xmlrdf += '\t\t</projetodata:hasAirQualityMesure>\n'
              xmlrdf += '\t\t<projetodata:hasCovidInfo>\n'
              xmlrdf += '\t\t\t<projetodata:hasStringency>\n'
              xmlrdf += '\t\t\t\t<projetodata:hasConfimed>' + results_stringencyData.confirmed + '</projetodata:hasConfimed>\n'
              xmlrdf += '\t\t\t\t<projetodata:hasDeath>' + results_stringencyData.deaths + '</projetodata:hasDeath>\n'
              xmlrdf += '\t\t\t\t<projetodata:hasStringency>' + results_stringencyData.stringency + '</projetodata:hasStringency>\n'
              xmlrdf += '\t\t\t</projetodata:hasStringency>\n'

              xmlrdf += '\t\t\t<projetodata:hasActions>\n'

              policyActions.forEach(function(result){
                xmlrdf += '\t\t\t<projetodata:hasPolicy>\n'
                xmlrdf += '\t\t\t\t<projetodata:hasPolicy>' + result.Policy + '</projetodata:hasPolicy>\n'
                xmlrdf += '\t\t\t\t<projetodata:hasNotes>' + result.Notes + '</projetodata:hasConfimed>\n'
                xmlrdf += '\t\t\t\t<projetodata:hasField>' + result.Field + '</projetodata:hasDeath>\n'
                xmlrdf += '\t\t\t\t<projetodata:isFlagged>' + result.Flagged + '</projetodata:hasStringency>\n'
                xmlrdf += '\t\t\t</projetodata:hasPolicy>\n'
                })
                xmlrdf += '\t\t\t</projetodata:hasActions>\n'
                xmlrdf += '\t\t</projetodata:hasCovidInfo>\n'
                xmlrdf += '\t</projetodata:CovidAirQuality>\n'

              res.set('Content-Type', 'application/xml');
              res.send(xmlrdf);
            }
          })

        })
    })
  })
})

  })

  //res.send(results_fetch);


app.get("/test", function(req, res) {

  req.negotiate({
    "application/xml" : function() {
      res.setHeader("Content-disposition", "attachement; filename=test.rdf")
      var xmlrdf = `<?xml version="1.0"?>\n`
      xmlrdf += `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:si="https://www.w3schools.com/rdf/">\n`
      xmlrdf += `<projetodata:Class rdf:about=":domaine:/rdfvocabulary#covid_air_quality">\n`
      xmlrdf += `<projetodata:label xml:lang ="fr">covid_air_quality</projetodata:label>`
      xmlrdf += `<projetodata:comment xml:lang ="fr"> Les information du covid et la mesure de la qualité de l'aire </projetodata:comment>\n`
      xmlrdf += `<projetodata:Class/>\n`
      xmlrdf += `<projetodata:Class rdf:about="/rdfvocabulary#Air_quality_measure">\n`
      xmlrdf += `<projetodata:label xml:lang ='fr'>Air_quality_measure</projetodata:label>\n`
      xmlrdf += `<projetodata:comment xml:lang ='fr'> Table de la mesure de la qualité de l'aire </projetodata:comment>\n`
      xmlrdf += `<projetodata:Class/>\n`
      xmlrdf += `<projetodata:Class rdf:about="/rdfvocabulary#covid_info">\n`
      xmlrdf += `<projetodata:label xml:lang ='fr'>covid_info</projetodata:label>\n`
      xmlrdf += `<projetodata:comment xml:lang ='fr'> Les information des restriction lié à la covid </projetodata:comment>\n`
      xmlrdf += `<projetodata:Class/>\n`
      xmlrdf += `<projetodata:Class rdf:about="/rdfvocabulary#Actions">\n`
      xmlrdf += `<projetodata:label xml:lang ='fr'>actions</projetodata:label>\n`
      xmlrdf += `<projetodata:comment xml:lang ='fr'>Les restitrictions</projetodata:comment>\n`
      xmlrdf += `<projetodata:Class/>\n`

      xmlrdf += `<projetodata:Class rdf:about="/rdfvocabulary#stringency">\n`
      xmlrdf += `<projetodata:label xml:lang ='fr'>stringency</projetodata:label>\n`
      xmlrdf += `<projetodata:comment xml:lang ='fr'> Les infos de la covid  </projetodata:comment>\n`
      xmlrdf += `<projetodata:Class/>\n`

      xmlrdf += `<projetodata:Class rdf:about="/rdfvocabulary#Coordinates">\n`
      xmlrdf += `<projetodata:label xml:lang ='fr'>Coordinates</projetodata:label>\n`
      xmlrdf += `<projetodata:comment xml:lang ='fr'> Les coordonnées geographique de la ville  </projetodata:comment>\n`
      xmlrdf += `<projetodata:Class/>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasAir_quality_mesure"
      \n projetodata:label="hasAir_quality_mesure"
      \n projetodata:comment="La mesure de la qualité de l'aire">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#covid_air_quality"/>\n`
      xmlrdf += `<projetodata:range rdf:resource=":domain:/rdfvocabulary#Air_quality_measure"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasCovidInfo"
      \n projetodata:label="hasCovidInfo"
      \n projetodata:comment="Les infos de la covid">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#covid_info"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasDate"
      \n projetodata:label="hasDate"
      \n projetodata:comment="La date">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#covid_air_quality"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasPays"
      \n projetodata:label="hasPays"
      \n projetodata:comment="Le pays">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#covid_air_quality"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasDate"
      \n projetodata:label="hasDate"
      \n projetodata:comment="La Date">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#Air_quality_measure"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasParameter"
      \n projetodata:label="hasParameter"
      \n projetodata:comment="Les paramètre de la mesure de la qualité de l'aire">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#Air_quality_measure"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `rdf:about=":domaine:/rdfvocabulary#hasCity"
      \n projetodata:label="hasCity"
      \n projetodata:comment="La ville">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#Air_quality_measure"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasValue"
      \n projetodata:label="hasValue"
      \n projetodata:comment="La valeur de la qualité de l'aire">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#Air_quality_measure"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasUnit"
      \n projetodata:label="hasUnit"
      \n projetodata:comment="L'unité de mesure de la qualité de l'aire">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#Air_quality_measure"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasCoordinate"
      \n projetodata:label="hasCoordinate"
      \n projetodata:comment="Latitude et longitude de la ville">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#Coordinates"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasLatitude"
      \n projetodata:label="hasLatitude"
      \n projetodata:comment="Latitude de la ville">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#Coordinates"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasStringency"
      \n projetodata:label="hasStringency"
      \n projetodata:comment="Les infos de la covid-19">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#covid_info"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasActions"
      \n projetodata:label="hasActions"
      \n projetodata:comment="Les actions liées à la covid">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#covid_info"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasConfirmed"
      \n projetodata:label="hasConfirmed"
      \n projetodata:comment="Le nombre de cas de covid confirmé">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#stringency"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasDeath"
      \n projetodata:label="hasDeath"
      \n projetodata:comment="Lee nombre de décés lié à la covid">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#stringency"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasStringency"
      \n projetodata:label="hasStringency"
      \n projetodata:comment="La rigeur des mesures prises">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#covid_info"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasNotes"
      \n projetodata:label="hasNotes"
      \n projetodata:comment="Les commentaire de l'agent">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#Actions"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasPolicy"
      \n projetodata:label="hasPolicy"
      \n projetodata:comment="La police">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#Actions"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#isFlagged"
      \n projetodata:label="isFlagged"
      \n projetodata:comment="existe">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#Actions"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `<rdf:Property rdf:about=":domaine:/rdfvocabulary#hasField"
      \n projetodata:label="hasField"
      \n projetodata:comment="Le département de la police">\n`
      xmlrdf += `<projetodata:domain rdf:resource="#Actions"/>\n`
      xmlrdf += `<projetodata:range rdf:resource="http://www.w3.org/2000/01/rdf-schema#Literal"/>\n`
      xmlrdf += `<projetodata:isDefinedBy rdf:resource=":domaine:/rdfvocabulary"/>\n`
      xmlrdf += `</rdf:Property>\n`

      xmlrdf += `</rdf:RDF>`

      res.send(xmlrdf);

    }
  })

})


app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});

}


initialize();
