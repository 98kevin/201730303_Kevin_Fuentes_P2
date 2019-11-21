


/**
 * inicializa tablas de códigos intermedios para
  devuelto por el analizador léxico.
 * @param {*} tablaIdentificadores 
 * @param {*} tablaTokens 
 * @param {*} tablaLiterales 
 * @param {*} tablaConstantes 
 * @param {*} tablaErroresLexicos 
 */

var crearTablas = function (tablaIdentificadores, tablaTokens, tablaLiterales, tablaConstantes, 
    tablaErroresLexicos) {
        var retorno = new Array();
    
        // Inicializacion de matriz de tablaIdentificadores
        tablaIdentificadores = new Array();
        
        // Inicializacion de matriz de tabla unica
        tablaTokens = new Array();
    
        // Inicializacion de matriz de tablaLiterales
        tablaLiterales = new Array();
        
        // Inicializacion de matriz de constantes
        tablaConstantes = new Array();
        
        // Inicializacion de matriz de errores lexicos
        tablaErroresLexicos = new Array();
        
        // Inicializacion de matriz de errores sintaticos
        tablaErroresSintaticos = new Array();
        
        retorno[0] = tablaIdentificadores;
        retorno[1] = tablaTokens;
        retorno[2] = tablaLiterales;
        retorno[3] = tablaConstantes;
        retorno[4] = tablaErroresLexicos;
        retorno[5] = tablaErroresSintaticos;
    
        return retorno;
    }

 /**
  * inserta un nuevo token en la tabla unica.
  * @param {*} tablaTokens tabla unica
  * @param {*} idToken codigo definido para un token 
  * @param {*} lineaCodigo linea token en código
  * @param {*} colunaCodigo columna del token en codigo
  * @param {*} ponteiro (puntero a la tabla auxiliar de referencia) == -1 si no hay tabla de referencia
  */
var insertarEnTablaDeTokens = function (tablaTokens, idToken, lineaCodigo, colunaCodigo, ponteiro){
	var idLinea = tablaTokens.length;
	
	tablaTokens[idLinea] = new Array();
	tablaTokens[idLinea][0] = idLinea;
	tablaTokens[idLinea][1] = idToken;
	tablaTokens[idLinea][2] = lineaCodigo;
	tablaTokens[idLinea][3] = colunaCodigo;
	tablaTokens[idLinea][4] = ponteiro;
	
}

/**
 * Inserta un nuevo token en la tabla de literales
 * @param {*} tablaLiterales 
 * @param {*} literal 
 * @param {*} lineaCodigo 
 * @param {*} colunaCodigo 
 */
var insertarTablaLiterales= function (tablaLiterales, literal, lineaCodigo, colunaCodigo) {
	var idLinea = tablaLiterales.length;
	
	tablaLiterales[idLinea] = new Array();
	tablaLiterales[idLinea][0] = idLinea;
	tablaLiterales[idLinea][1] = literal;
	tablaLiterales[idLinea][2] = lineaCodigo;
	tablaLiterales[idLinea][3] = colunaCodigo;

	return idLinea;
}

/**
 * Inserta un nuevo token en la tabla de indentificadores
 * @param {*} tablaIdentificadores 
 * @param {*} nomeIdentificador 
 * @param {*} lineaCodigo 
 * @param {*} colunaCodigo 
 */
var inserirTablaIdentificadores = function (tablaIdentificadores, nomeIdentificador, lineaCodigo, colunaCodigo) {
	var idLinea = tablaIdentificadores.length;
	var variable = false;
	var id;
	
	for (var i=0; i<idLinea; i++) {
		if (tablaIdentificadores[i][1] == nomeIdentificador) {
			variable = true;
			id = tablaIdentificadores[i][0];
		}
	}
	
	if (variable == false) {
		tablaIdentificadores[idLinea] = new Array();
		tablaIdentificadores[idLinea][0] = idLinea;
		tablaIdentificadores[idLinea][1] = nomeIdentificador;
		tablaIdentificadores[idLinea][2] = lineaCodigo;
		tablaIdentificadores[idLinea][3] = colunaCodigo;
		//tablaIdentificadores[idLinea][2] = fkTablaConstantes;		//Valor da variável 
		return idLinea;
	} else {
		return id;
	}
	
}

/**
 * Inserta un nuevo token la tabla de constantes
 * @param {*} tablaConstantes 
 * @param {*} constante 
 * @param {*} lineaCodigo 
 * @param {*} colunaCodigo 
 */
var inserirTablaConstantes = function inserirTablaConstantes(tablaConstantes, constante, lineaCodigo, colunaCodigo) {
	var idLinea = tablaConstantes.length;
	tablaConstantes[idLinea] = new Array();
	tablaConstantes[idLinea][0] = idLinea;
	tablaConstantes[idLinea][1] = constante;
	tablaConstantes[idLinea][2] = lineaCodigo;
	tablaConstantes[idLinea][3] = colunaCodigo;	
	//tablaConstantes[idLinea][2] = fkTablaIndetificadores;		//Variável referente ao valors
	return idLinea;
}


/**
 * Inserta un nuevo token en la tabla de errores
 * @param {*} tablaErrores 
 * @param {*} descripcionDelError 
 * @param {*} lineaCodigo 
 * @param {*} colunaCodigo 
 */
var inserirtablaErrores= function (tablaErrores, descripcionDelError, lineaCodigo, colunaCodigo) {
	var idLinea = tablaErrores.length;
	tablaErrores[idLinea] = new Array();
	tablaErrores[idLinea][0] = idLinea;
	tablaErrores[idLinea][1] = descripcionDelError;
	tablaErrores[idLinea][2] = lineaCodigo;
	tablaErrores[idLinea][3] = colunaCodigo;

	return idLinea;
}


/**
 * 
 * @param {*} tablaTokens 
 * @param {*} tablaConstantes 
 * @param {*} tablaLiterales 
 * @param {*} tablaIdentificadores 
 * @param {*} tablaErroresLexicos 
 */
var exibirTablas= function (tablaTokens, tablaConstantes, tablaLiterales, tablaIdentificadores, tablaErroresLexicos){
	var mensaje = "";
	var clase = "";
	var div = "";
	
	div = "<h5>Tabla de Constantes</h5>";
	div = div + "<table class='table'><thead><tr><th>id</th><th>Constante</th><th>Linea</th><th>Coluna</th></tr></thead><tbody>";
	
	if (tablaConstantes.length > 0) {
		for(var i = 0; i < tablaConstantes.length; i++) {
			div = div.concat("<tr class='line-hover'>");
			div = div.concat("<td>" + tablaConstantes[i][0] + "</td>");
			div = div.concat("<td>" + tablaConstantes[i][1] + "</td>");
			div = div.concat("<td>" + tablaConstantes[i][2] + "</td>");
			div = div.concat("<td>" + tablaConstantes[i][3] + "</td>");
			div = div.concat("</tr>");
		}	
		div = div + "</tbody></table>";
		var divTablaConstantes = document.getElementById('tablaConst');
		divTablaConstantes.innerHTML = div;
		divTablaConstantes.classList.remove("ocultar-div");
	}
	
	div = "<h5>Tabla de Literales</h5>";
	div = div + "<table class='table'><thead><tr><th>id</th><th>Literal</th><th>Linea</th><th>Columna</th></tr></thead><tbody>";
	
	if (tablaLiterales.length > 0) {
		for(var i = 0; i < tablaLiterales.length; i++) {
			div = div.concat("<tr class='line-hover'>");
			div = div.concat("<td>" + tablaLiterales[i][0] + "</td>");
			div = div.concat("<td>" + tablaLiterales[i][1] + "</td>");
			div = div.concat("<td>" + tablaLiterales[i][2] + "</td>");
			div = div.concat("<td>" + tablaLiterales[i][3] + "</td>");
			div = div.concat("</tr>");
		}	
		div = div + "</tbody></table>";
		var divTablaLiterales = document.getElementById('tablaLite');
		divTablaLiterales.innerHTML = div;
		divTablaLiterales.classList.remove("ocultar-div");
	}
	
	div = "<h5>Tabla de Identificadores</h5>";
	div = div + "<table class='table'><thead><tr><th>id</th><th>Identificador</th><th>Linea</th><th>Coluna</th></tr></thead><tbody>";
	
	if (tablaIdentificadores.length > 0) {
		for(var i = 0; i < tablaIdentificadores.length; i++) {
			div = div.concat("<tr class='line-hover'>");
			div = div.concat("<td>" + tablaIdentificadores[i][0] + "</td>");
			div = div.concat("<td>" + tablaIdentificadores[i][1] + "</td>");
			div = div.concat("<td>" + tablaIdentificadores[i][2] + "</td>");
			div = div.concat("<td>" + tablaIdentificadores[i][3] + "</td>");
			div = div.concat("</tr>");
		}	
		div = div + "</tbody></table>";
		var divTablaIdentificadores = document.getElementById('tablaVariables');
		divTablaIdentificadores.innerHTML = div;	
		divTablaIdentificadores.classList.remove("ocultar-div");		
	}
	
	//div = "<h5>Tabla de Errores Léxicos</h5>";
	div = "";
	div = div + "<table class='hoverable centered responsive-table'><thead><tr><th>id</th><th>Erro</th><th>Linea</th><th>Coluna</th></tr></thead><tbody>";
	
	if (tablaErroresLexicos.length > 0) {
		for(var i = 0; i < tablaErroresLexicos.length; i++) {
			div = div.concat("<tr class='line-hover'>");
			div = div.concat("<td>" + tablaErroresLexicos[i][0] + "</td>");
			div = div.concat("<td>" + tablaErroresLexicos[i][1] + "</td>");
			div = div.concat("<td>" + tablaErroresLexicos[i][2] + "</td>");
			div = div.concat("<td>" + tablaErroresLexicos[i][3] + "</td>");
			div = div.concat("</tr>");
		}	
		div = div + "</tbody></table>";

		var divtablaErroresLexicos = document.getElementById('tablaErroresLexicos');
		divtablaErroresLexicos.innerHTML = div;	
		divtablaErroresLexicos.classList.remove("ocultar-div");	
		//mensaje = "Ohhh! Seu código possui erros léxicos :(";	
		clase = "flash-fail";
	} else {
		div = "<p>Parabéns! Seu código não possui erros léxicos :)</p>";
		clase = "flash-success";	
		var divtablaErroresLexicos = document.getElementById('tablaErroresLexicos');
		divtablaErroresLexicos.innerHTML = div;	
		divtablaErroresLexicos.classList.remove("ocultar-div");
	}	

	var spanErroresLexico = document.getElementById('lexico-erros');
	spanErroresLexico.innerHTML = tablaErroresLexicos.length;		
	spanErroresLexico.classList.add(clase);

	var results = document.getElementById('results-div')
	results.classList.remove("ocultar-div");				
}

var exibirErroresSintaticos= function (){
	var div = "";
	div = div + "<table class='hoverable centered responsive-table'><thead><tr><th>id</th><th>Erro</th><th>Linea</th><th>Coluna</th></tr></thead><tbody>";
	if (tablaErroresSintaticos.length > 0){
		
		for(var i = 0; i < tablaErroresSintaticos.length; i++) {
			div = div.concat("<tr class='line-hover'>");
			div = div.concat("<td>" + tablaErroresSintaticos[i][0] + "</td>");
			div = div.concat("<td>" + tablaErroresSintaticos[i][1] + "</td>");
			div = div.concat("<td>" + tablaErroresSintaticos[i][2] + "</td>");
			div = div.concat("<td>" + tablaErroresSintaticos[i][3] + "</td>");
			div = div.concat("</tr>");
		}	
		div = div + "</tbody></table>";
		var divtablaErroresSintatico = document.getElementById('tablaErroresSintatico');
		divtablaErroresSintatico.innerHTML = div;	
		divtablaErroresSintatico.classList.remove("ocultar-div");	
		mensaje = "Ohhh! Seu código possui erros sintáticos :(";	
		classe = "flash-fail";
		
	} else {
		div = "<p>Parabéns! Seu código não possui erros sintáticos :)</p>";
		classe = "flash-success";	
		var divtablaErroresLexicos = document.getElementById('tablaErroresSintatico');
		divtablaErroresLexicos.innerHTML = div;	
		divtablaErroresLexicos.classList.remove("ocultar-div");
	}		

	var spanErroresSintatico = document.getElementById('sintatico-erros');
	spanErroresSintatico.innerHTML = tablaErroresSintaticos.length;	
	spanErroresSintatico.classList.add(classe);
}

module.exports= crearTablas, insertarEnTablaDeTokens,insertarTablaLiterales,inserirTablaIdentificadores,
 inserirTablaConstantes,inserirtablaErrores, exibirTablas, exibirErroresSintaticos;
