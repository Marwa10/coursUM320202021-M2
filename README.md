#ProjeOData : Air quality and lockdowns

## Les membres de l'équipe :
- BACO MAHADALI Youssouf
- ELATRACHE Marwa 
- MARTIN Caroline
- NAGARATNAM Tharshika
- SECK Omar 

## Air quality and lockdowns site :
- Liens heroku : https://projetodata.herokuapp.com/

## Air quality and lockdowns API :
- json : https://projetodata.herokuapp.com/covidAirquality/COUNTRY/YYYY-MM-DD/json
         Exemple : https://projetodata.herokuapp.com/covidAirquality/FRANCE/2020-03-04/json
- xml : https://projetodata.herokuapp.com/covidAirquality/COUNTRY/YYYY-MM-DD/xml
        Exemple : https://projetodata.herokuapp.com/covidAirquality/FRANCE/2020-03-04/xml

## Sources de données : 

Pour réaliser 
Nos API proviennent de  : 
- https://docs.openaq.org 
- https://www.bsg.ox.ac.uk/research/research-projects/coronavirus-government-response-tracker

BD pour alimenter la liste déroulante : https://www.nationsonline.org/oneworld/country_code_list.htm

Nous avons selectioné 2 API portants sur le secteur environnementale et covid.

La première permet de récupérer des informations sur la qualité d'air dans un pays. 
Les paramètres utilisés pour effectuer la requête sont le nom du pays et la date d'enregistrement , cela permet de récupérer un ensemble d'informations sur les pays (Nom, Valeur, Mesure, Ville...)

Lien API qualité d'air



La seconde API est semblable  la première, fonctionne de la même facon mais porte sur le covid. Les paramètres que nous avons utilisé sont nom du pays et la date.
Cela nous permet de récupérer les informations sur le covid d'un pays.

Lien API Covid

Nous n'affichons pas l'ensemble des résultats que nous renvoient les API. En effet nous avons sélectionné les informations qui nous semblaient intéressantes à proposées mais aussi les informations qui étaient complètes, certaines variables étaient peu renseignées.

## Choix des sources de données :

## Méthodes utilisés : 


