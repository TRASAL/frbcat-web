module.exports = {

    databaseURL: process.env.DATABASE_URL || "postgres://postgres@localhost/frbcat",
    csvURL: process.env.CSV_URL || "http://www.frbcat.org/frbcat.csv"

};
