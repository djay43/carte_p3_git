var flecheGauche = $('#left')
var flecheDroite = $('#right')

//-----------------------Initialisation objet diapo ------------------------
var diapo={

 nbreSlide:$('.step').length,
 nbreNav:1,
 slideVisible: $('.step:first-child')
,
 
checkSpan:function(){
    
        $('span').css('background-color','black')
        $('#'+this.nbreNav).css('background-color','red')	// méthode pour affichage couleur numéro diapo
            
},  
    
    
initDiapo:function(){
    
    $('.step').css('transform','translateX(100%)')
    $('.step:first-child').css('transform','translateX(0)') 				// on initialise positionnement des slides
    
    
        for (i=1;i<=this.nbreSlide;i++){
            $('nav').append("<span id="+i+">" + i + "</span>") 						//On affiche les infos de slides (numéro)
                if (i===this.nbreNav){$('#'+i).css('background-color','red')}
        }

},
    

    
gotoSlideRight:function(numero){
    
    this.slideVisible.css ('transform','translateX(-100%)')
    this.slideVisible=$('#slide'+(numero+1))
    this.slideVisible.css ('transform','translateX(0)')  					// transformation des slides vers la droite
    this.nbreNav=numero+1
    
    this.checkSpan()

  
    
        if(this.nbreNav===this.nbreSlide+1){
                $('.step').css('transform','translateX(100%)')
                this.nbreNav=1
                this.slideVisible=$('#slide'+(this.nbreNav))				//  Si on est à la dernière slide, on revient à la première
                this.slideVisible.css ('transform','translateX(0)')
                this.checkSpan()



           }

    
},
gotoSlideLeft:function(numero){
    
   
    this.slideVisible.css ('transform','translateX(100%)')
    this.slideVisible=$('#slide'+(numero-1))
    this.slideVisible.css ('transform','translateX(0)')					//transformation des slides vers la gauche
    this.nbreNav=numero-1
    
    this.checkSpan()
    
           if(this.nbreNav===0){
               
               $('.step').css('transform','translateX(-100%)')
               this.nbreNav=4
               this.slideVisible=$('#slide'+(this.nbreNav))				//si on est à la première, on va à la dernière
               this.slideVisible.css ('transform','translateX(0)')
               this.checkSpan()


           }
        

}
}




//------------------------initialisation du diapo au lancement de la page--------------

diapo.initDiapo()  


var sliderAuto=setInterval("diapo.gotoSlideRight(diapo.nbreNav)", 5000); // on lance la lecture auto


$('#play_diapo').click(function(){
    $('#pause_diapo').css('color','rgba(0,0,0,0.6)')
    clearInterval(sliderAuto)
    sliderAuto=setInterval("diapo.gotoSlideRight(diapo.nbreNav)", 5000)		// fonctionnement bouton play
})


$('#pause_diapo').click(function(){
    clearInterval(sliderAuto)				//fonctionnement bouton pause
    $('#pause_diapo').css('color','red')

})



//-----------------------Ajout des évènements clavier ---------------------------

document.addEventListener("keydown",function(e){
                          
                            if (e.keyCode===37){
                                clearInterval(sliderAuto)
                                diapo.gotoSlideLeft(diapo.nbreNav)
                                flecheGauche.css('background-color','blue')		//si fleche gauche
                                $('#pause_diapo').css('color','red')
                            }
    
                            else if (e.keyCode===39){
                                clearInterval(sliderAuto)
                                diapo.gotoSlideRight(diapo.nbreNav)					//si fleche droite
                                flecheDroite.css('background-color','blue')

                            }
                          })

document.addEventListener("keyup",function(e){if (e.keyCode===37){
                                flecheGauche.css('background-color','#59A9FF')			//modif couleur des boutons navigations si navigation clavier marche
                            }
    
                            else if (e.keyCode===39){
                                flecheDroite.css('background-color','#59A9FF')

                            }
})

//-------------------------------------ajout des évènements souris--------------------------------------

flecheDroite.click(function(){diapo.gotoSlideRight(diapo.nbreNav)})
flecheGauche.click(function(){diapo.gotoSlideLeft(diapo.nbreNav)})



