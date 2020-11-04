'use strict'
  window.addEventListener("load", initialize);

  function initialize() {
    document.getElementById("btn-search1").addEventListener("click", fetchAirInfo);
  }




function fetchAirInfo(){
  let country =  document.getElementById('search').value;
  console.log(country);
  let date_from = document.getElementById('depart').value;
  console.log(date_from);
  let date_to = document.getElementById('return').value;

  console.log(date_to);

  fetch("/fetchair/tout" + "?country="+ country + "&date_from=" +date_from + "&date_to=" + date_to)
   .then(function(response) {
     response.json()
       .then(function(data) {
         console.log(data); })

})

}

//Données covid date début

function fetchActionBegin(){
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
