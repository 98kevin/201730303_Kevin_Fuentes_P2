var tablaDeLiterales = 0;										// Tabla de letras
var tablaIdentificadores = 0;								    // Tabla de Indentificadores
var tablaTokens = 0;										    // Tabla de tokens
var tablaDeConstantes = 0;									    // Tabla de Constantes
var tablaErroresLexicos = 0;								 	// Tabla de errores lexicos
var tablaErroresSintaticos = 0;									// Tabla de errores sintaticos


var codigoCompilado = "";
var divGeneral= "";

/***
 * Diccionario que contiene tokens aceptados por el compilador con sus respectivos códigos 
 * Cuando es identificador, el valor es -1, cuando es constante, el valor es -2
 */
var comentarios = {"//" : 1};	
var signoIgual = {"=" : 2};			
var operadores = {"==" : 3,">" : 4,"<" : 5,">=" : 6,"<=" : 7,"!=" : 8,"&&" : 9,"||" : 10, "!" : 11,"%" : 12,"+" : 13, "-" : 14,"/" : 15, "*" : 16,"^" : 17};
var palabrasReservadas = {"funcion" : 18, "principal" : 19, "retornar" : 20, "vacio" : 21, "variable" : 22, "entero" : 23, "decimal" : 24, "booleano" : 25, "cadena" : 26, "caracter" : 27, "si" : 28, 
"sino" : 29, "mientras" : 30, "para" : 31, "hacer" : 32, "imprimir" : 33, "VERDADERO" : 34 , "FALSO": 36};
var literales = {'"' : 37, "'" : 38};
var delimitadores = {"{" : 39, "}" : 40, "(" : 41, ")" : 42, ',' : 43, "." : 44};				
var puntoYComa = {";" : 45};

/**
 * Crea una tabla donde se inserta el codigo que ya ha sido compilado. 
 * @param {S} archivo 
 */
function crearCodigoCompilado(archivo){
	codigoCompilado = codigoCompilado.concat("<table style='margin: 25 px;' class='table table-striped table-dark'>");
	
	//Lineas de archivo
	for(var i = 0; i < archivo.length; i++) {
		codigoCompilado = codigoCompilado.concat("<tr id='linea-" + i + "'>");
		
		//Columnas de archivo
		for (var j = 0; j < archivo[i].length; j++) {
			codigoCompilado = codigoCompilado.concat("<td id='celula-" + i + "-" + j+ "'>" + 
			archivo[i][j] + "</td>");
		}
		
		codigoCompilado = codigoCompilado.concat("</tr>");
	}
	codigoCompilado = codigoCompilado.concat("</table>");
	exhibirCodigoCompilado();
}

/**
 * Devuelve el siguiente token de una linea
 * @param {*} linea  
 *      la linea actual de lectura 
 */
function getNextToken(linea) {
	var token;
	linea.value++;
	
	if (linea.value < tablaTokens.length)
		token = tablaTokens[linea.value][1];
	else token = null;
	
	return token;
}

/**
 * Funcion que trata al tipo de token declaracion
 * @param {*} token 
 * @param {*} linea 
 * @param {*} tieneError 
 */
function declaration (token , linea, tieneError) {
	 var columna;
	token = getNextToken(linea); 
	 //Se é um identificador
	 if (token == -1){
		token = getNextToken(linea);
		
		if (token != 45){		
			if (token != null) columna = tablaTokens[linea.value][3];
			else columna = tablaTokens[linea.value-1][3];
			
			if (token == 36) descripcionDelError = "No se permiten múltiples declaraciones en una línea.";
			else if (token == 2) descripcionDelError = "Las asignaciones en la línea de declaración no están permitidas.";
			else {
				linea.value--;
				columna = columna + 1;
				descripcionDelError = "La declaración debe terminar con un punto y coma.";
			}
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], columna);
			tieneError.value = 1;
		}  		
	} else {
		descripcionDelError = "Hace falta un identificador";
		insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
		tieneError.value = 1;
	}	 
}

/**
 * Funcion que trata a una expresion de asignacion
 * @param {*} token 
 * @param {*} linea 
 * @param {*} tieneError 
 */
function assignment_expression (token , linea, tieneError) {
	 token = getNextToken(linea);
	 	 
	 //Si es un signo igual 
	 if (token == 2){
		token = getNextToken(linea);
		expresion_de_asignacion_primera(token , linea, tieneError);		
		
	 } else {
		descripcionDelError = "Hace falta signo de agrupacion";
		insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
		tieneError.value = 1;
	 }	 
}

/**
 * Verifa la estructura de una operacion aritmetica
 * @param {]} token 
 * @param {*} linea 
 * @param {*} tieneError 
 */
function operacion_aritmetica (token , linea, tieneError) {

	 //Operadores aritméticos
	 if (token >= 12 && token <= 17){
		token = getNextToken(linea);
		
		//Identificador o constante
		if (token == -1 || token == -2){
			token = getNextToken(linea);			
			operacion_aritmetica (token , linea, tieneError);
			
		} else {
			descripcionDelError = "Hace falta un operador en la operacion";
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
		}
		
	//ERROR: Debe ser punto y coma
	 } else if (token != 45) {
			linea.value--;
			descripcionDelError = "La tarea debe terminar con un punto y coma.";
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
	 }
}

/**
 * Evalua que lo primero de una expesion se correcto. 
 * @param {*} token 
 * @param {*} linea 
 * @param {*} tieneError 
 */
function expresion_de_asignacion_primera (token , linea, tieneError) {
	
	//Commillas o comillas simples
    if (token == 37 || token == 38){
		token = getNextToken(linea);
		
		if (token != 31){
			linea.value--;
			descripcionDelError = "La tarea debe terminar con un punto y coma.";
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
		}
		
	//Identificador o constante
	 } else if (token == -1 || token == -2) {
		token = getNextToken(linea);		
		operacion_aritmetica (token , linea, tieneError);
	
	//ERROR DE ENTRADA
	 } else {
			descripcionDelError = "La asignación es incorrecta!";
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
	 }
}


/***
 * Evalua la funcion imprimir
 */
function imprimir_statement (token , linea, tieneError) {
	 token = getNextToken(linea);
	 	 
	 if (token == 29 || token==30 || token==-1){
	 	token = getNextToken(linea);
		if (token != 31){
			linea.value--;
			coumna = tablaTokens[linea.value][3] + 1;
			descripcionDelError = "La declaración debe terminar con un punto y coma.";
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], coumna);
			tieneError.value = 1;
		} 		
	} else {
		if (token == 34) descripcionDelError = "String no permitido entre parentesis";
		else descripcionDelError = "No es de tipo literal";

		if (token != null) 
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
		else {
			linea.value--
			coumna = tablaTokens[linea.value][3] + 1;
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], coumna);
			linea.value++
		}
		tieneError.value = 1;
	 }	 
}


/***
 * Função que verifica se e uma expressao de comparacao ou uma expressao logica entre um identificador e/ou uma constante
 * author: Isabella
 */
function expresion (token, linea, tieneError) {
	if (token == -1 || token == -2){	// si y un identificador o una constante
		token = getNextToken(linea);		
		if (token >= 3 && token <= 10)	{	// si eres un operador de comparación (<, >, <=, >=, ==, !=, ||, &&)
			token = getNextToken(linea);
			if (token != -1 && token != -2) {	// si no es una constante o un identificador
				descripcionDelError = "La comparación solo se puede hacer con constante y / o identificador";
				insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
				tieneError.value = 1;
			}
		} else if (token == 11) {	// si es un símbolo de negación (!)
			token = getNextToken(linea);
			if (token != -1) {	// si no es un identificador
				descripcionDelError = "La negación debe hacerse de la siguiente manera: !identificador.";
				insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
				tieneError.value = 1;
			} 
		} else {
			descripcionDelError = "La negación debe hacerse de la siguiente manera: !identificador.";
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
		}
	} else if (token == 11) {	//si es un símbolo de negación (!)
		token = getNextToken(linea);
		if (token != -1) {	// si no es un identificador
			descripcionDelError = "La negación debe hacerse de la siguiente manera: !identificador.";
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
		}
	} else {
		descripcionDelError = "Expresion inválida.";
		insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
		tieneError.value = 1;
	}
}

/***
 * 
 * 
 */
function fragmento_de_codigo (token, linea, tieneError) {
	var lineaAnterior = linea.value;	
	while (token != 33 && token != null) {						// La negación debe hacerse a continuación:	
		if (token == 20 || token == 21){						
			token = getNextToken(linea);
			if (token != 31) {
				linea.value--
				coumna = tablaTokens[linea.value][3] + 1;
				descripcionDelError = "Debe haber un punto y coma despues de la sentencia";
				insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], coumna);	
				linea.value++
				tieneError.value = 1;
			}
		} else 	{
			statement(token, linea);
		}
		token = getNextToken(linea);
	}	
	
	if (token != 33){
		linea.value = lineaAnterior-1;
		descripcionDelError = "Debe haber una tecla de cierre después de un bloque de código..";
		insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);	
		linea.value = tablaTokens.length;
	} else {
		linea.value = linea.value -1;
	}
}

/***
 * 
 * 
 * 
 */
function mientras_statement (token , linea, tieneError) {
	 token = getNextToken(linea);

	 if (token == 34) {	// Se abre parentesis
	 	token = getNextToken(linea);
	 	expresion(token , linea, tieneError);
	 	token = getNextToken(linea);
	 	if (token == 35) {		// Se cierran parentesis
	 		token = getNextToken(linea);
	 		if (token == 32){	// Se abre llave
	 			token = getNextToken(linea);
	 			fragmento_de_codigo(token , linea, tieneError);	// fecha llave dentro do code_snippet
	 			token = getNextToken(linea);
			} else {
				descripcionDelError = " Debe abrir la llave";
				insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
				tieneError.value = 1;
	 		}
	 	} else {
			descripcionDelError = "Debe cerrar el parentesis";
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
 		}

	 } else {
		descripcionDelError = 'Hace falta un parentesis';
		insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
		tieneError.value = 1;
	}
}

/**
 * Funcion encargada de tratar un if
 * @param {*} token 
 * @param {*} linea 
 * @param {*} tieneError 
 */
function if_statement_linea (token , linea, tieneError) {
	if (token == 32){	// Se abre llave
		token = getNextToken(linea);
		fragmento_de_codigo(token , linea, tieneError);	// fecha llave dentro do code_snippet
		token = getNextToken(linea);
	} else {
		descripcionDelError = " Después de la expresión, abra la llave.";
		insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
		tieneError.value = 1;
	}
}


/**
 * Funcion engargada de tratar un bloque if
 * @param {*} token 
 * @param {*} linea 
 * @param {*} tieneError 
 */
function if_statement (token , linea, tieneError) {
	token = getNextToken(linea);

	if (token == 34) {	// Se abren parentesis
	 	token = getNextToken(linea);
	 	expresion(token , linea, tieneError);
	 	token = getNextToken(linea);
	 	if (token == 35) {		// Se cierran parentesis
	 		token = getNextToken(linea);
	 		if (token == 32){	// Se abre llave
	 			token = getNextToken(linea);
	 			fragmento_de_codigo(token , linea, tieneError);	// Cerrar llave dentro de un bloque de codigo
	 			token = getNextToken(linea);
			 	if (token == 19) {	// si o else
					token = getNextToken(linea);
					if (token == 18){		//si for o un if
						if_statement (token , linea, tieneError);
					} else {
						 if_statement_linea (token , linea, tieneError) 
					}
	 			} 
	 		} else {
				descripcionDelError = "Tiene que abrir la llave";
				insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
				tieneError.value = 1;
	 		}
	 	} else {
			descripcionDelError = "Debe cerrar el parentesis";
			insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
 		}
	 } else {
		descripcionDelError = 'Hace falta un parentesis';
		insertarEnTablaErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
		tieneError.value = 1;
	}
}

/**
 * Muestra el codigo compilado en un div
 */
function exhibirCodigoCompilado() {
	codigoCompilado = codigoCompilado.concat("</tr></table>");
	divGeneral = divGeneral + codigoCompilado;
}

/**
 * Evalua una sentencia de codigo y la manda a evaluar especificamente a cada bloque
 * @param {*} token 
 * @param {*} linea 
 */
function statement (token, linea) {
	 var tieneError = {value: 0}; //mapa de errores

     //Si el token es una declaracion
	 if (token >= 22 && token <= 27){
		declaration(token , linea, tieneError);
		 
	// Si es un identificador - Asignación
	 } else if (token == -1) {
		assignment_expression(token , linea, tieneError);
	 // mientras
	 } else if (token == 30) {
		 mientras_statement(token , linea, tieneError);
		 
	 // imprimir 33
	 } else if (token == 23) {
		 imprimir_statement(token , linea, tieneError);
		 
	 // if - condicional
	 } else if (token == 18) {
		if_statement(token , linea, tieneError);
		 
	 }
	 
	 //Restaurar estado sin error, es decir, desplazarse hasta el final de la línea actual
	 if (tieneError.value == 1){
		 while ((linea.value < tablaTokens.length) && (tablaTokens[linea.value][3] != 0)) {
				linea.value++;
				// se detendrá en la siguiente línea correcta
		 }
		 linea.value--;
	 }
}

/**
 * 
 */
function sintatico () {
	var linea = {value: 0};	
	var token;

	while (linea.value < tablaTokens.length) {
		token = tablaTokens[linea.value][1];
		statement(token, linea);		
		linea.value++;			//Saltar Linea
	}
	 exibirErroresSintaticos();
}

/**
 * Funcion principal para tratar cada caso de token
 * @param {*} archivo 
 */
var main = function(archivo) {
	divGeneral = ''; 
	var lineasDelArchivo = archivo.length;								// Numero de lineas do archivo de entrada
	var vigilante = {value: 0};											// Primer Caracter leido
	var visorAFuturo = {value: 1};										// Puntero para leer cada token
	var bandera; 														// Variable para saber si hubieron erroes
	var retorno;														// Array de funciones de retorno
	
	//Creación de tablas   
	retorno = crearTablas(tablaIdentificadores, tablaTokens, tablaDeLiterales, tablaDeConstantes, 
	tablaErroresLexicos);

	tablaIdentificadores = retorno[0];
    tablaTokens = retorno[1];
    tablaLiterales = retorno[2];
    tablaConstantes = retorno[3];
    tablaErroresLexicos = retorno[4];
    tablaErroresSintaticos = retorno[5];
    

	// Analizando cada línea del archivo de entrada
	for (var lineaActual = 0; lineaActual < lineasDelArchivo; lineaActual++) {

		vigilante.value = 0;
		visorAFuturo.value = 1;
	
		//Desplazarse por los caracteres de línea
		while (vigilante.value < archivo[lineaActual].length) {
										
				if (archivo[lineaActual][vigilante.value] == " " || 
					archivo[lineaActual][vigilante.value] == '\t'|| 
					archivo[lineaActual][vigilante.value] == '\n') {
						
					consumirEspacios(archivo[lineaActual], vigilante, visorAFuturo);
				}
				
				if (archivo[lineaActual][vigilante.value] != undefined) { 
					
					if (delimitadores[archivo[lineaActual][vigilante.value]] != undefined) {
						
						tratarDelimitadores(tablaTokens, archivo[lineaActual], lineaActual, vigilante, visorAFuturo);
						
					} else if (((operadores[archivo[lineaActual][vigilante.value]] != undefined) || 
								(operadores[archivo[lineaActual][vigilante.value]+archivo[lineaActual][visorAFuturo.value]] != undefined)) && !(archivo[lineaActual][vigilante.value] == "/" &&  archivo[lineaActual][visorAFuturo.value] == "/")) {
						
						tratarOperadores (tablaTokens, archivo[lineaActual], vigilante, visorAFuturo, lineaActual);
						
					} else if (signoIgual[archivo[lineaActual][vigilante.value]] != undefined) {
						
						tratarSignoIgual (tablaTokens, archivo[lineaActual], lineaActual, vigilante, visorAFuturo);
						
					} else 	if (puntoYComa[archivo[lineaActual][vigilante.value]] != undefined) {
						
						tratarpuntoYComa (tablaTokens, archivo[lineaActual][vigilante.value], lineaActual, vigilante, visorAFuturo);	
						
					} else if (literales[archivo[lineaActual][vigilante.value]] != undefined) {
						
						tratarLiteral (tablaTokens, tablaLiterales, tablaErroresLexicos, archivo[lineaActual], vigilante, visorAFuturo, lineaActual);
						
					} else if (archivo[lineaActual][vigilante.value] == "/" && 
							   archivo[lineaActual][visorAFuturo.value] == "/" ) {
								   
						tratarComentario(tablaTokens, archivo[lineaActual], vigilante, visorAFuturo, lineaActual);
						
					} else if (esNumerico(archivo[lineaActual][vigilante.value]))  {
						
						tratarNumero (tablaTokens, tablaConstantes, tablaErroresLexicos, archivo[lineaActual], vigilante, visorAFuturo, lineaActual);
						
					} else if (isLetter(archivo[lineaActual][vigilante.value])){
						
						verificarToken(tablaTokens, tablaIdentificadores, archivo[lineaActual], vigilante, visorAFuturo, 
						lineaActual);		

					} else {			
						var descripcionDelError = "No se pudo detectar el error. ";
						insertarEnTablaErrores (tablaErroresLexicos, descripcionDelError, lineaActual, vigilante.value);
						vigilante.value = archivo[lineaActual].length + 1;
					}
				
			} else {
				vigilante.value = archivo[lineaActual].length + 1;
			}
		}//end While
	}//end for

	sintatico ();
	
	exibirTablas(tablaTokens, tablaConstantes, tablaLiterales, tablaIdentificadores,tablaErroresLexicos);

	return divGeneral;
}




/**
 * inicializa tablas de códigos intermedios para
  devuelto por el analizador léxico.
 * @param {*} tablaIdentificadores 
 * @param {*} tablaTokens 
 * @param {*} tablaLiterales 
 * @param {*} tablaConstantes 
 * @param {*} tablaErroresLexicos 
 */

function crearTablas(tablaIdentificadores, tablaTokens, tablaLiterales, tablaConstantes, 
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
  * @param {*} ColumnaCodigo columna del token en codigo
  * @param {*} ponteiro (puntero a la tabla auxiliar de referencia) == -1 si no hay tabla de referencia
  */
function insertarEnTablaDeTokens (tablaTokens, idToken, lineaCodigo, ColumnaCodigo, ponteiro){
	var idLinea = tablaTokens.length;
	
	tablaTokens[idLinea] = new Array();
	tablaTokens[idLinea][0] = idLinea;
	tablaTokens[idLinea][1] = idToken;
	tablaTokens[idLinea][2] = lineaCodigo;
	tablaTokens[idLinea][3] = ColumnaCodigo;
	tablaTokens[idLinea][4] = ponteiro;
	
}

/**
 * Inserta un nuevo token en la tabla de literales
 * @param {*} tablaLiterales 
 * @param {*} literal 
 * @param {*} lineaCodigo 
 * @param {*} ColumnaCodigo 
 */
function insertarTablaLiterales (tablaLiterales, literal, lineaCodigo, ColumnaCodigo) {
	var idLinea = tablaLiterales.length;
	
	tablaLiterales[idLinea] = new Array();
	tablaLiterales[idLinea][0] = idLinea;
	tablaLiterales[idLinea][1] = literal;
	tablaLiterales[idLinea][2] = lineaCodigo;
	tablaLiterales[idLinea][3] = ColumnaCodigo;

	return idLinea;
}

/**
 * Inserta un nuevo token en la tabla de indentificadores
 * @param {*} tablaIdentificadores 
 * @param {*} nomeIdentificador 
 * @param {*} lineaCodigo 
 * @param {*} ColumnaCodigo 
 */
insertarEnTablaDeIdentificadores = function (tablaIdentificadores, nomeIdentificador, lineaCodigo, ColumnaCodigo) {
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
		tablaIdentificadores[idLinea][3] = ColumnaCodigo;
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
 * @param {*} ColumnaCodigo 
 */
function insertarTablaDeConstanes(tablaConstantes, constante, lineaCodigo, ColumnaCodigo) {
	var idLinea = tablaConstantes.length;
	tablaConstantes[idLinea] = new Array();
	tablaConstantes[idLinea][0] = idLinea;
	tablaConstantes[idLinea][1] = constante;
	tablaConstantes[idLinea][2] = lineaCodigo;
	tablaConstantes[idLinea][3] = ColumnaCodigo;	
	//tablaConstantes[idLinea][2] = fkTablaIndetificadores;		//Variável referente ao valors
	return idLinea;
}


/**
 * Inserta un nuevo token en la tabla de errores
 * @param {*} tablaErrores 
 * @param {*} descripcionDelError 
 * @param {*} lineaCodigo 
 * @param {*} ColumnaCodigo 
 */
var insertarEnTablaErrores= function (tablaErrores, descripcionDelError, lineaCodigo, ColumnaCodigo) {
	var idLinea = tablaErrores.length;
	tablaErrores[idLinea] = new Array();
	tablaErrores[idLinea][0] = idLinea;
	tablaErrores[idLinea][1] = descripcionDelError;
	tablaErrores[idLinea][2] = lineaCodigo;
	tablaErrores[idLinea][3] = ColumnaCodigo;

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
	div = div + "<table style='margin: 25 px;' class='table table-striped table-dark'><thead><tr><th>id</th><th>Constante</th><th>Linea</th><th>Columna</th></tr></thead><tbody>";
	
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
		divGeneral= divGeneral + div;
	}
	
	div = "<h5>Tabla de Literales</h5>";
	div = div + "<table style='margin: 25 px;' class='table table-striped table-dark'><thead><tr><th>id</th><th>Literal</th><th>Linea</th><th>Columna</th></tr></thead><tbody>";
	
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
		divGeneral = divGeneral + div;
	}
	
	div = "<h5>Tabla de Identificadores</h5>";
	div = div + "<table style='margin: 25 px;' class='table table-striped table-dark'><thead><tr><th>id</th><th>Identificador</th><th>Linea</th><th>Columna</th></tr></thead><tbody>";
	
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
		divGeneral = divGeneral + div;
	}
	
	div = "";
	div = div + "<table style='margin: 25 px;' class='table table-striped table-dark'><thead><tr><th>id</th><th>Tipo de Error</th><th>Linea</th><th>Columna</th></tr></thead><tbody>";
	
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
		divGeneral = divGeneral + div;
		clase = "flash-fail";
	} else {
		divGeneral = divGeneral + div;
	}	


	divGeneral = divGeneral + tablaErroresLexicos.length;
			
}

function exibirErroresSintaticos(){
	var div = "";
	div = div + "<table style='margin: 25 px;' class='table table-striped table-dark'><thead><tr><th>id</th><th>Tipo de Error</th><th>Linea</th><th>Columna</th></tr></thead><tbody>";
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
		divGeneral = divGeneral + div;
	} else {
		divGeneral = divGeneral + div;
	}


	divGeneral = divGeneral + tablaErroresSintaticos.length;
}


function isLetter(str) {
	return str != undefined && str.match(/[a-z]/i) != null;
}

function esNumerico(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function consumirEspacios(linhaDoArquivo, sentinela, lookAhead){
	var newSentinela = sentinela.value;
	
	//Consumindo espaços e tabs
	 while ((newSentinela < linhaDoArquivo.length) && (linhaDoArquivo[newSentinela] == " " || linhaDoArquivo[newSentinela] == '\t')){
		 newSentinela++;
	}
	
	//Atualizando os ponteiros sentinela e lookAhead
	if (newSentinela != sentinela.value){
		sentinela.value = newSentinela;
		lookAhead.value = newSentinela + 1;
	
	//Final da linha
	} else if (linhaDoArquivo[newSentinela] == undefined && newSentinela+1 >= linhaDoArquivo.length){
		sentinela.value = newSentinela + 1;
		lookAhead.value = newSentinela + 2;
	}
}

function tratarComentario (tabelaTokens, linhaDoArquivo, sentinela, lookAhead, linhaAtual) {
	var idDelimitador = comentarios["//"];
	
	insertarEnTablaDeTokens(tabelaTokens, idDelimitador, linhaAtual, sentinela.value, -1);
	lookAhead.value = linhaDoArquivo.length;
	sentinela.value = lookAhead.value;
}


function tratarDelimitadores (tabelaTokens, arquivoLinhaAtual, linhaAtual, sentinela, lookAhead) {
	var idDelimitador;

	var valor = Object.keys(delimitadores).map(function(key){
    	idDelimitador = delimitadores[arquivoLinhaAtual[sentinela.value]];
	});

	insertarEnTablaDeTokens(tabelaTokens, idDelimitador, linhaAtual, sentinela.value, -1);
	sentinela.value = lookAhead.value;
	lookAhead.value = lookAhead.value + 1;
	consumirEspacios(arquivoLinhaAtual, sentinela, lookAhead);
}


function tratarSignoIgual (tabelaTokens, arquivoLinhaAtual, linhaAtual, sentinela, lookAhead) {
	var idDelimitador;

	var valor = Object.keys(signoIgual).map(function(key){
    	idDelimitador = signoIgual[arquivoLinhaAtual[sentinela.value]];
	});
	
	insertarEnTablaDeTokens(tabelaTokens, idDelimitador, linhaAtual, sentinela.value, -1);
	sentinela.value = lookAhead.value;
	lookAhead.value = lookAhead.value + 1;
	consumirEspacios(arquivoLinhaAtual, sentinela, lookAhead);
}


function tratarLiteral (tabelaTokens, tabelaLiterais, tabelaErrosLexicos, arquivoLinhaAtual, sentinela, lookAhead, linhaAtual) {
	var string = "";
	var retorno = new Array();
	var idLiteralCaracter;
	var descricaoErro;
	
	// char
	if (arquivoLinhaAtual[sentinela.value] == "'") {
		string = string.concat(arquivoLinhaAtual[lookAhead.value]);
		lookAhead.value = lookAhead.value + 1;
	
	// string
	} else {
		while ((arquivoLinhaAtual[lookAhead.value] != arquivoLinhaAtual[sentinela.value]) && 
		(lookAhead.value < arquivoLinhaAtual.length)) {
			string = string.concat(arquivoLinhaAtual[lookAhead.value]);
			lookAhead.value = lookAhead.value + 1;
		}
	}
	
	// Se fechou as aspas
	if (arquivoLinhaAtual[lookAhead.value] == arquivoLinhaAtual[sentinela.value]) {
		idLiteralCaracter = literales[arquivoLinhaAtual[sentinela.value]];
		var idLinha = insertarTablaLiterales(tabelaLiterais, string, linhaAtual, sentinela.value);
		insertarEnTablaDeTokens (tabelaTokens, idLiteralCaracter, linhaAtual, sentinela.value, idLinha); 	
		
		sentinela.value = lookAhead.value + 1;
		lookAhead.value = lookAhead.value + 2;
		consumirEspacios(arquivoLinhaAtual, sentinela, lookAhead);
	
	//erro não fechou aspas
	} else {	
		if (arquivoLinhaAtual[sentinela.value] == "'"){
			descricaoErro = "Hace falta comilla simple";
			
			//Até encontrar separador
			while (isLetter(arquivoLinhaAtual[lookAhead.value]) || esNumerico(arquivoLinhaAtual[lookAhead.value]) || arquivoLinhaAtual[lookAhead.value] == "'") {
				lookAhead.value = lookAhead.value + 1;
			}
		} else {
			descricaoErro = "Hace falta comilla simple";
			lookAhead.value = arquivoLinhaAtual.length;
		}
		
		insertarEnTablaErrores(tabelaErrosLexicos, descricaoErro, linhaAtual, sentinela.value);

		sentinela.value = lookAhead.value;
		lookAhead.value = lookAhead.value + 1;
	}
}

/***
 * Insere puntoYComa na tabela de tokens
 * author: Isabella
 */
function tratarpuntoYComa (tabelaTokens, arquivoLinhaAtual, linhaAtual, sentinela, lookAhead) {
	var idDelimitador;

	var valor = Object.keys(puntoYComa).map(function(key){
    	idDelimitador = puntoYComa[arquivoLinhaAtual];
	});

	insertarEnTablaDeTokens(tabelaTokens, idDelimitador, linhaAtual, sentinela.value, -1);
	sentinela.value = lookAhead.value;
	lookAhead.value = lookAhead.value + 1;
	consumirEspacios(arquivoLinhaAtual, sentinela, lookAhead);
}

/***
 * Função tratarOperadores: insere um operador token na tabela de tokens(tabela única)
 * @params: tabelaTokens, linhaDoArquivo, sentinela, lookAhead, linhaAtual
 * author:  Monica
 */
function tratarOperadores (tabelaTokens, linhaDoArquivo, sentinela, lookAhead, linhaAtual) {
	var operador = 	linhaDoArquivo[sentinela.value] + linhaDoArquivo[lookAhead.value];
	var idDelimitador;
	
	//Operador de dois caracteres
	if (operadores[operador] != undefined){
		idDelimitador = operadores[operador];
		lookAhead.value = lookAhead.value + 1;
	
	//Apenas o primeiro caracter é um operador
	} else if (operadores[linhaDoArquivo[sentinela.value]] != undefined){
		idDelimitador = operadores[linhaDoArquivo[sentinela.value]];
	}
	
	insertarEnTablaDeTokens(tabelaTokens, idDelimitador, linhaAtual, sentinela.value, -1);
	sentinela.value = lookAhead.value;
	lookAhead.value = lookAhead.value + 1;	
	consumirEspacios(linhaDoArquivo, sentinela, lookAhead);
}

/***
 * Função verificaNumero: a função verifica salva o numero na tabela de tokens e constantes
 * author: Isabella e Mônica
 */
function tratarNumero (tabelaTokens, tabelaConstantes, tabelaErrosLexicos, arquivoLinhaAtual, sentinela, lookAhead, linhaAtual) {
	var numero = arquivoLinhaAtual[sentinela.value];
	var erro = false;
	
	while (lookAhead.value < arquivoLinhaAtual.length) {

		if (esNumerico(arquivoLinhaAtual[lookAhead.value]) || arquivoLinhaAtual[lookAhead.value] == ".") {
			numero = numero.concat(arquivoLinhaAtual[lookAhead.value]);
		
		//Separador ou operador
		} else if (!isLetter(arquivoLinhaAtual[lookAhead.value])) {
			break;
		
		//Caracter literal - Erro
		} else {
			
			var descricaoErro = "Número inválido!";
			insertarEnTablaErrores (tabelaErrosLexicos, descricaoErro, linhaAtual, sentinela.value);
					
			erro = true;
			break;
		}	
		lookAhead.value = lookAhead.value + 1;
	}

	if (!erro) {
		numero = parseFloat(numero);
		var idLinha = insertarTablaDeConstanes(tabelaConstantes, numero, linhaAtual, sentinela.value) ;
		insertarEnTablaDeTokens (tabelaTokens, -2, linhaAtual, sentinela.value, idLinha) ; // id token -> constante = -2
		sentinela.value = lookAhead.value;
		lookAhead.value = lookAhead.value + 1;	
		consumirEspacios(arquivoLinhaAtual, sentinela, lookAhead);	
	} else {	
		while (lookAhead.value < arquivoLinhaAtual.length) {
			
			if (esNumerico(arquivoLinhaAtual[lookAhead.value]) || arquivoLinhaAtual[lookAhead.value] == 
			"." || isLetter(arquivoLinhaAtual[lookAhead.value])) {
				lookAhead.value++;
			
			//Separador ou operador
			} else {
				break;
			}
		}
	
		sentinela.value = lookAhead.value;
		lookAhead.value = sentinela.value + 1;
	}
}

/***
 * 
 * Verifica se e palavra reservada ou variavel ou erro
 * author: Isabella e Monica
 */
function verificarToken (tabelaTokens, tabelaIdentificadores, arquivoLinhaAtual, sentinela, lookAhead, linhaAtual){
	var palavra = arquivoLinhaAtual[sentinela.value];
	var erro = false;

	while (lookAhead.value < arquivoLinhaAtual.length) {

		//Apenas letras, com números ou com underscore
		if (isLetter(arquivoLinhaAtual[lookAhead.value]) ||
			esNumerico(arquivoLinhaAtual[lookAhead.value])|| 
			arquivoLinhaAtual[lookAhead.value] == "_") {
				
			palavra = palavra.concat(arquivoLinhaAtual[lookAhead.value]);
				
		//Separador encontrado
		} else {
			break;
		}
		
		lookAhead.value = lookAhead.value + 1;
	}
	
	//Variável
	if (palabrasReservadas[palavra] == undefined) {
		var idLinha = insertarEnTablaDeIdentificadores (tabelaIdentificadores, palavra, linhaAtual, sentinela.value) ;
		insertarEnTablaDeTokens (tabelaTokens, -1, linhaAtual, sentinela.value, idLinha) ;
	
	//Palavra reservada
	} else {
		var idToken = palabrasReservadas[palavra];
		insertarEnTablaDeTokens (tabelaTokens, idToken, linhaAtual, sentinela.value, -1) ;
	}

	sentinela.value = lookAhead.value;
	lookAhead.value = lookAhead.value + 1;	
}

module.exports = main;