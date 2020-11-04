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
