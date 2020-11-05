'use strict'


//let token= "c649537876c0cf6eac009978cd1c83da68a1b38c";
  window.addEventListener("load", initialize);

  function initialize() {
    document.getElementById("btn-search1").addEventListener("click", fetchAirInfo);
    document.getElementById("jsonbtn").addEventListener("click", fetchAirInfo);

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

  document.getElementById("datacontent1").style.color = "black";
  document.getElementById("datacontent2").style.color = "black";
  fetch("/airquality/"+ sent_country + "/" +sent_date_from + "/" + sent_date_to)
  .then(res => res.json())          // convert to plain text
  .then(json => document.getElementById("datacontent1").textContent = JSON.stringify(json.results,undefined, 2))



  fetch("/covid/" + sent_country + "/"+ sent_date_from)
  .then(res => res.json())          // convert to plain text
  .then(json => document.getElementById("datacontent2").textContent = JSON.stringify(json,undefined,1))


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


  const choices = new Choices('[data-trigger]',
  {
    searchEnabled: false,
    itemSelectText: '',
  });

    function isEmpty(){
      var str = document.forms['myForm'].search.value;
      if( !str.replace(/\s+/, '').length ) {
        alert( "Veuillez renseigner le champ pays SVP !" );
        return false;
        }
     }
