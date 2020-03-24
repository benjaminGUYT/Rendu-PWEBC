const pool = require('./dbConn')
const najax = $ = require('najax');

class gareModel {


    static getGaresFromAPI = () => {
        var result = najax.get('https://ressources.data.sncf.com/api/records/1.0/search/?dataset=liste-des-gares&rows=10000');
        result = JSON.parse(result);
        return result;
    }


    static initGare = (gare) => {

        var codeUIC = gare.code_uic;
        var fret = gare.fret;
        if (fret === 'N') fret = false;
        else fret = true;
        var voyageurs = gare.voyageurs;
        if (voyageurs === 'N') voyageurs = false;
        else voyageurs = true;
        var codeLigne = gare.code_ligne;
        var libelle = gare.libelle;
        var commune = gare.commune;
        var departement = gare.departement;
        var x = gare.x_wgs84;
        var y = gare.y_wgs84;

        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO `gare` (codeUIC, fret, voyageurs, codeLigne, libelle, commune, departement, x, y) ' +
                'VALUES(?,?,?,?,?,?,?,?,?)', [codeUIC, fret, voyageurs, codeLigne, libelle, commune, departement, x, y], (err, results) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve();
                    }
                });
        });
    }

    static getGares = () => {

        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM `gare`;', (err, results) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(results);
                }
            });
        });
    }

    static getGaresVoyageur = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM `gare` WHERE `voyageurs` = ?", [1], (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }

    static getGaresFret = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM `gare` WHERE `fret` = ?", [1], (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }

    static getGaresByDpt = (dpt) => {

        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM `gare` WHERE `departementGare` = ?;', [dpt], (err, results) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(results);
                }
            });
        });
    }

    static getGareByTotal = () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT COUNT(*) as `nb` FROM `gare`;', (err, results) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(results);
                }
            });
        });
    }
}

module.exports = gareModel;