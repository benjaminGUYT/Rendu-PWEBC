const http = require('http')
const app = require('./index')

/* Création du serveur */
const port = process.env.PORT || 3000
const server = http.createServer(app)
console.log('serveur créé, écoute sur le port ' + port)
    /* Mise en écoute du serveur */
server.listen(port)