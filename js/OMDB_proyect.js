$("document").ready(function () {

    $("#boton").click(buscar);

    $("#mostrarTodas").click(function(){
        $("#peli").val("a");
        $.get("http://www.omdbapi.com/?s=a&y=&plot=short&r=json&type=movie&page=1", function (data, status) {
            if (status == "success") {
                $("#loader").hide();
                mostrarResultados(data);
            } else {
                $("#loader").html('<img class="img-fluid" src="img/lightbox/loader01.gif" alt="Loader">');

            }
        });
    });
    document.getElementById("notFound").style.visibility = "hidden";



    win = $(window);
    pagina = 1;


    // Each time the user scrolls
    win.scroll(function() {
        // End of the document reached?
        if ($(document).height() - win.height() == win.scrollTop()) {
            pagina++;
            peticionAjax(pagina);
        }
    });

    $(document).on({
        ajaxStart: function(){$("body").addClass("loading");},
        ajaxStop: function(){$("body").removeClass("loading");}
    });


});

function buscar() {
    pagina = 1;
    peticionAjax(pagina);
}
function peticionAjax(pagina){
    var peli = $("#peli").val();
    var anio = $("#anio").val();
    $.get("http://www.omdbapi.com/?s=" + peli + "&y=" + anio + "&plot=short&r=json&type=movie&page="+pagina, function (data, status) {
        if (status == "success") {
            /*$("#loader").hide();*/
            mostrarResultados(data);
        } else {
            /*$("#loader").html('<img class="img-fluid" src="img/lightbox/loader01.gif" alt="Loader">');*/

        }
    });
}


function mostrarResultados(data) {
    var containerPelis = $(".pelis");
    //limpiamos en cada busqueda
    if (pagina ==1){
        containerPelis.html("");
    }

    //Si no hay pelis pone un mensaje. Si hay pelis las muestra
    var notFound = document.getElementById("notFound");
    if (data.Search == undefined) {
       notFound.style.visibility = "visible";
    } else {
        notFound.style.visibility = "hidden";


        var cont = -1;
        for (var i = 0; i < data.Search.length; i++) {
            cont++;
            //crear fila nueva cada 4 pelis
            if (cont == 0) {
                var fila = document.createElement("div");
                fila.setAttribute("class", "row");
                containerPelis.append(fila);
            }
            if (cont == 3) {
                cont = -1;
            }

            //Peli es el objeto dentro del array dentro del json que corresponde a cada pelicula.
            var peli = data.Search[i];


            var cardblocktitle = document.createElement("h4");
            cardblocktitle.setAttribute("class", "card-title");
            cardblocktitle.innerHTML = peli.Title;


            var cardblock = document.createElement("div");
            cardblock.setAttribute("class", "card-block");
            cardblock.appendChild(cardblocktitle);

            var cardimg4 = document.createElement("div");
            cardimg4.setAttribute("class", "mask");
            var cardimg3 = document.createElement("a");
            cardimg3.appendChild(cardimg4);

            var cardimg2 = document.createElement("img");
            cardimg2.setAttribute("class", "img-fluid ");
            //Si no tiene imagen, le pongo yo una
            if(peli.Poster == "N/A"){
                cardimg2.src = "img/noimage.png";
            }else{
                cardimg2.src = peli.Poster;
            }


            var cardimg1 = document.createElement("div");
            cardimg1.setAttribute("class", "view overlay hm-white-slight");
            cardimg1.appendChild(cardimg2);
            cardimg1.appendChild(cardimg3);

            var card = document.createElement("div");
            card.setAttribute("class", "card");
            card.appendChild(cardimg1);
            card.appendChild(cardblock);

            var cardcol = document.createElement("div");
            //Las ultimas dos peliculas las pone mas grande para que cuadre la plantilla
            if(i == 8 || i == 9){
                cardcol.setAttribute("class", "col-md-6 animated fadeIn")
            }else{
                cardcol.setAttribute("class", "col-md-3 animated fadeIn")
            }

            cardcol.appendChild(card);

            fila.appendChild(cardcol);
        }
    }
}

