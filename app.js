
// ------------Génération de la carte --------------- 

sessionStorage.clear() //On vide le session storage
var map = L.map('map').setView([45.745, 4.8611], 15)

        var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { 
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        });
    
        map.addLayer(osmLayer);


    /*---Déclaration objet pour test formulaire et récupération des de l'identité de l'utilisateur-----*/


// ------------Définition de l'objet formulaire et de ses méthodes--------------

var reservationForm ={

    testNom:document.getElementById("nomUtilisateur"),
    testPrenom:document.getElementById("prenomUtilisateur"),
    
    reservationTimer:function (){

            var button = document.getElementById('annuler')

            var  minLeft = 1200;
            var secLeft=60

                    var timerID = setTimeout(function() { // On crée notre compte à rebours

                        clearInterval(intervalID);

                        button.innerHTML = "<p>Reservation expirée</p>";


                    }, 1200000)


                    var intervalID = setInterval(function() { // On met en place l'intervalle pour afficher la progression du temps
                        
                        button.innerHTML = "<p>Annuler la réservation(" + parseInt(--minLeft/60) + " minutes" + " et "+ --secLeft + " secondes)</p>" 
                            if (secLeft===0){
                                secLeft=60//On réinitialise le décompte des secondes
                            } 



                    }, 1000)


                    button.addEventListener('click', function() {

                        clearTimeout(timerID) // On annule le compte à rebours

                        clearInterval(intervalID)// Et l'intervalle
                        button.innerHTML = "<p>Reservation annulée</p>";

                        alert("La réservation a bien été annulée.")
                        


                    })
                 $('#reserver').click(function(event){

                        clearTimeout(timerID) // On annule le compte à rebours

                        clearInterval(intervalID)// Et l'intervalle
                                            })
           
                        
            },


    verifForm:function (){

        if (reservationForm.testPrenom.value.length>1 && reservationForm.testNom.value.length>1 && sessionStorage.getItem('signOk')!=null){ //on vérifie que les champs sont valides
            
            $('#temps_restant').css('display','block')//on affiche le bloc de compte à rebours
            $('.reservation').css("display","none")//on enlève le formulaire
            this.reservationTimer()//on lance le compte à rebours

            localStorage.nomSauv=reservationForm.testNom.value
            localStorage.prenomSauv=reservationForm.testPrenom.value

            var recupNom=localStorage.getItem('nomSauv')+" "
            var recupPrenom=localStorage.getItem('prenomSauv')+" "

            $('#temps_restant span').html("<p>Merci "+recupPrenom+recupNom+" d'avoir réservé! Votre vélo vous attend à l'adresse <br>"+"<strong>"+ sessionStorage.getItem("adresseResa")+"</strong>")
            $('#temps_restant h2').html("<h2>Réservation</h2>")


            sessionStorage.positionResa=sessionStorage.getItem("positionMarqueur")
            var resaEnCours=sessionStorage.getItem('veloDispo')-1           //on enlève un vélo
            $('#velos_disponibles').html(" <p><strong>Vélos disponibles:</strong></p>"+resaEnCours+" <em>(un vélo en réservation)</em>")

            canvas.clearCanvas() //appel de la fonction pour effacer le canvas
            reservationForm.testNom.value=""  //On réinitialise les champs
            reservationForm.testPrenom.value=""
            $("#erreur").html("")

        }

        else if(reservationForm.testPrenom.value.length<2 || reservationForm.testNom.value.length<2 ||  sessionStorage.getItem('signOk')==null){

            $("#erreur").html("<strong>Tous les champs doivent être renseignés!</strong>")// si champ mal renseigné message d'erreur

        }   

      }


}

/*-----------------on charge et on traite les données JSON--------------------*/

var jsonContent= {
    
    urlContrat : 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=cb18f6d88718a76b828bdc5805d5d61aefb250d4',
    recupInfos : new XMLHttpRequest(),
}


var station ={
    adresse:"",
    latitude:0,
    longitude:0,
    velosLibres:0,
    emplacementDispo:0,
    statut:""
    
}


jsonContent.recupInfos.onload = function () {
    
    var donneesDynamiques = JSON.parse(this.responseText);
    
            // on parcoure le json et on génère les marqueurs 
    for (i=0;i<donneesDynamiques.length;i++){
        
        var marker = L.marker([donneesDynamiques[i].position.lat, donneesDynamiques[i].position.lng])
        marker.addTo(map)
        marker.bindPopup("<strong>Louez-moi!</strong><br>" + donneesDynamiques[i].address+"<br>").openPopup();
        
        
        /*-----Ajout d'un évènement click-------Récupération des infos du marqueur et affichage des infos stations------*/
        
        
        marker.addEventListener("click",function(){
        
             for (j=0;j<donneesDynamiques.length;j++){
                
             $("#infos_dynamiques").css('display','block')
            
                 
             station.adresse=donneesDynamiques[j].address
             station.latitude=donneesDynamiques[j].position.lat
             station.veloDispo=donneesDynamiques[j].available_bikes                 //mis à jour infos objet station
             station.emplacementDispo=donneesDynamiques[j].available_bike_stands
             station.statut=donneesDynamiques[j].status
            



                 if (this._latlng.lat===station.latitude){// on récupère les infos du marqueur sélectionné via la latitude du json
                            sessionStorage.adresseResa=station.adresse

                    sessionStorage.veloDispo=station.veloDispo
                    sessionStorage.positionMarqueur=station.latitude
                     
                    $('#points_attaches').css('color','black')
                    $('#velos_disponibles').css('color','black')// On redéfinie la couleur noir si jamais on est passé sur un emplacement non disponible avant
                     
                    $('#adresse').html("<p><i class=\"fas fa-map-marked-alt\"></i></p>"+"<strong>Adresse: </strong>"+station.adresse)// et on affiche toutes les infos
                    $('#points_attaches').html("<i class=\"fas fa-bicycle\"></i><p/><p><strong>Points d'attaches opérationnels: </strong>"+station.emplacementDispo)
                    $('#velos_disponibles').html("<strong>Vélos disponibles: </strong>"+station.veloDispo)            
                    $('#statut').html("<p><i class=\"fas fa-lock-open\"></i></p><strong>Statut de la station: </strong>"+station.statut+"<br/> <br/>")
                     
                     
                     
                     /* on vérifie que les champs du formulaire soient bien remplis et si oui on enlève un vélo et on affiche un message---*/
                                            
                                            $('#reserver').click(function(event){

                                                reservationForm.verifForm()  //Onverifie que le formulaire est bien rempli et on affiche le temps de réservation                          
                                
                                                sessionStorage.removeItem('signOk') //Vérificatio signature Ok, on efface le booléen

                                            })
                     
                                                    /* Si l'on va sur un autre marqueur et qu'on revient, notre réservation est toujours affiché-----*/
                                            if (sessionStorage.getItem("positionResa")===sessionStorage.getItem("positionMarqueur" )){

                                               var dejaReserve=sessionStorage.getItem('veloDispo')-1
                                               $('#velos_disponibles').html(" <p><strong>Vélos disponibles:</strong></p>"+dejaReserve+"<em> (Vous avez déjà réservé un vélo ici!)</em>")
                                           }

                    /*-------On vérifie l'état de la station pour afficher ou non le bouton de résevation ---------*/
                     
                     
                     if (station.veloDispo>0 && station.emplacementDispo>0){
                        $('#bouton').html("<button type=\"button\" class=\"btn btn-success\"\">Réserver</button>")
                        $('#bouton').css('display','block')

                     }
                     else if (station.veloDispo==0)
                         {
                             $('#bouton').css('display','none')
                             $('#velos_disponibles').css('color','red')

                         }
                     
                     
                     else if (station.emplacementDispo==0){
                     $('#bouton').css('display','none')
                     $('#points_attaches').css('color','red')
                     }
                     
                 } //on ferme le test de latitude
                 
             }                   
        })             
        
    }       
}




jsonContent.recupInfos.open('GET', jsonContent.urlContrat, true);
jsonContent.recupInfos.send(null)











