var cod;
var urlBase;

function crearCaptcha(codigo) {
    var canvas = document.getElementById("canvas");
    var ancho = canvas.width;
    var alto = canvas.height;
    var contexto = canvas.getContext("2d");
    if (contexto != null) {
        contexto.rect(0, 0, ancho, alto);
        var deg = contexto.createLinearGradient(0, 0, ancho, alto);
        deg.addColorStop(0.1, 'blue');
        deg.addColorStop(0.5, 'aqua');
        contexto.fillStyle = deg;
        contexto.fill();
        contexto.font = "50px Arial";
        contexto.fillStyle = "white";
        contexto.textBaseline = "top";
        contexto.fillText(atob(codigo), 10, 10);
    }
}

function crearCaracterAzar() {
    var n = Math.random() * 26 + 65;
    return String.fromCharCode(n);
}

window.onload = function () {
    urlBase = window.location.protocol + "//" + window.location.host + document.getElementById("hdfUrlRaiz").value;
    sessionStorage.setItem("UrlBase", urlBase);
 
    var codigo = document.getElementById("hdfCodigo").value;
    cod = atob(codigo);
    crearCaptcha(codigo);

    document.getElementById("aActualizarCaptcha").onclick = function () {
        var codigo = "";
        for(var i=0;i<5;i++){
            codigo += crearCaracterAzar();
        }
        cod = codigo;
        crearCaptcha(btoa(codigo));
    }

    document.getElementById("btnAceptar").onclick = function () {
        if (validarDatos()) validarLogin();
    }
}

function get(url, callBack) {
    requestServer("get", url, callBack);
}

function requestServer(httpMethod, url, callBackMethod) {
    var xhr = new XMLHttpRequest();
    url = urlBase + url;
    xhr.open(httpMethod, url);
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            callBackMethod(xhr.response);
        }
    }
    xhr.send();
}

function mostrarLogin(rpta) {
    if (rpta != "") window.location.href = urlBase + "Home/Index";
    else alert("Acceso Denegado. Login incorrecto");
}

function validarRequerido() {
    var mensaje = "";
    var controles = document.getElementsByClassName("Requerido");
    var nControles = controles.length;
    var control;
    for (var i = 0; i < nControles; i++) {
        control = controles[i];
        if (control.value == "") {
            mensaje += "<li>Falta ingresar el ";
            mensaje += control.getAttribute("data-name");
            mensaje += "</li>";
            control.style.borderColor = "red";
        }
        else {
            control.style.borderColor = "";
        }
    }
    return (mensaje);
}

function validarCaptcha() {
    var mensaje = "";
    var codigo = document.getElementById("txtCodigo").value;
    if (codigo != cod) mensaje = "<li>Código de Captcha Incorrecto</li>";
    return mensaje;
}

function validarDatos() {
    var mensaje = validarRequerido();
    mensaje += validarCaptcha();
    if (mensaje == "") {
        document.getElementById("spnValida").innerHTML = "";
        return true;
    }
    else {
        document.getElementById("spnValida").innerHTML = "<ul>" + mensaje + "</ul>";
        return false;
    }    
}

function validarLogin() {
    var clave = document.getElementById("txtClave").value;
    cifrarSHA256(clave);
}

function cifrarSHA256(texto) {
    var mensajeCifrado;
    var buffer = str2ab(texto);
    var crypto = window.crypto || window.msCrypto;
    if (crypto != null) {
        if (window.msCrypto) {
            var cifrado = crypto.subtle.digest("SHA-256", buffer);
            cifrado.oncomplete = function (evt) {
                var arrayBuffer = evt.target.result;
                mensajeCifrado = ab2str(arrayBuffer);
                enviarLoginServidor(mensajeCifrado);
            }
            cifrado.onerror = function (err) {
                alert(err);
            }
        }
        else {
            crypto.subtle.digest("SHA-256", buffer).then(
               function (arrayBuffer) {
                   mensajeCifrado = ab2str(arrayBuffer);
                   enviarLoginServidor(mensajeCifrado);
               },
               function (err) {
                   alert(err);
               }
            );
        }
    }
}

function str2ab(str) {
    var escstr = encodeURIComponent(str);
    var ua = new Uint8Array(escstr.length);
    Array.prototype.forEach.call(escstr, function (ch, i) {
        ua[i] = ch.charCodeAt(0);
    });
    return ua;
}

function ab2str(buffer) {
    var digestView = new Uint8Array(buffer);
    var hash = "";
    for (var i = 0; i < digestView.byteLength; i++) {
        var hex = new Number(digestView[i]).toString("16");
        if (hex.length == 1) { hex = "0" + hex; }
        hash += hex;
    }
    return hash;
}

function enviarLoginServidor(cc) {
    var usuario = document.getElementById("txtUsuario").value;
    document.getElementById("txtClave").value = "*****";
    get("Cliente/validarLogin/?usuario=" + usuario + "&clave=" + cc, mostrarLogin);
}
