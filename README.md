# Projet d'intégration de données connectées:

Ce projet a pour but de permettre à un utilisateur qui souhaite s'installer dans une nouvelle ville de trouver une ville "écologique".

IL aura accès à plusieurs informations de la ville telles que : 

- Sa consommation électrique annuelle
- Sa qualité de l'eau
- Ses aires de covoiturages
- Son prix moyen au mètre carré


## Critique des bases de données choisies:


### Aires de covoiturages 

Ces données proviennent de Point d'Accès National transport.data.gouv.fr. 

Complétude : Est-ce que les informations sont complètes ? Les champs à renseigner le sont-ils ? D’autres champs utiles pourraient-ils être ajoutés ?

Certaines données sont manquantes comme le nombre de places ou l'adresse : parfois un chiffre est renseigné mais souvent il est manquant. 
On retrouve parfois des données aberrantes: 5361 comme donnée de longitude par exemple.

Fiabilité :	Les différentes données sont-elles justes ? Certaines informations sont très complètes… mais totalement fausses ! Un haut pourcentage d’erreurs peut être très impactant pour une entreprise.

Pas tout à fait. Par exemple on retrouve parfois des données aberrantes: 5361 comme donnée de longitude.


Cohérence :	Est-ce que certaines données sont contradictoires ? Si une même donnée contenue dans plusieurs bases présente des résultats différents, elle ne peut pas être considérée comme fiable et une investigation doit être menée.

Non. Cela semble cohérent. 

Pertinence : Est-ce que les informations stockées sont d’une quelconque utilité pour l’entreprise ? La collecte de données non pertinentes est une perte de temps et d’argent.

Oui, nous avons les adresse des aires de covoiturages, leur type ( parking ou aire d'autoroute par exemple), leur coordonnées GPS pour les situer sur une carte et encores d'autres données pertinentes. 

Accessibilité :	Aussi intéressantes soient-elles, les données concernées peuvent-elles être consultées facilement par les collaborateurs habilités ? Une information difficile d’accès est une information peu ou pas exploitée.

Elles sont en libre service donc l'accessibilité est confirmée. 

Ancienneté : Les informations stockées sont-elles récentes ou anciennes ? Le temps érode inéluctablement la valeur d’une information, des mises à jour régulières sont donc indispensables.

Dans la colonne " mise à jour" on voit que certaine données ont été mises à jour en 2017. Certe la dernière modification du fichier date d'Octobre 20022 cependant certaine lignes n'ont pas été mises à jour depuis 5 ans.


### Consommation annuelle d’électricité par commune

Lien : https://opendata.agenceore.fr/explore/dataset/conso-elec-gaz-annuelle-par-secteur-dactivite-agregee-commune/information/

Ce jeu de donnée nous permet de visualiser l’évolution de 2011 à 2021 des consommations d'électricité et de gaz par secteur d'activité (résidentiel, tertiaire, industriel, agricole ou non affecté) et par commune. 

Nous avons mesuré la qualité des données par différents critères :

-   Complétude : Les informations de notre jeu de données sont complètes, il nous manque 0 champs. Nous avons sélectionné les colonnes qui nous intéressent pour construire notre API.

-	Fiabilité : Les données ont été ventilé sur le référentiel INSEE (Institut national de la statistique et des études économiques) au 1er janvier 2021. Le pourcentage d’erreur est donc très infime.

-	Cohérence : Les données sont cohérentes, nous avons vérifié les données pour certaines lignes en croisant les résultats avec d’autres sources.

-	Pertinence : Nous utilisons ici la consommation globale d’électricité par commune.

-	Accessibilité : Les données concernées peuvent être consultées facilement, en effet elles sont en ligne sur un site open source et libre de droit https://opendata.agenceore.fr/ qui regroupent toutes les données autour de l’énergie en France.

-	Ancienneté : Nous disposons des données sur la consommation électrique par commune depuis 2011. Les données sont mises à jour chaque fois. Ces données sont publiées dans le respect des règles relatives à la protection des Informations Commercialement Sensibles.


### Qualité de l'eau

Lien : https://hubeau.eaufrance.fr/page/api-qualite-eau-potable

Les données diffusées concernent les résultats du contrôle sanitaire de l'eau distribuée commune par commune :

-	Prélèvements et résultats des analyses réalisées dans le cadre du contrôle sanitaire réglementaire sur les unités de distribution ou les installations directement en amont

-	Liens entre communes et unités de distribution

Les éléments mis à disposition dans ce jeu de données correspondent à une compilation des bulletins d’analyses diffusés en ligne, commune par commune, sur le site internet du Ministère des Solidarités et de la Santé : http://eaupotable.sante.gouv.fr/.

Nous avons mesuré la qualité des données par différents critères :

-	Complétude : Les informations du jeu de données ci-dessus sont complètes. Nous avons sélectionné seulement certaines colonnes pour construire notre jeu de donnée.

-	Fiabilité : L'API "Qualité de l'eau potable" diffuse les données mises en ligne par le Ministère des Solidarités et de la Santé sur le portail data.gouv.fr.

-	Cohérence : Les données nous semblent cohérentes, en effet nous les avons vérifiés en croisant les résultats avec d’autres sources de données.

-	Pertinence : Nous sélectionnons seulement les informations pertinentes pour notre API, c’est-à-dire les consommations d’eau par habitant par commune ainsi que les codes INSEE de chaque commune.

-	Accessibilité : Les données peuvent être consultées facilement, en effet elles sont en ligne sur un site qui respectent les principes de l’open data (accessible, réutilisable, sans restriction par n’importe quel utilisateur, libre de droit…).

-	Ancienneté : Les informations stockées sont récentes. Le jeu de données est mis à jour mensuellement.


### Étude sur le logement

Ces données trouvées sur le site data.gouv ont été produites par le Groupe BPCE, qui est le deuxième acteur bancaire en France. 
https://www.data.gouv.fr/fr/datasets/etude-sur-le-logement/

Complétude : Est-ce que les informations sont complètes ? Les champs à renseigner le sont-ils ? D’autres champs utiles pourraient-ils être ajoutés ?

Il manque des informations puisqu'il y a 


_Commentaires sur les données de transports en commun:_



## API

L'API est disponible à l'adresse suivante :

L'API va récolter des données parmi les 4 différentes sources de données ci dessus. Notre API passe par le chemin /covoit.

Nous allons voir comment manipuler l'API et appliquer différents niveaux de filtres aux requêtes.

Le format d'entrée est une page HTML avec un champs de saisie qui attend un nom de ville quand le format de sortie est une page HTML montrant toutes les spécifités de la ville (voir ci dessous) pour nous aider dans notre quête de trouver une ville éco-responsable où s'installer.

L'API va nous renvoyer pour chaque ville sa consommation électrique annuelle, sa qualité d'eau, ses emplacements d'aires de covoiturages (sur une carte) ainsi que son prix moyen au mètre carré.

Nous avons un filtre applicable à notre disposition pour la sélection des données qui est le code Insee :

-   code_insee : applique un filtre sur les communes souhaités, pour obtenir plusieurs communes il faut les séparer par une virgule

### Exemple :

Je souhaite récolter les données sur la commune de Montpellier (34000):

/covoit?code_insee='34000'

Ce qui va nous renvoyer :

Une page HTML contenant une carte avec Montpellier en son milieu et ses aires de covoiturages indiqués par des points rouges (?) :

- Consommation électrique annuelle : XXXXXX
- Qualité de l'eau :  XXXXXX
- Prix moyen au mètre carré : XXXXX



## To be continued

Pour améliorer notre API nous avons comme objectif de rajouter sur la carte les aires de vélo en libre service, les arrêts de bus et le label « Villes et Villages Fleuris » de la commune (exemple : Lyon s'est fait attribué 4 fleurs en 2021).

Bien évidemment nous pourrions améliorer notre interface utilisateur pour la rendre plus ergonomique ainsi que le temps de traitement de chaque requête.

