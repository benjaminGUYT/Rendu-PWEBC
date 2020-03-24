const express = require('express');
const router = express.Router();
const najax = $ = require('najax');

/* Récupération du model associé à cette route */
const model = require('../models/objetsTrouvesModel')

/* Méthode d'initialisation de la BDD */
router.get('/init', async(req, res, next) => {
    try {

        var cpt = 0;
        var cpt2 = 0;

        let result = await najax.get('https://data.sncf.com//api/records/1.0/search/?dataset=objets-trouves-restitution&rows=10000&sort=date&facet=date&refine.date=2020')
        result = JSON.parse(result);
        res.sendStatus(200);
        console.time('test');
        console.log('Début de l\'initialisation des objets trouvés en 2k20');
        var nbObjets = parseInt(result.nhits / 10);
        console.log(nbObjets)
        process.stdout.write('[');
        /* Pour chaque résultat obtenu, on créé une ligne dans la bdd */
        for (var i in result.records) {
            try {
                let objet = result.records[i];
                await model.initObjetsTrouves(objet);
                cpt++;
                if (cpt % (nbObjets / 100) == -0) process.stdout.write('=');
            } catch (e) {
                cpt2++;
            }
        }
        console.log(']');
        console.log('Fin de l\'initialisation des gares : ' + cpt + 'gares ajoutées sur ' + (cpt + cpt2) + ' stockées initialement sur SNCF');
        console.timeEnd('test');
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

/* Méthode pour récupérer le nombre d'objet trouvés pour uen gare donnée */
router.get('/getObjetsTrouvesByGare/:gare', async(req, res, next) => {
    console.log(req.params.gare);
    try {
        var resultat = await model.getObjetsTrouvesByGare(req.params.gare);
        console.log(resultat[0].nb);
        return res.status(200).send(JSON.stringify(resultat[0]));
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
})

/* Méthode pour récupérer le total des objets trouvés */
router.get('/getby/total', async(req, res, next) => {
    console.log(req.params.gare);
    try {
        var resultat = await model.getObjetsTrouvesByTotal();
        console.log(resultat[0].nb);
        return res.status(200).send(JSON.stringify(resultat[0]));
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
})



module.exports = router