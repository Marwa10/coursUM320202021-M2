'use strict'


//let token= "c649537876c0cf6eac009978cd1c83da68a1b38c";
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

  fetch("/fetchair/tout" + "?country="+ country + "&date_from=" +date_from + "&date_to=" + date_to ,{
          headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'}
                  } )
  .then(function (response){
    console.log(response.json());

  })

   /*.then(function(response) {
     response.json()
       .then(function(data) {
         console.log("c bon");
         console.log(data); })

}) */

}
