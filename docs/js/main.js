'use strict'


//let token= "c649537876c0cf6eac009978cd1c83da68a1b38c";
  window.addEventListener("load", initialize);

  function initialize() {
    document.getElementById("btn-search1").addEventListener("click", fetchAirInfo);
  }




function fetchAirInfo(){
  let sent_country =  document.getElementById('search').value;
  console.log(sent_country);
  let sent_date_from = document.getElementById('depart').value;
  console.log(sent_date_from);
  let sent_date_to = document.getElementById('return').value;
  console.log(sent_date_to);

  fetch("/airquality/"+ sent_country + "/" +sent_date_from + "/" + sent_date_to)
  .then(res => res.json())          // convert to plain text
  .then(json => console.log(json.results))

   //fetch("/airquality/country")



   /*.then(function(response) {
     response.json()
       .then(function(data) {
         console.log("c bon");
         console.log(data); })

}) */


// fetch covid info:


}

//Données covid date début

function fetActionEnd(){
  let country =  document.getElementById('search').value;
  let date_from = document.getElementById('depart').value;
  let date_to = document.getElementById('return').value;

  fetch("/fetchcovid/action_fin" + country +date_from)
   .then(function(response) {
     response.json()
       .then(function(data) {
         console.log(data); })

})

}

// Donnée covid date de fin
function fetActionEnd(){
  let country =  document.getElementById('search').value;
  let date_from = document.getElementById('depart').value;
  let date_to = document.getElementById('return').value;

  fetch("/fetchcovid/action_fin" + country +date_from)
   .then(function(response) {
     response.json()
       .then(function(data) {
         console.log(data); })

})
