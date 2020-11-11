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




  let url = "/CovidAirQuality/" + country + "/"+ date;

    fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById("datacontent").textContent = JSON.stringify(data,undefined,2);
      document.getElementById("deaths").textContent = data.CovidInfo.StringencyData[0].Deaths ;
      document.getElementById("confirmed").textContent = data.CovidInfo.StringencyData[0].Confirmed ;
      document.getElementById("stringency").textContent = data.CovidInfo.StringencyData[0].Stringency ;

      console.log(data.CovidInfo.StringencyData[0].Stringency);
      //console.log(data.AirqualityMeasure[0].Coordinates.longitude);
      let lat = data.AirqualityMeasure[0].Coordinates.latitude ;
      let lon = data.AirqualityMeasure[0].Coordinates.longitude ;
      document.getElementById('mapid').innerHTML = "< div id='map' style='width: 100%; height: 100%;'>";
      var mymap = L.map('mapid').setView([lat, lon], 6);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYW5nZWxhMTEiLCJhIjoiY2toNmM2enN2MDdoNTJ0bDIzZG4yaHFjbyJ9.tAmv1tsl3AfZPZJMfK2KiA'
      }).addTo(mymap);
      let res = data.AirqualityMeasure;
      res.forEach(function(result){

        //var marker = L.marker([result.Coordinates.latitude, result.Coordinates.longitude]).addTo(mymap);
        var yourData = getInfoFrom(data).join(" <br>");

        function getInfoFrom(data) {
          var popupinfo = [];
          popupinfo.push("<strong><font size=4>" + String(result.City) + " : "  + String(result.Value) + " " + String(result.Unit) + "</strong></font>" + " <br>");
          for (var i = 0; i < data.CovidInfo.PolicyActions.length; i++) {
            if (data.CovidInfo.PolicyActions[i].Flagged == true){
              var stringLine = data.CovidInfo.PolicyActions[i].Policy + " : " + "<font color='green'>" + data.CovidInfo.PolicyActions[i].Flagged+"</font>";
              popupinfo.push(stringLine);
            }
            if (data.CovidInfo.PolicyActions[i].Flagged == false){
              var stringLine = data.CovidInfo.PolicyActions[i].Policy + " : " + "<font color='red'>" + data.CovidInfo.PolicyActions[i].Flagged+"</font>";
              popupinfo.push(stringLine);
            }


          }
          return popupinfo;
        }

        var circle = L.circle([result.Coordinates.latitude, result.Coordinates.longitude], {
            //color: 'red',
            fill : result.Value,
            //radius: 500,
            weight : result.Value,
            opacity: 0.5
        })
        .bindPopup(yourData)
        .addTo(mymap);



      //  marker.bindPopup("result.Value").openPopup();
      });

    });
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
