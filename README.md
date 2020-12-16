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

Nous avons selectionné 2 API portants sur le secteur environnementale et épidémiologique.

### Open AQ
Alimentée et entretenue par une communauté de chercheurs et professionnels de l'environnement, cette API
regroupe des données de qualité d'air à travers le monde entier. Nous avons la possibilité de récupérer des informations pour un ou plusieurs pays. 
Les paramètres utilisés pour effectuer la requête sont le nom du pays et la date d'enregistrement , cela permet de récupérer un ensemble d'informations sur les pays (Nom, Valeur, Mesure, Ville...)

Lien: https://docs.openaq.org

### The Oxford COVID-19 Government Response Tracker
Cette API est proposée par l'université d'Oxford, elle permet d'avoir accès aux données de décisions gouvernementales associées à la situation sanitaire dépendamment de l'évolution national de la Covid-19. Nous pouvons donc, comme dans l'API précédent, sélectionner un pays ou plusieurs pays avec une date ou un intervalle de temps. Les paramètres que nous avons utilisé sont nom du pays et la date.

Lien: https://covidtracker.bsg.ox.ac.uk/about-api

Nous n'affichons pas l'ensemble des résultats que nous renvoient les API. En effet nous avons sélectionné les informations qui nous semblaient intéressantes à proposées mais aussi les informations qui étaient complètes, certaines variables étaient peu renseignées.

## Choix des sources de données :

### Objectif
Au vu de l'actualité, nous voulions, à travers les multitudes effets de la pandémie du covid-19, avoir un aperçu d'un lien potentiel entre les décisions gouvernementales menées en parallèles des situations sanitaires et une amélioration éventuelle de l'atmosphère mondial. Est-ce que des mesures de restrictions à plusieurs degrés mènent à un changement significatif de la qualité de l'air? C'est pourquoi nous proposons de faire ce croisement d'API afin de permettre des possibilité d'analyses de causes et effet

### Pertinence
Les deux API possèdent chacune une combinaison de clés date/pays qui permettent une correspondance parfaite pour pouvoir être lié. C'est ainsi que nous avons pu ensuite reconstruire une structure adaptée à l'objectif de notre API

## Méthodes utilisés : 


