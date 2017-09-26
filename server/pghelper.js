"use strict";

let pg = require('pg'),
    config = require('./config'),
    databaseURL = config.databaseURL;

exports.query = function (sql, values, singleItem, Log) {

    if (Log) {
        console.log(sql, values);
    }
    return new Promise((resolve, reject) => {
        const pool = new pg.Pool({
          connectionString: databaseURL,
        })
        pool.connect(function (err, conn, done) {
            if (err) return reject(err);
            try {
                conn.query(sql, values, function (err, result) {
                    done();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(singleItem ? result.rows[0] : result.rows);
                    }
                });
            }
            catch (e) {
                done();
                reject(e);
            }
        });
      // pool shutdown
      pool.end()
    });

};
