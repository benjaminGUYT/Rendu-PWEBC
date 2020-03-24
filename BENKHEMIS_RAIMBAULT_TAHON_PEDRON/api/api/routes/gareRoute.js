const express = require('express');
const router = express.Router();
const najax = $ = require('najax');

/* Récupération du model associé à cette route */
const model = require('../models/gareModel')

/* Méthode d'initialisation de la BDD */
router.get('/init', async(req, res, next) => {
    try {
        /* Récuperation des données via l'API SNCF */

        //var result = await model.getGaresFromAPI(); <-- Cette fonction déconne, je ne sais pas pourquoi elle ne veut pas parser le JSON

        var result = await najax.get('https://ressources.data.sncf.com/api/records/1.0/search/?dataset=liste-des-gares&rows=10000');
        result = JSON.parse(result);

        var nombreGareAPI = result.nhits;
        var nombreGare = 0;

        console.time('test');
        console.log('Début de l\'initialisation des gares, cela prend en général environ 5 minutes');
        process.stdout.write('[');
        /* Pour chaque résultat obtenu, on créé une ligne dans la bdd */
        for (var i in result.records) {
            try {
                let gare = result.records[i].fields;
                await model.initGare(gare);
                nombreGare++;
                if ((parseInt(nombreGareAPI / 100) % nombreGare) === -0) process.stdout.write('=');
            } catch (e) {}
        }
        console.log(']');

        /* Affichage console serveur */
        console.timeEnd('test');
        var message = 'Fin de l\'initialisation des gares : ' + nombreGare + 'gares ajoutées sur ' + nombreGareAPI + ' stockées initialement sur SNCF';
        console.log(message);
        res.status(200).json({ "succes": message })

    } catch (e) {
        console.log(e);
        res.status(500).json({ "error": e });
    }
})

/* Méthode pour récupérer toutes les gares */
router.get('/get', async(req, res, next) => {
    try {
        let result = await model.getGares();
        result = JSON.stringify(result);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).json({ "error": e.toString() })
    }
})

/* Méthode pour récupérer toutes les gares voyageurs */
router.get('/getby/garesVoyageur', async(req, res, next) => {
    try {
        let result = await model.getGaresVoyageur();
        result = JSON.stringify(result);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).json({ "error": e.toString() });
    }
})

/* Méthode pour récupérer toutes les gares de fret */
router.get('/getby/garesFret', async(req, res, next) => {
    try {
        let result = await model.getGaresFret();
        result = JSON.stringify(result);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).json({ "error": e.toString() });
    }
})

/* Méthode pour récupérer le nombre de gares */
router.get('/getby/total', async(req, res, next) => {
    console.log(req.params.gare);
    try {
        var resultat = await model.getGareByTotal();
        console.log(resultat[0].nb);
        return res.status(200).send(JSON.stringify(resultat[0]));
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
})

module.exports = router