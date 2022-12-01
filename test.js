"use strict";

var express = require("express") /* npm install express */
var XLSX = require('xlsx');
const app = express();
const bodyParser = require("body-parser");
const http = require('http');
const httprequest = require('request');
const removeAccents = require('remove-accents-diacritics');
//const axios = require('axios');

var fetch = require('node-fetch');
const { resolve } = require("path");

const PORT = process.env.PORT || 300;

app.use(bodyParser.urlencoded({
    extended:true
}));

app.get('/covoit', function(req, res) {
	res.sendFile(__dirname + "/page.html");
});

function eau_f(code_commune){
    let url = "https://hubeau.eaufrance.fr/api/v0/indicateurs_services/communes?type_service=AEP&size=1&code_commune=" + code_commune;
    let url2 = 'https://hubeau.eaufrance.fr/api/v0/indicateurs_services/communes?type_service=AEP&size=5000&annee=';
    return fetch(url)
        .then(res => res.json())
        .then(function(json){
            var data = json.data[0];
            if (typeof data == 'undefined'){
                return;
            }
            var obj = {};
            obj['code_commune_insee'] = data.code_commune_insee;
            obj['annee'] = data.annee;
            obj['Conso par abonné (en m3)'] = data.indicateurs['VP.231'];
            return(obj);
        })
        .then(function(obj){
            if (typeof obj == 'undefined'){
                return {'Eau': 'r'};
            }
            return fetch(url2 + obj.annee)
                .then(res => res.json())
                .then(function(json){
                    var i = 0
                    var val = 0
                    var p = 0
                    json.data.forEach(element => {
                        p += 1
                        if (element.indicateurs['VP.231']!=0 && element.indicateurs['VP.231']!==null){
                            i += 1
                            val += element.indicateurs['VP.231']
                        }
                    })
                    obj['Nb_mesures cette année'] = p;
                    obj['Nb_mesures not null cette année'] = i;
                    obj['Moyenne'] = val / i;
                    var fin = {};
                    fin['code_commune_insee'] = obj.code_commune_insee;
                    fin['Conso par abonné (en m3)'] = obj['Conso par abonné (en m3)'];
                    fin['Moyenne nationale de conso par abonnées (en m3)'] = obj['Moyenne'];
                    return(fin)
                })
        });
}

function energie_f(code_commune){
    let urlenergie = "https://opendata.agenceore.fr/api/records/1.0/search/?dataset=conso-elec-gaz-annuelle-par-secteur-dactivite-agregee-commune&q=&rows=1&sort=annee&facet=consototale&refine.code_commune=" + code_commune;
    return fetch(urlenergie)
        .then(res => res.json())
        .then(function(json){
            var data = json.records[0].fields;
            var obj = {};
            obj['consototale_energie'] = data.consototale;
            return(obj)
        });
}

function covoit_f(code_commune){
    let urlcovoit = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=base-nationale-des-lieux-de-covoiturage-france&q=&rows=10000&facet=spot_com&facet=xlong&facet=ylat&facet=spot_name&refine.spot_com_code=" + code_commune
    return fetch(urlcovoit)
        .then(res => res.json())
        .then(function(json){
            var data = json.records;
            var l = [];
            data.forEach(element => {
                var o = {};
                o["Nom de l'aire de covoiturage"] = element.fields.spot_name;
                o["Type d'aire"] = element.fields.spot_type;
                o["Longitude"] = element.fields.xlong;
                o["Latitude"] = element.fields.ylat;
                l = [...l, o]
            })
            return(l)
        });
}


app.post('/covoit', function(req, response){
    var nom_commune = removeAccents.remove(req.body.code_commune.toUpperCase());

    console.log("Nom de la commune saisie :", nom_commune)

    const immo = new Promise((resolve, reject) => {
        let urlimmo = "https://www.data.gouv.fr/fr/datasets/r/9e7cf3ab-ce68-40ab-b906-9ce7396fc9bc";
        let options = {json: true};
        let fini = false;
        req = httprequest(urlimmo, options, (error, response, body) => {
            body.forEach(element => {
                if (fini){
                    return;
                }
                if (element.fields.libelle_commune.split(' ')[0] == nom_commune){
                    fini = true;
                    var ob = {};
                    ob['codeInsee'] = element.fields.code_insee;
                    ob['prix_appart_ancien'] = element.fields.marche_immobilier_prix_des_appartements_anciens_a;
                    ob['prix_maison_ancien'] = element.fields.marche_immobilier_prix_des_maisons_anciennes_a;
                    ob['prix_appart_neuf'] = element.fields.marche_immobilier_prix_du_neuf_a_les_appartements_neufs;
                    ob['prix_maison_neuf'] = element.fields.marche_immobilier_prix_des_maisons_neuves;
                    resolve(ob);
                    console.log(ob.codeInsee);
                    return;
                }
            })
        })
    })

    immo.then(ob => {
        console.log("Fonction Immo finie ...")
        var code_commune = ob.codeInsee;
        Promise.all([eau_f(code_commune), energie_f(code_commune), covoit_f(code_commune)]).then(function(values){
            var obj = values[0];
            obj["consototale_energie"] = values[1].consototale_energie;
            obj["Covoit"] = values[2];
            obj["Immo"] = ob;
            response.send(obj);
        })
    })
})

app.listen(PORT, function(){
	console.log('Bienvenu sur le port :', PORT);
})