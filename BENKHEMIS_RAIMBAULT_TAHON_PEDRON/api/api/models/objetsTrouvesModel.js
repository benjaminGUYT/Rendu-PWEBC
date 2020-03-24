const pool = require('./dbConn')

class gareModel {
    static initObjetsTrouves = (body) => {
        var id = body.recordid;
        var code_uic = body.fields.gc_obo_gare_origine_r_code_uic_c;
        var nature = body.fields.gc_obo_nature_c;
        var type = body.fields.gc_obo_type_c;
        var date = new Date(body.fields.date);

        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO `objetstrouves` (id, code_uic, nature, type, date) ' +
                'VALUES(?,?,?,?,?)', [id, code_uic, nature, type, date], (err, results) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve();
                    }
                });
        });
    }

    static getObjetsTrouvesByGare = (gare) => {

        var codeUIC = gare.split("=");
        console.log(codeUIC[1]);

        return new Promise((resolve, reject) => {
            pool.query('SELECT COUNT(*) AS `nb` FROM `objetstrouves` WHERE `code_uic` = ?', [parseInt(codeUIC[1])], (err, results) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(results);
                }
            });
        });
    }

    static getObjetsTrouvesByTotal = () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT COUNT(*) as `nb` FROM `objetstrouves`;', (err, results) => {
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