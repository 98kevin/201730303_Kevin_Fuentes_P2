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

	// Limpar divs
	var h5MessageElement = document.getElementById('tablaToken');
	h5MessageElement.innerHTML = "";

	var h5MessageElement = document.getElementById('tablaConst');
	h5MessageElement.innerHTML = "";

	var h5MessageElement = document.getElementById('tablaLite');
	h5MessageElement.innerHTML = "";

	var h5MessageElement = document.getElementById('tablaVariables');
	h5MessageElement.innerHTML = "";

	var h5MessageElement = document.getElementById('tablaErroresLexicos');
	h5MessageElement.innerHTML = "";

	var h5MessageElement = document.getElementById('tablaErroresSintatico');
	h5MessageElement.innerHTML = "";

	main(archivo);
}
