const pool = require('./dbConn')

class voieModel {

    static getVoiesFromAPI = () => {
        var result = najax.get('https://ressources.data.sncf.com/api/records/1.0/search/?dataset=formes-des-lignes-du-rfn&rows=10000');
        result = JSON.parse(result);
        return result;
    }

    static initVoie = (voie) => {

        var id = voie.recordid;
        var libelle = voie.fields.libelle;
        var codeLigne = voie.fields.code_ligne;
        var coordonees = JSON.stringify(voie.fields.geo_shape.coordinates);

        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO `voie` (id, libelle, codeLigne, coordonees) ' +
                'VALUES(?,?,?,?)', [id, libelle, codeLigne, coordonees], (err, results) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve();
                    }
                });
        });
    }

    static getVoies = () => {

        return new Promise((resolve, reject) => {
            pool.query('SELECT `coordonees` FROM `voie` where `libelle` = "Exploitée";', (err, results) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(results);
                }
            });
        });
    }


    static getVoieByLigne = (ligne) => {

        var ligne = ligne.split("=");
        console.log(ligne[1]);

        return new Promise((resolve, reject) => {
            pool.query('SELECT `coordonees` FROM `voie` WHERE `codeLigne` = ?', [parseInt(ligne[1])], (err, results) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(results);
                }
            });
        });
    }

}

module.exports = voieModel;