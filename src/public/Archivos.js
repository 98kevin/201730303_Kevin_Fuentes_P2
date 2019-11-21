/*** 
 * Lee una direccion  como un archivo
 */
var lectorDeArchivo = new FileReader();
window.onload = function init() {
	lectorDeArchivo.onload = leerArchivo;
}        

/***
 * Lee un archivo como texto
 */
function obtenerArchivo(archivoDeEntrada) {
     var arquivo = archivoDeEntrada.files[0];
     lectorDeArchivo.readAsText(arquivo);
}

/***
 * Escribe las líneas del archivo en una tabla después de cargar.
 */
function leerArchivo(evento) {
	var archivo = evento.target.result.split('\n');
	var div = "<table class='table'><td>";

	for (var i = 0; i < archivo.length; i++) 
		div = div + "<div>"+i+"</div>";
	
	div = div + "</td><td><pre><code>";
	
	for (var i = 0; i < archivo.length; i++) {
		if (archivo[i] == '') codeLine = '\n';
		else codeLine = archivo[i];
		div += "<div>"+ codeLine+'</div>';
	}

	div += "</code></pre></td></tr></table>";
	var archivoSalidaDiv = document.getElementById('archivoSalida');
	archivoSalidaDiv.innerHTML = div;
	archivoSalidaDiv.classList.remove("ocultar-div");

var URL = 'http://localhost:3000/evaluarContenido';
	//peticion  al servidor
	let mostrarResultados = document.getElementById('results-div');
	axios.post(URL, 
		{ archivo: archivo}
	).then( function(response){
		mostrarResultados.innerHTML = response.data.textoResultado;
	}).catch(handleFailure);
}


/**
 * Funcion que se encarga del manejo de los errores
 * @param {*} data 
 */
function handleFailure(data) { 
	console.log('error', data); 
}
