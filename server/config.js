module.exports = {

    databaseURL: process.env.DATABASE_URL || "postgres://postgres@localhost/frbcat",
    csvURL: process.env.CSV_URL || "https://doi.org/10.5281/zenodo.xxxxxxxx"

};
