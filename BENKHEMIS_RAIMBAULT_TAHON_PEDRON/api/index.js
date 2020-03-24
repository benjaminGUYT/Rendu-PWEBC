require('dotenv').config()

/* Imports */
const express = require('express')
const bodyparser = require('body-parser')

const app = express()

/* */
const cors = require('cors')
app.use(cors())

/* */
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

/* Gestion des différentes routes disponibles */
const gareRoute = require('./api/routes/gareRoute')
app.use('/gare', gareRoute)
const objetsTrouvesRoute = require('./api/routes/objetsTrouvesRoute')
app.use('/objetstrouves', objetsTrouvesRoute)
const voieRoute = require('./api/routes/voieRoute')
app.use('/voie', voieRoute)


// si aucune des routes n'a ete emprunter alors elle n'existe pas 
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404
    next(error)
})

// si l'erreur vient d'une route non existante alors statut 404 sinon 500 pour erreur serveur si elle provient d'une route
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;