window.onload = function() {
    
    /// BUSCAR MOBILE
    if (screen.width >= 420 && screen.width <= 1023) {
        var inputSearch = document.querySelector(".inputBuscador");
        var lupa = document.querySelector("#lupa");
        var contenedorBuscador = document.querySelector(".buscador");
        var headerCambiar = document.querySelector("header");
        var ulHeaderCambiar = document.querySelector("ulHeader")

        var botonSearch = document.querySelector(".botonSearch");
        botonSearch.classList.add("botonSearchMobile")

        inputSearch.style.display = "none";


        // Click en lupa (abrir input)
        var hiceTodo = false;
        botonSearch.addEventListener("click", function clickLupa(event) {
            if (hiceTodo) {
                hiceTodo = false;
                return;
            }

            event.preventDefault();

            headerCambiar.classList.add("headerRelative");
            inputSearch.style.display = "flex";
            botonSearch.classList.add("botonSearchMobileInputAbierto");
            inputSearch.classList.remove("inputBuscador");
            inputSearch.classList.add("inputBuscadorMobile");

            hiceTodo = true;
            botonSearch.trigger("click");
        })
    }
    // BUSCAR DESKTOP
    else {
        var lupa = document.querySelector("#lupa");
        var inputSearch = document.querySelector(".inputBuscador");
        inputSearch.classList.add("inputBuscadorDesktop");
        var botonSearch = document.querySelector(".botonSearch");
        botonSearch.classList.add("botonSearchDesktop")
        inputSearch.style.visibility = "hidden";

        // Mouse over
        lupa.addEventListener("mouseover", function () {
            inputSearch.style.visibility = "visible";
            inputSearch.style.display = "block";
        })

        // Mouse out
        inputSearch.addEventListener("mouseout", function () {
            inputSearch.style.display = "none";
        });
    }

    // Click en cuenta
    var usuario = document.querySelector("#cuenta");
    usuario.addEventListener("click", function (e) {
        var preguntaCerrarSesion = confirm("¿Estás seguro que deseas cerrar sesión?");
        if (preguntaCerrarSesion) {
            sessionStorage.clear("nombreUsuario");
            console.log(`Usuario: ${sessionStorage.getItem('nombreUsuario')}`);
            window.location.href = "sesion.html"
        }
        else {
            console.log(`El usuario @${sessionStorage.getItem('nombreUsuario')} no cerró sesión`);
            return false;
        }

    })

    var apiKey = `c3dcc0e9ef8f3864ee4f5ed844d151f8`
    var queryStringObj = new URLSearchParams(location.search);    
    var id = queryStringObj.get(`id`);
    var idGen = queryStringObj.get(`idGenero`);
    var idGenPel = queryStringObj.get(`idGeneroPel`);
    var tipo = queryStringObj.get(`tipo`);
        
        if (tipo == "peliculas") {
            
            contenidoMovies ()
        }
        else if (tipo == "series") {

            contenidoSeries ()
        }
        else {
            contenidoGeneros ()
        }
    

// D E T A L L E S      P E L Í C U L A S  
    function contenidoMovies () {
        
        //FETCH DEL DETALLE DE LA PELI
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`) 

            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);

                    var section = document.querySelector(".detalleInfo") 
                    section.innerHTML += `
                    <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" alt="">
                    <div class="info">
                        <h2>
                            ${data.title}
                            <div id="agregarFav" class="uk-icon-link" uk-icon="heart"></div>
                        </h2>
                        <h4 class="pelicula mediaType">Película</h4>
                        <a class="idGenero" href="detalles.html?tipo=generos&idGenero=${data.genres[0].id}">${data.genres[0].name}</a>
                        <p id="especificaciones">Calificación: ${data.vote_average}/10 | ${data.runtime} min. | Estreno: ${data.release_date}</p>
                        <div>
                        <h5>Sinopsis:</h5>
                            <p>${data.overview}</p>
                        </div>`
                
            // WEB STORAGE pelis :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :)
                var corazon = document.querySelector("#agregarFav");
                var idPelisFavoritas = JSON.parse(localStorage.getItem("idPelisFavs"));
                if (idPelisFavoritas == null) {
                    idPelisFavoritas = [];
                }

                // Al cargar la página, si la posición del elemento es mayor a -1 poner el corazón rojo
                if (idPelisFavoritas.indexOf(data.id) > -1) {
                    corazon.classList.add("red");
                }
                // Click en el corazón
                corazon.addEventListener("click", function () {
                    // Si el corazón está en rojo...
                    if (corazon.classList.contains("red")) {
                        this.classList.remove("red");
                        this.classList.add("grey");

                        var indexPelis = idPelisFavoritas.indexOf(data.id);
                        idPelisFavoritas.splice(indexPelis, 1);
                        localStorage.setItem("idPelisFavs", JSON.stringify(idPelisFavoritas));
                        console.log(idPelisFavoritas);
                    }
                    // Si el corazón no está en rojo...
                    else{
                        this.classList.remove("grey");
                        this.classList.add("red");


                        idPelisFavoritas.push(data.id);
                        localStorage.setItem("idPelisFavs", JSON.stringify(idPelisFavoritas));
                        console.log(idPelisFavoritas);
                    }
                });
            })
            .catch(function(error) {
                console.log(`El error fue: ${error}`);          
            })

        // FETCH REVIEWS PELIS
        fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`)

            .then(function(response) {
                return response.json()
            })

            .then(function (data) {
                console.log(data);

                for (let index = 0; index < data.results.length; index++) {
                    const element = data.results[index].author;
                    var contenido = data.results[index].content;
                    
                    var divsinReseña = document.querySelector(".sinReseña")

                    if (data.results.length > 0) {
                        divsinReseña.style.display = "none";
                    }

                    var div = document.querySelector(".todaslasreseñas")
                    div.innerHTML += `
                        <article id="reseña" class="uk-comment uk-comment-primary">
                            
                                <div class="uk-grid-medium uk-flex-middle" uk-grid>
                                    <div class="uk-width-expand">
                                        <h4 class="uk-comment-title uk-margin-remove">${element}</h4>
                                    </div>
                                </div>
                           
                            <div class="uk-comment-body">
                                <p>${contenido}</p>
                            </div>
                        </article>`
                }
            
            })

            .catch(function(error) {
                console.log(`El error fue: ${error}`);
            })

        // FETCH RECOMENDADOS

        fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            var carruselRecomendadas = document.querySelector("#carruselRecomendadas");
            for (let i = 0; i < data.results.length; i++) {
                const element = data.results[i];

                var divsinRecomendaciones = document.querySelector(".sinRecomendaciones")

                if (data.results.length > 0) {
                    divsinRecomendaciones.style.display = "none";
                }

                if (element.poster_path !== null) {
                    carruselRecomendadas.innerHTML += `
                        <li>
                            <a href="detalles.html?tipo=peliculas&id=${element.id}">
                                <img src="https://image.tmdb.org/t/p/original${element.poster_path}">
                            </a>
                        </li>`
                }
            }
        })
        
    }
        
    
    // D E T A L L E S      S E R I E S 
    function contenidoSeries () {
        
        //FETCH DEL DETALLE DE LA SERIE
        fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`) 

        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);

                var section = document.querySelector(".detalleInfo")
                section.innerHTML += `
                <img src="https://image.tmdb.org/t/p/original/${data.poster_path}" alt="">
                <div class="info">
                    <h2>
                        ${data.name}
                        <div id="agregarFav" class="uk-icon-link" uk-icon="heart"></div>
                    </h2>
                    <h4 class="seriemediaType">Serie</h4>
                    <a class="idGenero" href="detalles.html?tipo=generos&id=${data.genres[0].name}">${data.genres[0].name}</a> 
                    <p id="especificaciones">Calificación: ${data.vote_average}/10 | ${data.number_of_seasons} temporadas | Primera emisión: ${data.first_air_date}</p>
                    <div>
                        <h5>Sinopsis:</h5>
                        <p>${data.overview}</p>
                    </div>
                </div>
                `
            // WEB STORAGE series :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :) :)
            var corazon2 = document.querySelector("#agregarFav");
            var idSeriesFavoritas = JSON.parse(localStorage.getItem("idSeriesFavs"));
            if (idSeriesFavoritas == null) {
                idSeriesFavoritas = [];
            }

            // Al cargar la página, si la posición del elemento es mayor a -1 poner el corazón rojo
            if (idSeriesFavoritas.indexOf(data.id) > -1) {
                corazon2.classList.add("red");
            }
            // Click en el corazón
            corazon2.addEventListener("click", function () {
                // Si el corazón está en rojo...
                if (corazon2.classList.contains("red")) {
                    this.classList.remove("red");
                    this.classList.add("grey");

                    var indexSeries = idSeriesFavoritas.indexOf(data.id);
                    idSeriesFavoritas.splice(indexSeries, 1);
                    localStorage.setItem("idSeriesFavs", JSON.stringify(idSeriesFavoritas));
                    console.log(idSeriesFavoritas);
                }
                // Si el corazón no está en rojo...
                else {
                    this.classList.remove("grey");
                    this.classList.add("red");


                    idSeriesFavoritas.push(data.id);
                    localStorage.setItem("idSeriesFavs", JSON.stringify(idSeriesFavoritas));
                    console.log(idSeriesFavoritas);
                }
            });
        })
        .catch(function(error) {
            console.log(`El error fue: ${error}`);          
        })

        // FETCH REVIEWS SERIES
        fetch(`https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`)

        .then(function(response) {
            return response.json()
        })

        .then(function (data) {
            console.log(data);

            for (let index = 0; index < data.results.length; index++) {
                const autor = data.results[index].author;
                var contenido = data.results[index].content;
                 
                var div = document.querySelector(".todaslasreseñas")
                var divsinReseña = document.querySelector(".sinReseña")

                if (data.results.length > 0) {
                    divsinReseña.style.display = "none";
                }

                div.innerHTML += `
                    <article id="reseña" class="uk-comment uk-comment-primary">
                    
                            <div class="uk-grid-medium uk-flex-middle" uk-grid>
                                <div class="uk-width-expand">
                                    <h4 class="uk-comment-title uk-margin-remove">${autor}</h4>
                                </div>
                            </div>
                        
                        <div class="uk-comment-body">
                            <p>${contenido}</p>
                        </div>
                    </article> `
            }
            
        })
        .catch(function(error) {
            console.log(`El error fue: ${error}`);
        })

        // FETCH RECOMENDADOS

        fetch(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var carruselRecomendadas = document.querySelector("#carruselRecomendadas");
            for (let i = 0; i < data.results.length; i++) {
                const element = data.results[i];

                var divsinRecomendaciones = document.querySelector(".sinRecomendaciones")

                if (data.results.length > 0) {
                    divsinRecomendaciones.style.display = "none";
                }

                if (element.poster_path !== null) {
                    carruselRecomendadas.innerHTML += `
                        <li>
                            <a href="detalles.html?tipo=series&id=${element.id}">
                                <img src="https://image.tmdb.org/t/p/original${element.poster_path}">
                            </a>
                        </li>`
                }
            }
        })

    }

    
    
    // D E T A L L E S      G E N E R O S
    var titulo = document.querySelector(".tituloGenero");
    function contenidoGeneros () {

        if (tipo == "generos" && idGen=="28"){
        
            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=28&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`

                    
                    }
                    titulo.innerHTML += `Acción`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        else if (tipo == "generos" && idGen == "10759") {

            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=10759&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`


                    }
                    titulo.innerHTML += `Acción y aventura`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        if (tipo == "generos" && idGen == "12") {

            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=12&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`


                    }
                    titulo.innerHTML += `Aventuras`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        else if (tipo == "generos" && idGen == "10765") {

            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=10765&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`


                    }
                    titulo.innerHTML += `Ciencia ficción`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        if (tipo == "generos" && idGen == "878") {

            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=878&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }
                    titulo.innerHTML += `Ciencia ficción`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        else if (tipo == "generos" && idGen == "35") {

            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=35&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }
                    titulo.innerHTML += `Comedias`
                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        if (tipo == "generos" && idGenPel == "35") {

            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=35&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }
                    titulo.innerHTML += `Comedias`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        else if (tipo == "generos" && idGen == "80") {

            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=80&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`

                        
                    }
                    titulo.innerHTML += `Crimen`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        if (tipo == "generos" && idGen == "99") {

            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=99&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }

                    titulo.innerHTML += `Documentales`
                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        else if (tipo == "generos" && idGen == "99") {

            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=99&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }
                    titulo.innerHTML += `Documentales`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        if (tipo == "generos" && idGenPel == "18") {

            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=18&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }

                    titulo.innerHTML += `Dramas`
                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        else if (tipo == "generos" && idGen == "18") {

            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=18&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=series&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }
                    titulo.innerHTML += `Dramas`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        if (tipo == "generos" && idGenPel == "10751") {

            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=10751&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }
                    titulo.innerHTML += `Familiares`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        else if (tipo == "generos" && idGen == "10751") {

            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=10751&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`


                    }
                    titulo.innerHTML += `Familiares`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        if (tipo == "generos" && idGen == "10749") {

            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=10749&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }

                    titulo.innerHTML += `Romance`
                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        else if (tipo == "generos" && idGen == "9648") {

            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=9648&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`


                    }

                    titulo.innerHTML += `Misterio`
                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        if (tipo == "generos" && idGen == "27") {

            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=27&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }

                    titulo.innerHTML += `Terror`
                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        else if (tipo == "generos" && idGen == "10767") {

            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=10767&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`


                    }

                    titulo.innerHTML += `Reality TV y entrevistas`
                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        if (tipo == "generos" && idGen == "53") {

            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=53&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }
                    titulo.innerHTML += `Thrillers`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        else if (tipo == "generos" && idGen == "10766") {

            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=c3dcc0e9ef8f3864ee4f5ed844d151f8&with_genres=10766&language=en`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    for (let index = 0; index < 20; index++) {
                        const element = data.results[index];
                        var elId = data.results[index].id;

                        var sectionGenero = document.querySelector(".detalleGenero")
                        sectionGenero.innerHTML += `
                    <div class="imagenesGeneros">
                    <a href="detalles.html?tipo=peliculas&id=${elId}"><img src="https://image.tmdb.org/t/p/original${element.poster_path}" alt=""></a>
                    </div>`
                    }
                    titulo.innerHTML += `Telenovelas`

                })
                .catch(function (error) {
                    console.log(`El error fue: ${error}`);
                })
        }

        var divReviews = document.querySelector(".reviews");
        divReviews.style.display = "none";

        var section = document.querySelector(".detalleInfo") 
        section.style.display = "none";
    }

    var texto = document.querySelector (".recomendadas")
    if (tipo == "generos") {
        texto.style.display="none";
    }
    

}