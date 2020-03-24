$(document).ready(function() {

    /* Variable d'état du service gare */
    var gareIsSet = false;
    /* Tableau contenant l'affichage des gares */
    var tabCercle = [];
    /* Tableau contenant l'affichage des voies */
    var tabVoie = [];

    const localisation = $("#localisation");
    const boutonGares = $("#boutonGares");
    const boutonVoies = $("#boutonVoies");
    const mymap = L.map('mapid', { loadingControl: true }).setView([48.841793, 2.268291], 16);

    /* Changement de layer leaflet */
    L.tileLayer.provider('Stamen.Watercolor').addTo(mymap);

    /* Evenemetn au clique du bouton gare */
    boutonGares.on({
        click: function(event, ui) {
            console.log("Commande transmise");
            /* Affichage du layer de chargement */
            L.tileLayer.provider('Stamen.TonerBackground').addTo(mymap);
            /* Récupération de toutes les gares accueillant des voyageurs */
            $.ajax({
                type: 'GET',
                url: 'http://localhost:3000/gare/getby/garesVoyageur',
                dataType: 'text',
                success: function(data) {
                    /* Si le service n'a pas déjà été affiché */
                    if (!gareIsSet) {
                        let tabGare = JSON.parse(data)
                        console.log("Début de l'ajout des gares");
                        for (var i in tabGare) {
                            if (tabGare[i].y !== undefined &&
                                tabGare[i].x !== undefined) {
                                /* La géolocalisation de la gare */
                                let latlng = L.latLng(tabGare[i].y, tabGare[i].x);
                                /* Le sercle permettant de l'afficher sur la carte */
                                let cercle = L.circle(latlng, { radius: 200, color: "#EB5C56" });
                                /* L'identifiant de la gare */
                                let codeUIC = tabGare[i].codeUIC;
                                /* Le nom de la gare */
                                let libelle = tabGare[i].libelle;
                                /* Le popup relatif à cette gare */
                                let popup = L.popup()
                                    .setLatLng(latlng)
                                    /* Au clique sur une gare, on ajoute des elements dans le popup */
                                cercle.on("click", async function() {
                                    let departures;
                                    let nbObjets;
                                    /* Récupération du prochain départ */
                                    try {
                                        await $.ajax({
                                            type: 'GET',
                                            url: 'https://api.sncf.com/v1/coverage/sncf/stop_areas/stop_area:OCE:SA:' + codeUIC + '/departures/?key=4acaa406-baec-49ba-a26c-4597a6d71651',
                                            dataType: 'text',
                                            success: function(data) {
                                                console.log("Prochain départ récupéré");
                                                data = JSON.parse(data);
                                                try {
                                                    departures = data.departures[0].display_informations.direction;
                                                } catch (e) {
                                                    departures = 'Non définie';
                                                }
                                            },
                                        });
                                    } catch (e) {
                                        departures = 'Non définie';
                                    }

                                    /* Récuperation du nombre d'objets trouvés dans cette gare */
                                    try {
                                        await $.ajax({
                                            type: 'GET',
                                            url: 'http://localhost:3000/objetsTrouves/getObjetsTrouvesByGare/gare=' + codeUIC,
                                            dataType: 'text',
                                            success: function(data) {
                                                console.log("Objets trouvés récupérés");
                                                data = JSON.parse(data);
                                                nbObjets = data.nb;
                                                if (nbObjets > 0) {
                                                    /* Si des objets ont été trouvé dans cette gare, on change la couleur du cerlce associé */
                                                    cercle.setStyle({ color: "#390002" });
                                                }
                                            },
                                        })
                                    } catch (e) {
                                        nbObjets = 'Non défini';
                                    }

                                    /* Gestion de l'affichage, ce composant utilise le meme fichier css sur le index.html */
                                    popup.setContent('<link rel="stylesheet" type="text/css" href="./Sanstitre-1.css" /></style>' +
                                        '<h1>' + libelle + '</h1></br>' +
                                        '<li>Prochaine départ :<br><p>' + departures + '</p></li>' +
                                        '<li>Nombre d\objets trouvés en 2k20 :</br><p>' + nbObjets + '</p></li>');
                                });
                                /* On lie le popup au cercle */
                                cercle.bindPopup(popup);
                                /* On l'ajoute dans le tableau correspondant */
                                tabCercle.push(cercle);
                                /* On l'affiche sur la carte */
                                cercle.addTo(mymap);
                            }
                        }

                        console.log("Fin de l'ajout des gares");

                        gareIsSet = true;
                        /* Modification de l'angle de vue de la carte */
                        mymap.setView([46.227638, 2.213749], 6);
                    } else {
                        /* Si l'option a déjà été affichée, alors on supprime toutes les gares de la carte */
                        for (var i in tabCercle) {
                            let marker = tabCercle[i];
                            marker.removeFrom(mymap);
                        }

                        gareIsSet = false;
                    }
                    /* Affichage du layer de fin du chargement */
                    L.tileLayer.provider('Stamen.Watercolor').addTo(mymap);
                }
            });
        }
    })


    /* Affichage de la température suivant le point sur lequel on clique sur la carte */
    mymap.on({
        click: async function(e) {
            L.tileLayer.provider('Stamen.TonerBackground').addTo(mymap);
            var retour;
            var long = e.latlng.lng.toFixed(6);
            var lat = e.latlng.lat.toFixed(6);
            var popup = L.popup();
            let meteo = await $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=f819f3fe6df7bd5529d0e352595b5c15',
                type: 'GET',
                dataType: 'json',

                success: function(data) {
                    retour = data.main.temp;
                    popup
                        .setLatLng(e.latlng)
                        .setContent('<link rel="stylesheet" type="text/css" href="./Sanstitre-1.css" /></style>' +
                            '<h1>Temperature : ' + (retour - 273.15).toFixed(2) + '°c</h1>')
                        .openOn(mymap);
                    L.tileLayer.provider('Stamen.Watercolor').addTo(mymap);
                }
            });

        }
    })


    /* Evenemetn au clique du bouton gare */
    boutonVoies.on({
        click: async function(e) {
            /* Gestion de l'affichage différent mais fonctionnant de la même façon */
            var isSet = false;
            if (tabVoie.length > 0) {
                isSet = true;
            }
            if (!isSet) {
                L.tileLayer.provider('Stamen.TonerBackground').addTo(mymap);
                try {
                    await $.ajax({
                        type: 'GET',
                        url: 'http://localhost:3000/voie/get',
                        dataType: 'text',
                        success: function(data) {
                            console.log("Lignes récupérées");
                            data = JSON.parse(data);
                            for (var i in data) {
                                let voie = data[i];
                                for (var i in voie) {
                                    var ll = voie[i];
                                    ll = ll.split(',');
                                    var tableau = [];
                                    /* Formatage des données récupérées */
                                    for (var i in ll) {
                                        var test;
                                        test = ll[i].replace('[', '').replace(']', '').replace(' ', '').replace('"', '').replace('[', '').replace(']', '').replace(' ', '').replace('"', '');
                                        test = parseFloat(test);
                                        tableau.push(test);
                                    }
                                    var tabLatLng = [];
                                    for (i = 0; i < tableau.length; i += 2) {
                                        try {
                                            var latln = L.latLng(tableau[i + 1], tableau[i]);
                                            tabLatLng.push(latln);
                                        } catch (e) {

                                        }
                                    }
                                    /* Afficage de la voie directement à la création de l'objet polyline */
                                    let polyline = L.polyline(tabLatLng, { color: "#EB5C56" }).addTo(mymap);;
                                    tabVoie.push(polyline);
                                }
                            }
                            console.log(tabVoie.length);
                            L.tileLayer.provider('Stamen.Watercolor').addTo(mymap);
                            mymap.setView([46.227638, 2.213749], 6);
                        },

                    })
                } catch (e) {
                    voies = 'NULL';
                }

            } else {

                for (var i in tabVoie) {
                    let voie = tabVoie[i];
                    voie.removeFrom(mymap);
                }

                tabVoie = [];
            }

        }
    })

    /* Evenemetn au clique du bouton localisation */
    localisation.on({
        click: function(e) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(data) {
                        mymap.setView([data.coords.latitude, data.coords.longitude], 6);
                        var cooords = L.latLng(data.coords.latitude, data.coords.longitude);
                        let marker = L.marker(L.latLng(data.coords.latitude, data.coords.longitude));
                        marker.addTo(mymap);

                        $.ajax({
                            url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + data.coords.latitude + '&lon=' + data.coords.longitude,
                            type: 'GET',
                            success: function(data) {
                                console.log(data);
                                let popop = L.popup()
                                    .setLatLng(cooords)
                                    .setContent('<link rel="stylesheet" type="text/css" href="./Sanstitre-1.css" /></style>' +
                                        '<h1>' + data.address.country + '</h1></br>' +
                                        '<li>Code postal :<br><p>' + data.address.postcode + '</p></li>' +
                                        '<li>Région :</br><p>' + data.address.state + '</p></li>' +
                                        '<li>Ville :</br><p>' + data.address.village + '</p></li>');
                                marker.bindPopup(popop);
                                popop.openOn(mymap);
                            }
                        });

                    }
                );
            } else {
                console.log("fail");
            }
        }
    });



});