const express = require('express');
const router = express.Router();
const najax = $ = require('najax');


/* Récupération du model associé à cette route */
const model = require('../models/voieModel')

/* Méthode d'initialisation de la BDD */
router.get('/init', async(req, res, next) => {
    try {
        /* Récupération des ressources sur l'api sncf */
        let result = await najax.get('https://ressources.data.sncf.com/api/records/1.0/search/?dataset=formes-des-lignes-du-rfn&rows=10000')
        result = JSON.parse(result);

        var nombreVoieAPI = result.nhits;
        var nombreVoie = 0;

        res.sendStatus(200);
        console.time('test');
        console.log('Début de l\'initialisation des voies');
        var nbObjets = parseInt(result.nhits / 10);
        console.log(nbObjets)
        process.stdout.write('[');
        /* Pour chaque résultat obtenu, on créé une ligne dans la bdd */
        for (var i in result.records) {
            try {
                let objet = result.records[i];
                await model.initVoie(objet);
                nombreVoie++;
                if ((parseInt(nombreVoieAPI / 100) % nombreVoie) === -0) process.stdout.write('=');
            } catch (e) {
                console.log(e);
            }
        }
        console.log(']');
        console.log('Fin de l\'initialisation des voies : ' + nombreVoie + 'voies ajoutées sur ' + nombreVoieAPI + ' stockées initialement sur SNCF');
        console.timeEnd('test');
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

/* Méthode pour récupérer les voies liées à une gare */
router.get('/get', async(req, res, next) => {
    console.log(req.params.gare);
    try {
        var resultat = await model.getVoies();
        return res.status(200).send(JSON.stringify(resultat));
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "error": e.toString() });
    }
})



router.get('/getby/ligne/:ligne', async(req, res, next) => {
    console.log(req.params.gare);
    try {
        var resultat = await model.getVoieByLigne(req.params.ligne);
        return res.status(200).send(JSON.stringify(resultat[0]));
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "error": e.toString() });
    }
})





module.exports = router