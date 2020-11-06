'use strict'


//let token= "c649537876c0cf6eac009978cd1c83da68a1b38c";
  window.addEventListener("load", initialize);

  function initialize() {
    document.getElementById("btn-search1").addEventListener("click", fetch_covid_airquality);
    document.getElementById("jsonbtn").addEventListener("click", fetch_covid_airquality);


  // latitude & longitude
  }




  function fetch_covid_airquality(){
    let country =  document.getElementById('search').value;
    console.log(country);
    let date = document.getElementById('depart').value;
    console.log(date);

    var x = document.getElementById("datadisplay");
    var col = document.getElementById("jsonbtn");
    if (x.style.display === "none") {
      x.style.display = "block";
      col.style.color = "white";
      col.style.background = "black";
    } else {
      x.style.display = "none";
      col.style.color = "black";
      col.style.background = "grey";
    }
    let data_for_map = {} ;
    var mymap = L.map('mapid').setView([48.833, 2.333], 3);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYW5nZWxhMTEiLCJhIjoiY2toNmM2enN2MDdoNTJ0bDIzZG4yaHFjbyJ9.tAmv1tsl3AfZPZJMfK2KiA'
  }).addTo(mymap);

  var circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 800
  }).addTo(mymap);

  let url = "/CovidAirQuality/" + country + "/"+ date;

    fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById("datacontent").textContent = JSON.stringify(data,undefined,2);
      data_for_map = data;
    });
    console.log(data_for_map);
  }




function fetchAirInfo(){
  let sent_country =  document.getElementById('search').value;
  console.log(sent_country);
  let sent_date_from = document.getElementById('depart').value;
  console.log(sent_date_from);
  let sent_date_to = document.getElementById('return').value;
  console.log(sent_date_to);

  var x = document.getElementById("datadisplay");
  var col = document.getElementById("jsonbtn");
  if (x.style.display === "none") {
    x.style.display = "block";
    col.style.color = "white";
    col.style.background = "black";
  } else {
    x.style.display = "none";
    col.style.color = "black";
    col.style.background = "grey";

  }


  let objet = {} ;
  objet.Country = sent_country ;
  objet.StartData = sent_date_from ;
  objet.EndDate = sent_date_to ;

  fetch("/airquality/"+ sent_country + "/" +sent_date_from + "/" + sent_date_to)
  .then(function(response) {
    response.json()
      .then(function(data) {
        let AirQualityMeasure = [];
        let results = data.results;
        results.forEach(function(result){
          //console.log("resultat result",result.name)
           AirQualityMeasure.push( { Date : result.date, Value: result.value , Location : result.location, Parameter : result.parameter, City : result.city});
         });
      objet.AirqualityMeasure = AirQualityMeasure;
      })
  })






  fetch("/covid/" + sent_country + "/"+ sent_date_from)
  .then(function(response) {
    response.json()
      .then(function(data) {

        let policyActions = [];
        let results_policyActions = data.policyActions;
        results_policyActions.forEach(function(result){
          //console.log("resultat result",result.name)
           policyActions.push( { Policy_type_display : result.policy_type_display, Policy_value: result.policyvalue,
             Policy_value_actual: result.policyvalue_actual, Flagged: result.flagged, Notes: result.notes,
             Policy_value_display_field : result.flag_value_display_field });
         });

         let stringencyData = [];
         let results_stringencyData = data.stringencyData;
           //console.log("resultat result",result.name)
         stringencyData.push( { Confirmed : results_stringencyData.confirmed, Deaths: results_stringencyData.deaths,
           Date: results_stringencyData.date_value,Stringency: results_stringencyData.stringency});
         let CovidInfoStartData = {PolicyActions : policyActions, StringencyData : stringencyData };
         objet.CovidInfoStartData = CovidInfoStartData;
      })

  })




  fetch("/covidinfo/enddate/" + sent_country + "/"+ sent_date_to)
  .then(function(response) {
    response.json()
      .then(function(data) {

        let policyActions = [];
        let results_policyActions = data.policyActions;
        results_policyActions.forEach(function(result){
          //console.log("resultat result",result.name)
           policyActions.push( { Policy_type_display : result.policy_type_display, Policy_value: result.policyvalue,
             Policy_value_actual: result.policyvalue_actual, Flagged: result.flagged, Notes: result.notes,
             Policy_value_display_field : result.flag_value_display_field });
         });

         let stringencyData = [];
         let results_stringencyData = data.stringencyData;
           //console.log("resultat result",result.name)
         stringencyData.push( { Confirmed : results_stringencyData.confirmed, Deaths: results_stringencyData.deaths,
           Date: results_stringencyData.date_value,Stringency: results_stringencyData.stringency});
         let CovidInfoEndDate = {PolicyActions : policyActions, StringencyData : stringencyData };
         objet.CovidInfoEndDate = CovidInfoEndDate;
      document.getElementById("datacontent").textContent = JSON.stringify(objet,undefined,2);
      })

  })

}

//Données covid date début
/*
function fetActionEnd(){
  let country =  document.getElementById('search').value;
  let date_from = document.getElementById('depart').value;

  fetch("/fetchcovid/action_begin?date_from="+ date_from + "&pays=" + country)
   .then(function(response) {
     response.json()
       .then(function(data) {
         console.log(data); })

})

}
// Donnée covid date de fin
function fetchActionEnd(){
  let country =  document.getElementById('search').value;
  let date_to = document.getElementById('return').value;

  fetch("/fetchcovid/action_begin?date_from="+ date_to+ "&pays=" + country )
   .then(function(response) {
     response.json()
       .then(function(data) {
         console.log(data); })

})
*/

fetch("/pays")
.then(function(response) {
  response.json()
    .then(function(data) {
      //console.log(data);

      var list = document.getElementById('liste_pays');

      data.forEach(function(item){
         var option = document.createElement('option');
         option.value = item;
         list.appendChild(option);
      });

    })
  })




    function isEmpty(){
      var str = document.forms['myForm'].search.value;
      if( !str.replace(/\s+/, '').length ) {
        alert( "Veuillez renseigner le champ pays SVP !" );
        return false;
        }
     }
