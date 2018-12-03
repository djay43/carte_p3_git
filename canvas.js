// -------------------------------------------------------------------définition objet canvas------------------------------------------------


var canvas={

     signature: document.getElementById("signature"),
     context: this.signature.getContext('2d'),
     newX:new Array(),
     newY:new Array(),
     dessin:false,
    
     clearCanvas:function(){
        var largeurCanvas=document.getElementById("signature").width
        var hauteurCanvas=document.getElementById("signature").height
        canvas.context.clearRect(0, 0,largeurCanvas, hauteurCanvas)  //réinitialisation du canvas au click
        canvas.newX.clear() 
        canvas.newY.clear() 
        },

     ajoutCoord:function  (x,y, sourisUp){
          canvas.newX.push(x)
          canvas.newY.push(y)
        },

    dessiner: function  (){
        for (i=0;i<canvas.newX.length;i++){

                    canvas.context.beginPath()
                    canvas.context.moveTo(canvas.newX[i-1], canvas.newY[i-1])
                    canvas.context.lineTo (canvas.newX[i],canvas.newY[i])
                    canvas.context.stroke()
                }
    }

}


 Array.prototype.clear = function() { 
    this.splice(0, this.length)
 }   






/*-----------Gestion des évènements souris---------------------*/

    $("#signature").mousedown(function(event){ 
        
        var x= event.pageX-this.offsetLeft
        var y= event.pageY-this.offsetTop         //récupération des coordonnées et insertion dans le tableau  
        canvas.dessin=true
        canvas.ajoutCoord(x,y)
        sessionStorage.signOk=true //Vérification signature formulaire
        
    })
        

    $("#signature").mousemove(function(event){ 
            
        if(canvas.dessin===true){
            var x= event.pageX-this.offsetLeft
            var y=event.pageY-this.offsetTop     // <si souris est enfoncée on récupération les coordonnées et on dessine grâce à l'array
            canvas.ajoutCoord(x,y)
            canvas.dessiner()
            
        }  
    })



    $("#signature").mouseup(function(event){ 
    canvas.dessin=false                                 // si on relâche on efface le tableau et modifie le booléen
    canvas.newX.clear() 
    canvas.newY.clear() 
    })


    $("#signature").mouseleave(function(event){ 
        
        canvas.dessin=false                                      //Si on sort du canvas on modifie le booléen
    })
    



$('#bouton').click(function(){
    $('.reservation').css("display","block") //Affichage du formulaire au click
    scroll(0, 1200)

})


$('#init').click(function(){
    
    canvas.clearCanvas()
    sessionStorage.removeItem('signOk') // le booléen
})


