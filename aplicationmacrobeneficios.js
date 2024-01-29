// Declaracion de Variables auxiliares 
var provDefault = 'ProvinciadeBuenosAires';
var provinciaActual = provinciaMapping[provDefault.toLowerCase()];
var categorias;
var localidades;
var nucleadores;

//  Declaracion de Variables auxiliares para URL de servicios
let urlServicios = {
    url_servicio_categoria: "",
    url_servicio_promociones_lista: "",
    url_servicio_localidades: "",
    url_servicio_predictivo: "",
    url_servicio_logo: "",
    url_servicio_client_id: "",
    url_servicio_promocion_detalle: "",
    url_endpoint: ""
}

// Valida Parametros en URL
var validateParams = () => {
    let queryString = window.location.search;
    let urlParams;
    if (queryString.trim() != "") {
        urlParams = new URLSearchParams(queryString);
        return { is: true, params: urlParams };
    }
    return { is: false };
}

// Obtiene el Key de la provincia 
var getProvinciaKey = provincia => {
    let keyProvincia;
    for (let i in provinciaMapping) {
        if (provinciaMapping[i].provinceNeutral == provincia) {
            keyProvincia = i;
        }
    }
    return keyProvincia;
}

// Inserta Provincia
var setProvincia = (key) => {
    let auxkey;

    if (key == null) {
        auxkey = 'BuenosAires';
    } else {
        auxkey = key;
    }

    let keyProvincia = auxkey.replace(/ /g, '');
    keyProvincia = keyProvincia.replaceAll(" ", "").toLowerCase();
    provinciaActual = provinciaMapping[keyProvincia.normalize("NFD").replace(/[\u0300-\u036f]/g, "")];
}

// Obtiene Provincias
var getProvincias = () => {
    let provincesArray = [];
    for (let i in provinciaMapping) {
        provincesArray.push($.parseHTML(provinciaMapping[i].provinceNeutral)[0].data);
    }
    return provincesArray;
}

// Obtiene Categorias
var getCategorias = () => {
    return $.ajax({
        url: urlServicios.url_servicio_categoria,
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json; charset=utf-8",
            "x-ibm-client-id": urlServicios.url_servicio_client_id
        }
    });
}

// Obtiene Nombres de Provincias para predictrivo
var getNamesProvincia = () => {
    let provincesArray = [];
    for (let i in provinciaMapping) {
        provincesArray.push($.parseHTML(provinciaMapping[i].provinceNeutral)[0].data);
    }
    return provincesArray;
};

var getProvinceNameByCode = (code) => {
    for (let i in provinciaMapping) {
        if (provinciaMapping[i].provinceIsoCode === code) {
            return $.parseHTML(provinciaMapping[i].provinceDisplayName);
        }
    }
}

// Obtiene Localidades
var getLocalidades = () => {

    let auxkey;

    if (provinciaActual == null) {
        auxkey = 'CABA';
    } else {
        auxkey = provinciaActual.provinceIsoCode;
    }

    let servicioURL = urlServicios.url_servicio_localidades + auxkey;
    return $.ajax({
        url: servicioURL,
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json; charset=utf-8",
            "Cache-Control": "no-cache",
            "x-ibm-client-id": urlServicios.url_servicio_client_id
        }
    });
};

// Obtiene Nombre de Localidades para predictivo
var getLocalidadName = () => {
    let localidadesArray = [];
    for (let i in localidades) {
        localidadesArray.push($.parseHTML(localidades[i].displayName)[0].data);
    }
    return localidadesArray;
};


var createContainerGenerico = (clase) => {
    let contenedor = document.createElement("div");
    contenedor.setAttribute("class", clase);
    return contenedor;
};

var createContainerMasBeneficios = () => {
    let contenedor = document.createElement("div");
    contenedor.setAttribute("class", "collapse");
    contenedor.setAttribute("id", "mas-beneficios");
    return contenedor;
};

var createBtnMas = () => {
    let contenedor = document.createElement("div");
    contenedor.setAttribute("class", "row justify-content-center");
    let boton = document.createElement("a");
    boton.setAttribute("class", "btn bg-color-18");
    boton.setAttribute("data-toggle", "collapse");
    boton.setAttribute("href", "#mas-beneficios");
    boton.setAttribute("role", "button");
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-controls", "mas-categorias");
    boton.innerHTML = "Ver m&aacute;s beneficios";
    contenedor.appendChild(boton);
    return contenedor;
}

var createContainerDesktop = () => {
    let contenedor = document.createElement("div");
    contenedor.setAttribute("class", "cards-beneficios d-md-block d-sm-none");
    return contenedor;
};

var createContainercollapse = () => {
    let contenedor = document.createElement("div");
    contenedor.setAttribute("class", "cards-beneficios d-md-block d-sm-block");
    return contenedor;
};
var createContainerMovile = () => {
    let contenedor = document.createElement("div");
    contenedor.setAttribute("class", "cards-beneficios mx-auto my-auto d-md-none d-sm-block");
    return contenedor;
};

var createSlider = (id) => {
    let contenedor = document.createElement("div");
    contenedor.setAttribute("id", id);
    contenedor.setAttribute("class", "carousel slide carousel-multi-item carousel-beneficios");
    contenedor.setAttribute("data-ride", "carousel");
    contenedor.setAttribute("wrap", "true");
    return contenedor;
}

var createContainerSlides = () => {
    let contenedor = document.createElement("div");
    contenedor.setAttribute("class", "carousel-inner row w-100 mx-auto");
    return contenedor;
}

var createContainerCard = (id, type) => {
    let contenedor = document.createElement("div");
    contenedor.setAttribute("id", id);
    contenedor.setAttribute("class", "card");

    if (type != "slider") {
        contenedor.setAttribute("class", "card card-hide");
        //contenedor.setAttribute("style","width: 15rem;");
    }
    return contenedor;
};

var createCardBody = () => {
    let contenedor = document.createElement("div");
    contenedor.setAttribute("class", "card-body");
    return contenedor;
}

var setImageCategoria = (data) => {
    let urlImg = getUrlImageCategoria(data, urlServicios.url_servicio_logo);
    let categoria = document.createElement("div");
    categoria.setAttribute("class", "card-tag-rubro bg-color-22");
    let image = document.createElement("img");
    image.setAttribute("src", urlImg);
    image.setAttribute("style", "max-width: 33px;");
    image.setAttribute("alt", data);
    categoria.appendChild(image);
    return categoria;
}

var setImageComercio = (data) => {
    if (validateLogo(data.promLogo)) {
        let urlImg = getUrlImage(data, urlServicios.url_servicio_logo);
        let comercio = document.createElement("div");
        comercio.setAttribute("class", "card-logo-comercio");
        let image = document.createElement("img");
        image.setAttribute("src", urlImg);
        image.setAttribute("alt", data.displayName);
        image.setAttribute("style", "max-width:100%; height:100px;")
        comercio.appendChild(image);
        return comercio;
    } else {
        let h5 = document.createElement("h5");
        h5.setAttribute("class", "card-title");
        h5.setAttribute("style", "max-width: 100%; height: 100px; margin-top: 10px; padding-top: 45px; color: #092f57;font-weight: bold;font-size: 1.0rem;");
        h5.innerHTML = data.promId.split(0, 30);
        return h5;
    }
}

var setTitulo = (text) => {
    let titulo = document.createElement("h6");
    titulo.setAttribute("class", "card-title");
    titulo.innerHTML = text;
    return titulo;
}

var setDescuento = (text) => {
    let descuento = document.createElement("h5");
    descuento.setAttribute("class", "card-subtitle mb-2 text-muted");
    descuento.innerHTML = text;
    let texto = document.createElement("p");
    return descuento;
}

var setTexto = (clase, text) => {
    let texto = document.createElement("p");
    texto.setAttribute("class", clase);
    texto.innerHTML = text;
    return texto;
}

var setDestacado = () => {
    let destacado = document.createElement("div");
    destacado.setAttribute("class", "tag bg-color-18");
    destacado.innerHTML = "<span>Destacado</span>";
    let icono = document.createElement("i");
    let img = document.createElement("img");
    img.setAttribute("src", "/imagen/exclamation.png");
    icono.appendChild(img);
    destacado.appendChild(icono);
    return destacado;
}

var setDestacadoFondoAzul = (card) => {

    card.setAttribute("class", "card back-grad-sky");
    return card;
}

var setDestacadoBadge = () => {
    let destacado = document.createElement("div");
    destacado.setAttribute("class", "badge");
    let icono = document.createElement("i");
    let img = document.createElement("img");
    img.setAttribute("src", "/imagen/badge-card.png");
    icono.appendChild(img);
    destacado.appendChild(icono);
    return destacado;
}

var setControls = (id) => {
    let prev = '<a class="carousel-control-prev" href="#' + id + '" role="button" data-slide="prev"><span class="carousel-control-prev-icon"></span><img src="/imagen/arrow-prev.png" alt="Anterior"/><span class="sr-only">Anterior</span></a>';
    let next = '<a class="carousel-control-next" href="#' + id + '" role="button" data-slide="next"><img src="/imagen/arrow-next.png" alt="Siguiente"/><span class="carousel-control-next-icon"></span><span class="sr-only">Siguiente</span></a>';
    return prev + next;
}

var setSegmento = (segmento) => {
    var segment = document.createElement("div");
    switch (segmento) {
        case 'selecta':
            segment.setAttribute("class", "card-cartera bg-color-0");
            segment.innerHTML = '<img src="/imagen/listing-logo-macro-selecta.png" alt="Cartera Selecta" style="height: 15px;">';
            break;
        default:
            segment.setAttribute("class", "card-cartera");
            break;
    }
    return segment;
}

var setVerMas = (comercio) => {
    let contenedor = document.createElement("a");
    contenedor.setAttribute("class", "card-link");
    contenedor.setAttribute("href", urlServicios.url_endpoint + "?id=" + comercio);
    contenedor.innerHTML = "VER M&Aacute;S";
    return contenedor;
}

var setPromo = (clase, descuento, cuotas) => {
    let promo = document.createElement(clase);
    if (clase != "h3") {
        promo.setAttribute("class", "card-title")
    }
    if (descuento != 0 && cuotas == 0) {
        promo.innerHTML = "<strong>" + descuento + "%</strong><br>de ahorro";
    }
    if (cuotas != 0 && descuento == 0) {
        promo.innerHTML = "<strong>" + cuotas + " cuotas</strong><br>sin inter&eacute;s";
    }
    if (cuotas != 0 && descuento != 0) {
        promo.innerHTML = "<b>" + descuento + "%</b> de ahorro y<br><b>" + cuotas + " cuotas</b> sin inter&eacute;s";
    }
    return promo;
}

var setPromoDetalle = (element) => {
    let promo = document.createElement("h3");
    var plazosFijosCuotas = false;
    if (element.plazosFijos_Aplica) {
        plazosFijosCuotas = true;
    }
    var cuotas = false;
    if ((element.minPayments > 0) && (element.maxPayments > 0)) {
        cuotas = true;
    }
    var descuento = 0;
    if (element.bankDiscount > 0) {
        descuento = parseFloat(element.bankDiscount);
    }

    var capitalizacion = false;
    if (element.convenio == 'Capitalizacion') {
        capitalizacion = true;
    }

    if (element.commerceDiscount > 0) {
        descuento += parseFloat(element.commerceDiscount);
    }

    var leyenda = "";
    var leyenda2 = "<br>sin inter\u00E9s";
    var calculo;

    if (capitalizacion) {
        leyenda = "<p> Descuento $" + element.maxDiscount + "</p>";
    }

    // console.log("Descuento -->>", descuento);
    if ((descuento <= 0) && (cuotas) || (plazosFijosCuotas)) {
        //console.log("Descuento -->>", 1);
        if (cuotas) {
            if (element.minPayments == element.maxPayments) {
                // console.log("Descuento -->>", 2);
                if (descuento > 0) {
                    calculo = (descuento * 100);
                    leyenda = "<strong>" + calculo.toString().split('.')[0] + "% de ahorro</strong> y<br>";
                    leyenda += "<strong>" + element.maxPayments + " cuotas</strong> " + leyenda2;
                } else {
                    leyenda = "<strong>" + element.maxPayments + " cuotas</strong> " + leyenda2;
                }
            } else {
                // console.log("Descuento -->>", 3);
                leyenda = "<strong>" + element.minPayments + " a " + element.maxPayments + " cuotas</strong>" + leyenda2;
            }
        } else if (plazosFijosCuotas) {
            // console.log("Descuento -->>", 4);
            leyenda = "<strong>" + element.plazosFijos_Cuotas + " cuotas</strong> " + leyenda2;
        }
    } else if ((descuento > 0) && (!cuotas)) {
        //   console.log("Descuento -->>", 5);
        calculo = (descuento * 100);
        leyenda = "<strong>" + calculo.toString().split('.')[0] + "% de ahorro</strong>";

    } else if ((descuento > 0) && (cuotas) || (descuento > 0) && (plazosFijosCuotas)) {
        // console.log("Descuento -->>", 6);
        calculo = (descuento * 100);
        leyenda = "<strong>" + calculo.toString().split('.')[0] + "% de ahorro</strong> y<br>";

        if (cuotas) {
            if (element.minPayments == element.maxPayments) {
                // console.log("Descuento -->>", 7);
                leyenda += "<strong>" + element.maxPayments + " cuotas</strong> " + leyenda2;
            } else {
                // console.log("Descuento -->>", 8);
                leyenda += "<strong>" + element.minPayments + " a " + element.maxPayments + " cuotas</strong> " + leyenda2;
            }
        } else if (plazosFijosCuotas) {
            // console.log("Descuento -->>", 9);
            leyenda += "<strong>" + element.plazosFijos_Cuotas + " cuotas</strong> " + leyenda2;
        }
    }
    promo.innerHTML = leyenda;

    if (element.segment == 'selecta') {
        promo.setAttribute("class", "selecta");
    }

    return promo;
}

var setCompartir = (id, type) => {
    var compID = id.uclass + "-" + Math.floor(Math.random() * 1000);
    var shareItems = {
        share:
        {
            image: "/imagen/share-card.png",
            imageDetail: "/imagen/share-card@2x.png",
            alt: "compartir",
            txt: "Compartir"
        },
        redes:
            [
                {
                    image: "/imagen/icon-fb.svg",
                    alt: "Compartir en Facebook",
                    class: "mc-share-btn mc-share-fb" + compID
                },
                {
                    image: "/imagen/icon-li.svg",
                    alt: "Compartir en LinkedIn",
                    class: "mc-share-btn mc-share-li" + compID
                },
                {
                    image: "/imagen/icon-twt.svg",
                    alt: "Compartir en Twitter",
                    class: "mc-share-btn mc-share-tw" + compID
                },
                {
                    image: "/imagen/icon-envelop.svg",
                    alt: "Compartir por Email",
                    class: "mc-share-btn mc-share-mail" + compID
                },
                {
                    image: "/imagen/whatsapp.svg",
                    alt: "Compartir por Whatsapp",
                    class: "mc-share-btn hidden-sm-up mc-share-wsp" + compID
                }
            ]
    };
    let compartir = document.createElement("a");
    compartir.setAttribute("class", "card-share");
    compartir.setAttribute("data-toggle", "collapse");
    compartir.setAttribute("href", "#share-box-" + compID);
    compartir.setAttribute("role", "button");
    compartir.setAttribute("aria-expanded", "false");
    compartir.setAttribute("aria-controls", "share-box-" + compID);
    let icon = document.createElement("i");
    let imgShare = document.createElement("img");
    if (type == "detail") {
        imgShare.setAttribute("src", shareItems.share.imageDetail);
    } else {
        imgShare.setAttribute("src", shareItems.share.image);
    }
    imgShare.setAttribute("alt", shareItems.share.alt);
    icon.appendChild(imgShare);
    compartir.appendChild(icon);
    if (type != "detail") {
        let spanShare = document.createElement("span");
        spanShare.setAttribute("style", "margin-right:20px");
        spanShare.innerHTML = (shareItems.share.txt);
        compartir.appendChild(spanShare);
    }
    let shareContainer = document.createElement("div");
    shareContainer.setAttribute("class", "collapse share-box");
    shareContainer.setAttribute("id", "share-box-" + compID);
    for (let i in shareItems.redes) {
        let a = document.createElement("a");
        a.setAttribute("class", shareItems.redes[i].class);
        a.setAttribute("href", "#");
        let img = document.createElement("img");
        img.setAttribute("src", shareItems.redes[i].image);
        img.setAttribute("alt", shareItems.redes[i].alt);
        a.appendChild(img);
        shareContainer.appendChild(a);
    }
    compartir.appendChild(shareContainer);
    var detalleCompartirURL = "";
    if (urlServicios.url_endpoint) {
        detalleCompartirURL = urlServicios.url_endpoint + "?id=" + id.id;
    } else {
        detalleCompartirURL = window.location.href;
    }

    $('body').on('click', 'a.mc-share-fb' + compID, function () {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + detalleCompartirURL, 'popup', 'width=650,height=425');
        return false;
    });

    $('body').on('click', 'a.mc-share-li' + compID, function () {
        var URL2Share = encodeURIComponent(detalleCompartirURL);
        window.open("https://www.linkedin.com/shareArticle?url=" + URL2Share, 'popup', 'width=650,height=425');
    });

    $('body').on('click', 'a.mc-share-mail' + compID, function () {
        window.location.href = "mailto:?subject=MacroBeneficios&body=" + encodeURIComponent("P\u00E1gina a compartir: ") + detalleCompartirURL;
    });

    $('body').on('click', 'a.mc-share-tw' + compID, function () {
        var sharedURL = detalleCompartirURL;
        window.open("https://twitter.com/intent/tweet?url=" + sharedURL, 'popup', 'width=650,height=425');
    });
    return compartir;
};

var getUrlImage = (data, url) => {
    var urlImagen = '';
    if (data.promLogo === '' && data.promRubroLogo === "") {
        urlImagen = url + data.promRubrolista.replace(/ /g, "_") + ".png";
    } else if (data.promLogo === '') {
        urlImagen = url + data.code + ".png";
    } else {
        urlImagen = url + data.promLogo + ".png";
    }
    return urlImagen;
}

var validateLogo = (logo) => {
    for (let i in categorias) {
        if (categorias[i].logo == logo) {
            return false;
        }
    }
    return true;
}

var getUrlImageCategoria = (data, url) => {
    var urlImagen = '';
    var urlfixed = '/imagen/rubro_';
    for (let i in categorias) {
        if (categorias[i].displayName == data) {
            urlImagen = urlfixed + categorias[i].logo + '/' + categorias[i].logo + ".png";
        }
    }
    return urlImagen;
}

// Crea Card para Beneficio
var renderCard = (element, type) => {
    let card = createContainerCard(element.promLogo, type);
    let cardBody = createCardBody();

    card.appendChild(cardBody);
    let shareId = {
        id: element.promName,
        uclass: element.promLogo.replace(/ /g, "")
    };
    cardBody.appendChild(setCompartir(shareId));
    cardBody.appendChild(setImageCategoria(element.promRubro));
    cardBody.appendChild(setImageComercio(element));
    cardBody.appendChild(setTitulo(element.promRubro.toUpperCase()));
    cardBody.appendChild(setPromo("h5", element.promDisc, element.promMaxpay));
    cardBody.appendChild(setVerMas(element.promId));
    cardBody.appendChild(setSegmento(element.promSegment));
    return card;
}

var renderSlide = (element, isActive) => {
    let slide = document.createElement("div");
    if (isActive) {
        slide.setAttribute("class", "carousel-item active");
    } else {
        slide.setAttribute("class", "carousel-item");
    }
    let slideCont;
    if (element.length) {
        for (let i in element) {
            slideCont = document.createElement("div");
            slideCont.setAttribute("class", "col-md-3");
            slideCont.appendChild(renderCard(element[i], "slider"));
            slide.appendChild(slideCont);
        }
    } else {
        slideCont = document.createElement("div");
        slideCont.setAttribute("class", "col-md-3");
        slideCont.appendChild(renderCard(element, "slider"));
        slide.appendChild(slideCont);
    }
    return slide;
}

let addSliderFunctions = (id) => {
    $('#' + id).on('touchstart', function (event) {
        const xClick = event.originalEvent.touches[0].pageX;
        $(this).one('touchmove', function (event) {
            const xMove = event.originalEvent.touches[0].pageX;
            const sensitivityInPx = 5;

            if (Math.floor(xClick - xMove) > sensitivityInPx) {
                $(this).carousel('next');
            }
            else if (Math.floor(xClick - xMove) < -sensitivityInPx) {
                $(this).carousel('prev');
            }
        });
        $(this).on('touchend', function () {
            $(this).off('touchmove');
        });
    });
}
// Renderiza Slider Beneficios
var drawSlider = (id, list, cardsInSlide) => {
    let slider = createSlider(id);
    let slides = createContainerSlides();

    $("#waitcards").remove();

    slider.innerHTML = setControls(id);
    slider.appendChild(slides);
    if (cardsInSlide == 1) {
        for (let i in list) {
            if (i < 1) {
                slides.appendChild(renderSlide(list[i], true));
            } else {
                slides.appendChild(renderSlide(list[i], false));
            }
        }
    } else {
        let start = 0;
        let end = cardsInSlide;
        let total = Math.ceil(list.length / cardsInSlide);
        for (let i = 0; i < total; i++) {
            if (i < 1) {
                slides.appendChild(renderSlide(list.slice(start, end), true));
            } else {
                slides.appendChild(renderSlide(list.slice(start, end), false));
            }
            start += cardsInSlide;
            end += cardsInSlide;
        }
    }

    return slider;
};

// Renderiza Beneficios
var drawBeneficios = (list, contenedor) => {
    contenedor.innerHTML = "";
    // Crea Contenedor Principal
    let containerMain = createContainerDesktop();
    let principales = createContainerGenerico("row");
    principales.setAttribute("style", "align-items:center;justify-content:center;");
    containerMain.appendChild(principales);
    contenedor.appendChild(containerMain);

    // Crea vista Movile
    let containerMovile = createContainerMovile();
    containerMovile.appendChild(drawSlider("carousel-beneficios-00", list.slice(0, 12), 1));
    contenedor.appendChild(containerMovile);
    addSliderFunctions("carousel-beneficios-00");

    // Crea contenedor Secundario 
    let containerSec = createContainerMasBeneficios();
    let containerSecMain = createContainercollapse();
    let secundarias = createContainerGenerico("row");
    secundarias.setAttribute("style", "align-items:center;justify-content:center;");

    if (list.length > 12) {
        containerSecMain.appendChild(secundarias);
        containerSec.appendChild(containerSecMain);
        contenedor.appendChild(containerSec);
        contenedor.appendChild(createBtnMas());
    }

    for (let i in list) {
        if (i < 12) {
            principales.appendChild(renderCard(list[i], ""));
        } else {
            secundarias.appendChild(renderCard(list[i], ""));
        }
    }
}

var segmentClass = (clase) => {
    let aux;
    switch (clase) {
        case "general":
            aux = "blue";
            break;
        case "selecta":
            aux = "black";
            break;
    }
    return aux;
}
var getFormattedDate = (date) => {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return day + '/' + month + '/' + year;
}

var createListaHeader = (data) => {
    let lista = document.createElement("ul");

    lista.setAttribute("class", "nav nav-pills mb-3 list");
    lista.setAttribute("id", "pills-tab");
    lista.setAttribute("role", "tablist");
    for (let i in data) {
        let item = document.createElement("li");
        let tabName = data[i];

        item.setAttribute("class", "nav-item");
        item.setAttribute("role", "presentation");
        let link = document.createElement("a");
        if (i < 1) {
            link.setAttribute("class", "nav-link active " + segmentClass(data[i]));
        } else {
            link.setAttribute("class", "nav-link " + segmentClass(data[i]));
        }
        link.setAttribute("id", "pills-" + data[i] + "-tab");
        link.setAttribute("data-toggle", "pill");
        link.setAttribute("href", "#pills-" + data[i]);
        link.setAttribute("role", "tab");
        link.setAttribute("aria-controls", "pills-" + data[i]);
        link.setAttribute("aria-selected", "true");
        link.innerHTML = tabName.charAt(0).toUpperCase() + tabName.slice(1);
        item.appendChild(link);
        lista.appendChild(item);
    }
    return lista;
}

var createCardDetail = (element) => {
    let card = createContainerGenerico("card detail");
    let nomenclatura = createContainerGenerico("");
    let body = createContainerGenerico("row card-body");
    let col4 = createContainerGenerico("col-md-4");
    let cPic = createContainerGenerico("pic-comercio");
    let img = document.createElement("img");
    img.setAttribute("src", getUrlImage(element, urlServicios.url_servicio_logo));
    img.setAttribute("alt", "comercio");
    cPic.appendChild(img);
    col4.appendChild(cPic);

    let h1nomenclatura = document.createElement("h1");
    h1nomenclatura.innerHTML = element.promName.toUpperCase();
    nomenclatura.appendChild(h1nomenclatura);

    let col8 = createContainerGenerico("col-md-8");
    let shareId = {
        id: element.promName,
        uclass: element.promLogo.replace(/ /g, "")
    };

    col8.appendChild(setCompartir(shareId, "detail"));

    if (element.promDayOfWeeks != "") {
        let h4 = document.createElement("h4");
        h4.innerHTML = element.promDayOfWeeks.replace("en " + element.promRubrolista, "").toUpperCase();
        col8.appendChild(h4);
    }
    if (element.promRubrolista != "") {
        let span = document.createElement("span");
        span.innerHTML = "EN " + element.promRubrolista.toUpperCase();
        col8.appendChild(span);
    }
    col8.appendChild(setPromoDetalle(element));

    col8.appendChild(setTexto("", "V&aacute;lido desde " + getFormattedDate(new Date(element.validSince)) + " hasta " + getFormattedDate(new Date(element.validUntil))));
    if (element.onlineSalesWebsite != "") {
        let website = element.onlineSalesWebsite.substring(0, 4).includes("http") ? element.onlineSalesWebsite : "//" + element.onlineSalesWebsite;
        col8.appendChild(setTexto("compra-online", 'Compra Online: <a href="' + website + '" target="_blank"> ' + website + ' </a>'));
    }

    if (element.promPayMethod != "") {
        col8.appendChild(setTexto("", "<strong>Aplica a las tarjetas:</strong> " + element.promPayMethod));
    }
    if (element.promotionalPhrase != "") {
        col8.appendChild(setTexto("", element.promotionalPhrase));
    }

    body.appendChild(col4);
    body.appendChild(col8);
    card.appendChild(nomenclatura);
    card.appendChild(body);

    let desplegar = createContainerGenerico("row");
    desplegar.appendChild(createDetailsBtn(element));
    desplegar.appendChild(createTyc(element));

    card.setAttribute("style", "background:#fff;");
    card.appendChild(desplegar);
    if (element.details.length > 0) {
        card.appendChild(createMap(element));
    }

    return card;
}

var createDetailsBtn = (element) => {
    let id = element.promId;
    let info = createContainerGenerico("info-extendida");
    let a = '<a data-toggle="collapse" href="#tyc_' + id + '" role="button" aria-expanded="false" aria-controls="tyc_' + id + '"> Terminos y condiciones <i><img src="/imagen/arrow-down.png" alt="desplegar"></i></a>';

    if (element.details.length > 0) {
        a += '<a data-toggle="collapse" href="#map_' + id + '" role="button" aria-expanded="false" aria-controls="map_' + id + '"> Ver Mapa y Comercios Adheridos </a>';
    }
    info.innerHTML = a;
    return info;
}
var createMap = (element) => {
    let map = document.createElement("div");
    map.setAttribute("class", "collapse");
    map.setAttribute("id", "map_" + element.promId);

    let cont = createContainerGenerico("mc-map-beneficio");
    let titulo = createContainerGenerico("mc-map-beneficio-title");
    titulo.innerHTML = "Comercios Adheridos";
    cont.appendChild(titulo);

    let row = createContainerGenerico("mc-map-beneficio-map row");
    let col9 = createContainerGenerico("col-md-12");

    let mapa = setMap(element.promId);

    col9.appendChild(mapa);
    row.appendChild(col9);

    cont.appendChild(row);

    // Listado de comercios bajo el mapa
    // El TÃƒÂ­tulo
    let tituloListado = createContainerGenerico(" ");
    tituloListado.setAttribute("style", "font-size:12px;line-height:30px;height:30px;font-weight:bold;");
    tituloListado.innerHTML = "Comercios Adheridos: " + element.details.length;
    cont.appendChild(tituloListado);
    // El listado en sÃƒÂ­
    for (var j = 0; j < element.details.length; j++) {
        listadoComercios = createContainerGenerico(" ");
        listadoComercios.setAttribute("style", "font-size:12px;line-height:30px;height:30px;");
        comercio = element.details[j];
        listadoComercios.innerHTML = '<b>' + comercio.locNombre + '</b>' + ': ' + comercio.streetAddress + ', ' + comercio.locCity; // + ', ' + getProvinceNameByCode(comercio.provinceISOCode).toUpperCase();
        cont.appendChild(listadoComercios);
    }
    // Fin del listado de comercios bajo el mapa

    map.appendChild(cont);

    return map;
}

var setMap = (id) => {
    let mapContainer = document.createElement("div");
    mapContainer.setAttribute("id", "map-" + id);
    mapContainer.setAttribute("class", "mc-map-beneficio-map-item");
    mapContainer.setAttribute("style", "height:400px");
    return mapContainer;
}

var initMap = (id, data) => {
    if (data.length > 0) {
        try {

            let center_long = -63.61702;
            let center_lat = -38.41354;
            let zoom = 4;

            if (data.length == 1) {
                center_long = data[0].longitude;
                center_lat = data[0].latitude;
                zoom = 13;
            }

            let map = new google.maps.Map(document.getElementById(id), {
                zoom: zoom,
                center: new google.maps.LatLng(center_lat, center_long),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            var infowindow = new google.maps.InfoWindow();

            var markers = [];
            for (var j = 0; j < data.length; j++) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data[j].latitude, data[j].longitude),
                    map: map
                });

                google.maps.event.addListener(marker, 'click', (function (marker, j) {
                    return function () {
                        // infowindow.setContent(data[j].locNombre + ': ' + data[j].streetAddress + ', ' + data[j].locCity + ', ' + getProvinceNameByCode(data[j].provinceISOCode).toUpperCase());
                        // sin la provincia
                        infowindow.setContent(data[j].locNombre + '<br>' + data[j].streetAddress + ', ' + data[j].locCity);
                        infowindow.open(map, marker);
                    }
                })(marker, j));
                markers.push(marker);
            }
            var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

            //console.log("Libreria google.maps.Geocoder() se ha cargado correctamente");
        }
        catch (err) {
            console.log("No se ha podido cargar google.maps.Geocoder(). " + err.message);
        }
    }
}

var createTyc = (element) => {
    let tyc = document.createElement("div");
    tyc.setAttribute("class", "collapse");
    tyc.setAttribute("id", "tyc_" + element.promId);

    let row = createContainerGenerico("row");
    tyc.appendChild(row);


    let footer = createContainerGenerico("mc-cft-beneficios");
    footer.appendChild(setTexto("mc-cft-beneficios-value", '<span class="mc-cft-beneficios-tna">TNA: ' + element.plazosFijos_TNA + '%,</span><span class="mc-cft-beneficios-cft"> CFTNA: ' + element.cft + '%</span>'));
    footer.appendChild(setTexto("mc-cft-beneficios-copy", element.termsAndConditions));

    row.appendChild(footer);

    return tyc;
}

var createContainerTabs = (header, data) => {
    let tab = document.createElement("div");
    tab.setAttribute("class", "tab-content");
    tab.setAttribute("id", "pills-tabContent");

    for (let i = 0; i < header.length; i++) {
        let tabBody = document.createElement("div");
        if (i == 0) {
            tabBody.setAttribute("class", "tab-pane fade show active");
        } else {
            tabBody.setAttribute("class", "tab-pane fade show");
        }
        tabBody.setAttribute("id", "pills-" + header[i]);
        tabBody.setAttribute("role", "tabpanel");
        tabBody.setAttribute("aria-labelledby", "pills-" + header[i] + "-tab");
        for (let j in data[i]) {
            tabBody.appendChild(createCardDetail(data[i][j]));
        }
        tab.appendChild(tabBody);
    }
    return tab;
}

// Renderiza Detalle Beneficios
var drawBeneficiosDetalle = (contenedor, header, data) => {
    let tabs = createContainerGenerico("scroll-tabs");
    let wrap = createContainerGenerico("wrapper");
    tabs.appendChild(wrap);
    wrap.appendChild(createListaHeader(header));
    contenedor.appendChild(tabs);
    contenedor.appendChild(createContainerTabs(header, data));
}
// Crea filtros por criterios en URL
let filterbyCriteria = (data, criteria) => {
    let filter;
    if (criteria.is) {
        filter = criteria.params
    } else {
        filter = {
            categoria: criteria.get("categoria"),
            beneficios: criteria.get("beneficios"),
            localidad: criteria.get("localidad"),
            dia: criteria.get("dia-semana"),
            tarjeta: criteria.get("tarjeta")
        }
    }
    return filterDeleteDuplicated(filterbyTarjeta(filterbyCategoria(filterByDay(filterbyBeneficios(filterbyLoc(data, filter.localidad), filter.beneficios), filter.dia), filter.categoria), filter.tarjeta));
}

//Filtra los beneficios Eliminado duplicados
let filterDeleteDuplicated = (data) => {
    let beneficios = [];
    for (let i in data) {
        let flag = true;
        for (let j in beneficios) {
            if (data[i].promId === beneficios[j].promId &&
                data[i].promCFT === beneficios[j].promCFT &&
                data[i].promDisc === beneficios[j].promDisc &&
                data[i].promMaxPay === beneficios[j].promMaxPay &&
                data[i].promMedPago === beneficios[j].promMedPago &&
                data[i].promMinpay === beneficios[j].promMinpay &&
                data[i].promSegment === beneficios[j].promSegment
            ) {
                flag = false;
            }
        }
        if (flag) {
            beneficios.push(data[i]);
        }
    }
    return beneficios;
}
// Filtra beneficios por categoria
let filterbyCategoria = (data, categoria) => {
    if (categoria == "All" || categoria == "ALL" || categoria == null) {
        return data;
    }

    let beneficios = [];
    for (let i in data) {
        if (data[i].promRubro.toUpperCase().indexOf(categoria.toUpperCase()) > -1) {
            beneficios.push(data[i]);
        }
    }
    return beneficios;
}

// Filtra beneficios por Nucleador
let filterbyNucleadores = (data, nucleadores) => {
    let beneficios = [];

    if (nucleadores == null) {
        nucleadores = {

        }
    }

    for (let i in data) {
        for (let j in nucleadores) {
            if (data[i].promRubro.toUpperCase().indexOf(nucleadores[j].nucleador.toUpperCase()) > -1) {
                beneficios.push(data[i]);
            }
        }
    }
    return beneficios;
}

// Filtra beneficios por coincidencia
let filterbyBeneficios = (data, beneficio) => {
    if (beneficio == "" || beneficio == null) {
        return data;
    }
    let beneficios = [];
    for (let i in data) {
        if (data[i].promId.toUpperCase().indexOf(beneficio.toUpperCase()) > -1) {
            beneficios.push(data[i]);
        }
    }
    return beneficios;
}

// Filtra beneficios por Tarjeta
let filterbyTarjeta = (data, tarjeta) => {
    if (tarjeta == "" || tarjeta == null || tarjeta == "l") {
        return data;
    }
    let beneficios = [];
    for (let i in data) {
        if (data[i].promMedPago.toUpperCase().indexOf(tarjeta.toUpperCase()) > -1) {
            beneficios.push(data[i]);
        }
    }
    return beneficios;
}
// Filtra beneficios por localidad
let filterbyLoc = (data, localidad, is) => {
    if (localidad == "" || localidad == null) {
        return data;
    }
    if (localidad == "CAPITAL FEDERAL") {
        localidad = "CABA";
    }
    let beneficios = [];
    for (let i in data) {
        if (data[i].locCity.toUpperCase().indexOf(localidad.toUpperCase()) > -1) {
            beneficios.push(data[i]);
        } else if (data[i].locCity == "" && is) {
            beneficios.push(data[i]);
        }
    }
    return beneficios;
}

// Filtra beneficios por provincia
let filterbyProv = (data) => {
    let beneficios = [];
    let localidades = getLocalidadName();
    for (let i in data) {
        if (localidades.indexOf(data[i].locCity.toUpperCase()) > -1) {
            beneficios.push(data[i]);
        } else if (data[i].locCity == "") {
            beneficios.push(data[i]);
        }
    }
    return beneficios;
}

// Filtra beneficios por dia
let filterByDay = (data, day) => {
    if (day == "7" || day == null) {
        return data;
    }
    if (day == "8") {
        day = new Date().getDay();
    }
    let beneficios = [];
    for (let i in data) {
        switch (day.toString()) {
            case "0":
                if (data[i].promOnSun) {
                    beneficios.push(data[i]);
                }
                break;
            case "1":
                if (data[i].promOnMon) {
                    beneficios.push(data[i]);
                }
                break;
            case "2":
                if (data[i].promOnTue) {
                    beneficios.push(data[i]);
                }
                break;
            case "3":
                if (data[i].promOnWed) {
                    beneficios.push(data[i]);
                }
                break;
            case "4":
                if (data[i].promOnThu) {
                    beneficios.push(data[i]);
                }
                break;
            case "5":
                if (data[i].promOnFri) {
                    beneficios.push(data[i]);
                }
                break;
            case "6":
                if (data[i].promOnSat) {
                    beneficios.push(data[i]);
                }
                break;
        }
    }
    return beneficios;
}
var getSegment = (data) => {
    let segment = [];
    for (let i in data) {
        let flag = true;
        if (segment.length > 0) {
            for (let j in segment) {
                if (segment[j] === data[i].segment) {
                    flag = false;
                }
            }
        }
        if (flag) {
            segment.push(data[i].segment)
        }
    }
    return segment;
}

var filterBySegment = (segments, data) => {
    let filtered = [];
    for (let i in segments) {
        let sData = [];
        for (let j in data) {
            if (segments[i] === data[j].segment) {
                sData.push(data[j]);
            }
        }
        filtered.push(sData);
    }
    return filtered;
}
var validateParams = () => {
    let queryString = window.location.search;
    let urlParams;

    if (queryString.trim() != "") {
        urlParams = new URLSearchParams(queryString);
        return { is: true, params: urlParams };
    }
    return { is: false };
}

// Inicializa Beneficios
var initBeneficios = (id, criteria) => {
    let urlParams;

    if (!provinciaActual) {
        return;
    }
    if (!criteria.is) {
        urlParams = validateParams();
    }
    if ($("#ubicacion").length && provinciaActual) {
        $("#ubicacion").val(provinciaActual.provinceNeutral);
        //Obtiene Localidades por provincia
        getLocalidades().then(res => { return localidades = res; });
        // Inserta Predictivo Localidades
        $("#localidad").autocomplete({
            source: getLocalidadName()
        });
    }
    //console.log("URLServicio: ", urlServicios.url_servicio_promociones+provinciaActual.provinceIsoCode)
    $.ajax({
        url: urlServicios.url_servicio_promociones + provinciaActual.provinceIsoCode,
        type: "GET",
        headers: {
            accept: "application/json; charset=utf-8",
            "x-ibm-client-id": urlServicios.url_servicio_client_id
        },
        success: function (data) {
            //console.log("beneficios DATA: ", data);
            let beneficios = [];
            let dia = new Date().getDay();
            if (criteria.is) {
                beneficios = filterbyCriteria(data, criteria);
            } else if (urlParams.is) {
                beneficios = filterbyCriteria(data, urlParams.params);
            } else {
                beneficios = filterDeleteDuplicated(data);
            }
            drawBeneficios(beneficios, document.getElementById(id));
        },
        error: function (e) {
            console.log("No se obubieron beneficios");
        }
    });
}
// Inicializa Beneficios por Lista 
var initBeneficiosLista = (id, idLista, criteria) => {
    if ($("#ubicacion").length && provinciaActual) {
        $("#ubicacion").val(provinciaActual.provinceNeutral);
        //Obtiene Localidades por provincia
        getLocalidades().then(res => { return localidades = res; });
        // Inserta Predictivo Localidades
        $("#localidad").autocomplete({
            source: getLocalidadName()
        });

    }
    $.ajax({
        url: urlServicios.url_servicio_promociones_lista + idLista,
        type: "GET",
        headers: {
            accept: "application/json; charset=utf-8",
            "x-ibm-client-id": urlServicios.url_servicio_client_id
        },
        success: function (data) {
            let beneficios = [];
            let dia = new Date().getDay();
            if (criteria.is) {
                beneficios = filterbyCriteria(filterbyProv(data.details), criteria);
            } else {
                beneficios = filterDeleteDuplicated(filterbyProv(data.details));
            }
            if ($(".TituloLista").length > 0) {
                $(".TituloLista").text(data.listUrl);
            }

            drawBeneficios(beneficios, document.getElementById(id));
        },
        error: function (e) {
            console.log("No se obubieron beneficios en la lista");
        }
    });
}

// Inicializa Beneficios Nucleadores

var initBeneficiosNucleadores = (id, criteria) => {
    let urlParams;

    if (!provinciaActual) {
        return;
    }
    if (!criteria.is) {
        urlParams = validateParams();
    }

    if ($("#ubicacion").length && provinciaActual) {
        $("#ubicacion").val(provinciaActual.provinceNeutral);
        //Obtiene Localidades por provincia
        getLocalidades().then(res => { return localidades = res; });
        // Inserta Predictivo Localidades
        $("#localidad").autocomplete({
            source: getLocalidadName()
        });
    }
    $.ajax({
        url: urlServicios.url_servicio_promociones + provinciaActual.provinceIsoCode,
        type: "GET",
        headers: {
            accept: "application/json; charset=utf-8",
            "x-ibm-client-id": urlServicios.url_servicio_client_id
        },
        success: function (data) {
            let beneficios = [];
            let dia = new Date().getDay();
            if (criteria.is) {
                beneficios = filterbyNucleadores(filterbyCriteria(data, criteria), criteria.nucleadores);
            } else if (urlParams.is) {
                beneficios = filterbyNucleadores(filterbyCriteria(data, urlParams.params), criteria.nucleadores);
            } else {
                beneficios = filterbyNucleadores(filterDeleteDuplicated(data), criteria.nucleadores);
            }
            drawBeneficios(beneficios, document.getElementById(id));
        },
        error: function (e) {
            console.log("No se obubieron beneficios para Nucleadores");
        }
    });
}

var initBeneficioDetalle = (contenedor, id) => {


    $.ajax({
        url: urlServicios.url_servicio_promocion_detalle + id,
        type: "GET",
        headers: {
            accept: "application/json; charset=utf-8",
            "x-ibm-client-id": urlServicios.url_servicio_client_id
        },
        success: function (data) {
            let segments = getSegment(data);
            let filtered = filterBySegment(segments, data);
            $("#cards-beneficios").empty();
            drawBeneficiosDetalle(document.getElementById(contenedor), segments, filtered);
            for (let i in data) {
                if (data[i].details.length > 0) {
                    initMap("map-" + data[i].promId, data[i].details);
                }
            }
        },
        error: function (e) {
            console.log("No se obubieron beneficios");
        }
    });
}
// Iniciailiza Slider Beneficios
var initSlider = (id, idLista) => {
    if (idLista == null || idLista == "") {
        return id;
    }
    $.ajax({
        url: urlServicios.url_servicio_promociones_lista + idLista,
        type: "GET",
        headers: {
            accept: "application/json; charset=utf-8",
            "x-ibm-client-id": urlServicios.url_servicio_client_id
        },
        success: function (data) {
            let contenedor = document.getElementById(id);
            contenedor.appendChild(drawSlider("slider" + id, filterDeleteDuplicated(data.details), 4));
            addSliderFunctions("slider" + id);
        },
        error: function (e) {
            console.log("No se obubieron beneficios");
        }
    });
}

var initSliderGeo = (id) => {
    if (!provinciaActual) {
        return;
    }

    $.ajax({
        url: urlServicios.url_servicio_promociones + provinciaActual.provinceIsoCode,
        type: "GET",
        headers: {
            accept: "application/json; charset=utf-8",
            "x-ibm-client-id": urlServicios.url_servicio_client_id
        },
        success: function (data) {
            let contenedor = document.getElementById(id);
            contenedor.appendChild(drawSlider("slider" + id, filterDeleteDuplicated(data), 4));
            addSliderFunctions("slider" + id);
        },
        error: function (e) {
            console.log("No se obubieron beneficios");
        }
    });

}