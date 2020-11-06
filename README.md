#ProjeOData

## Nos API
Nos API proviennent de  : - https://docs.openaq.org 
                          
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



# coursUM320202021-M2

# Descriptif du projet
Par groupes de 5 : développer un serveur node.js hébergé sur heroku qui fournit un jeu de données produit par le croisement d'au moins de jeux de données récupérés sur le Web. Le code projet sera hébergé sur github en fork de ce projet support de cours.
Vous fournirez dans le README de votre projet :
* explication du choix des sources de données et de comment vous les utilisez ( quelles requêtes vous faites )
* comment vous liez les données entre elles
Vous fournirez également votre API de sortie :
* quelles URL proposées par votre serveur permettent de récupérer quelles données
* les données devront être accessibles dans au moins deux formats ( JSON et RDF ) et votre API devra respecter les principes de la négoctiation de contenu server-driven
Il faudra que vos données soient bien ouvertes c'est à dire format explicite, données complètes, et facilement accessiibles ( politique CORS permissive ).


Vous proposerez une interface cliente ( codes HTML JS client ) hébergée en githubpage consommatrice de votre API.

Vous serez évalués sur : la qualité du code,la pertinence du jeu de données, la pertinence des choix de sources de données, la pertinence de la solution de jointure entre les jeux de données, votre bon usage de github et des pull request.


# OpenData

C'est quoi ? Le fait d'ouvrir ses données. Mais il y a des niveaux de qualité dans l'ouverture des données : faciles d'accès, bien structurées, modèle explicite, droit légal de réutilisation.


Quelles sont les motivations ? notamment le partage de données entre scientifiques, dans le prolongement de ce pour quoi le Web et avant ça internet ont été créés. Ca rejoint la volonté de l'article As We May Think de Vanevar Bush en 1945. Mais aussi une demande citoyenne pour rendre public les données des administrations dans un contexte de démocratie et une volonté de transparence.
1. partage de grandes bases de données pour développement d’applications tierces
2. rendre les données aux producteurs de données
3. transparence sur les données produites

10 principes fondateurs ( plus ou moins respectés )
1. complètes,
2. primaires,
3. fraîches,
4. accessibles,
5. électroniquement lisibles par une machine,
6. accessibles sans discrimination,
7. disponibles sous des formats ouverts,
8. disponibles sous licences ouvertes,
9. accessibles de façon pérenne en ligne,
10. sans coût d’utilisation.

# Echelle de qualité des données ouvertes (Tim Berners-Lee)
★ Données non filtrées « dégradées », quel que soit leur format

★ ★ Données disponibles en formats structurés (tabulaires en CSV, XML, Excel, RDF)

★ ★ ★ Données libres d’être exploitées juridiquement (licences) et techniquement dans des formats non propriétaires

★ ★ ★ ★ Données accessibles via des URL afin de pouvoir pointer dessus

★ ★ ★ ★ ★ Données liées à d’autres données pour les contextualiser et les enrichir.

#La loi Lemaire

l’administration (ministères, collectivités territoriales, établissements publics...) sera dorénavant tenue, lorsqu’elle communique un document administratif au format électronique, de le mettre à disposition du citoyen « dans un standard ouvert, aisément réutilisable et exploitable par un système de traitement automatisé ». Ce droit de réutilisation vaut également pour les documents administratifs divulgués par les acteurs privés chargés d'une mission de service public à caractère industriel ou commercial. Si vous voulez des données de l’administration qui ne sont pas déjà ouvertes, il faut les demander à l’administration, si elle ne les fournit pas, vous pouvez demander au CADA  ( Commission d’Accès aux Documents Administratifs ) qui peut imposer à l’administration de vous les ouvrir … mais sous combien de temps ? La loi date de octobre 2016 et ne sera pleinement applicable que fin 2018.


