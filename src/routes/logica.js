var tablaDeLiterales = 0;										// Tabla de letras
var tablaDeLetras = 0;								            // Tabla de Indentificadores
var tablaDeTokens = 0;										    // Tabla de tokens
var tablaDeConstantes = 0;									    // Tabla de Constantes
var tablaDeErroresLexicos = 0;								 	// Tabla de errores lexicos
var tablaDeErroresSintacticos = 0;								// Tabla de errores sintaticos
var codigoCompilado = "";

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
var agrupacion = {"{" : 39, "}" : 40, "(" : 41, ")" : 42, ',' : 43, "." : 44};				
var puntoYComa = {";" : 45};



/**
 * Crea una tabla donde se inserta el codigo que ya ha sido compilado. 
 * @param {S} archivo 
 */
function crearCodigoCompilado(archivo){
	codigoCompilado = codigoCompilado.concat("<table>");
	
	//Lineas de archivo
	for(var i = 0; i < archivo.length; i++) {
		codigoCompilado = codigoCompilado.concat("<tr id='linea-" + i + "'>");
		
		//Colunas do archivo
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
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], columna);
			tieneError.value = 1;
		}  		
	 } else {
		descripcionDelError = "Declaracion Incorrecta! Depois de um tipo deve ser um identificador.";
		insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
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
		descripcionDelError = "Asignación incorrecta! Después de que un identificador debe contener un signo de asignación";
		insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
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
			descripcionDelError = "La operación aritmética debe tener un operador entre dos factores.";
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
		}
		
	//ERROR: Debe ser punto y coma
	 } else if (token != 45) {
			linea.value--;
			descripcionDelError = "La tarea debe terminar con un punto y coma.";
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
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
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
		}
		
	//Identificador o constante
	 } else if (token == -1 || token == -2) {
		token = getNextToken(linea);		
		operacion_aritmetica (token , linea, tieneError);
	
	//ERROR DE ENTRADA
	 } else {
			descripcionDelError = "La asignación es incorrecta!";
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
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
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], coumna);
			tieneError.value = 1;
		} 		
	} else {
		if (token == 34) descripcionDelError = "String no permitido entre parentesis";
		else descripcionDelError = "¡Declaración incorrecta! La declaración debe ser de tipo print literal";

		if (token != null) 
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
		else {
			linea.value--
			coumna = tablaTokens[linea.value][3] + 1;
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], coumna);
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
				insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
				tieneError.value = 1;
			}
		} else if (token == 11) {	// si es un símbolo de negación (!)
			token = getNextToken(linea);
			if (token != -1) {	// si no es un identificador
				descripcionDelError = "La negación debe hacerse de la siguiente manera: !identificador.";
				insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
				tieneError.value = 1;
			} 
		} else {
			descripcionDelError = "La negación debe hacerse de la siguiente manera: !identificador.";
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
		}
	} else if (token == 11) {	//si es un símbolo de negación (!)
		token = getNextToken(linea);
		if (token != -1) {	// si no es un identificador
			descripcionDelError = "La negación debe hacerse de la siguiente manera: !identificador.";
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
		}
	} else {
		descripcionDelError = "Expresion inválida.";
		insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
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
				insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], coumna);	
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
		insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);	
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
				descripcionDelError = " Despues de la expresion, abrir la llave";
				insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
				tieneError.value = 1;
	 		}
	 	} else {
			descripcionDelError = "Debe cerrar los paréntesis después de una expresión";
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
 		}

	 } else {
		descripcionDelError = 'Declaracion Incorrecta! La declaración debe tener un paréntesis.';
		insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
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
		insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
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
				descripcionDelError = " Después de una expresion, abrir una llave.";
				insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
				tieneError.value = 1;
	 		}
	 	} else {
			descripcionDelError = "Debe cerrar los paréntesis después de una expresión..";
			insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
			tieneError.value = 1;
 		}
	 } else {
		descripcionDelError = 'Declaracion Incorrecta! La declaración debe tener un paréntesis.';
		insertarEnTablaDeErrores(tablaErroresSintaticos, descripcionDelError, tablaTokens[linea.value][2], tablaTokens[linea.value][3]);
		tieneError.value = 1;
	}
}

/**
 * Muestra el codigo compilado en un div
 */
function exhibirCodigoCompilado() {
	codigoCompilado = codigoCompilado.concat("</tr></table>");
	var divCodigoCompilado = document.getElementById('codigoCompilado');
	divCodigoCompilado.innerHTML = codigoCompilado;
	divCodigoCompilado.classList.remove("ocultar-div");  //le quitamos la clase que oculta el div


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
function main (archivo) {
	
	var lineasDelArchivo = archivo.length;								// Numero de lineas do archivo de entrada
	var vigilante = {value: 0};											// Primer Caracter leido
	var visorAFuturo = {value: 1};										// Puntero para leer cada token
	var bandera; 														// Variable para saber si hubieron erroes
	var retorno;														// Array de funciones de retorno
	
	//Creación de tabla
	retorno = crearTablas(tablaIdentificadores, tablaTokens, tablaLiterales, tablaConstantes, 
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
						
					} else if (atribuicao[archivo[lineaActual][vigilante.value]] != undefined) {
						
						tratarAtribuicao (tablaTokens, archivo[lineaActual], lineaActual, vigilante, visorAFuturo);
						
					} else 	if (semicolon[archivo[lineaActual][vigilante.value]] != undefined) {
						
						tratarSemicolon (tablaTokens, archivo[lineaActual][vigilante.value], lineaActual, vigilante, visorAFuturo);	
						
					} else if (literais[archivo[lineaActual][vigilante.value]] != undefined) {
						
						tratarLiteral (tablaTokens, tablaLiterales, tablaErroresLexicos, archivo[lineaActual], vigilante, visorAFuturo, lineaActual);
						
					} else if (archivo[lineaActual][vigilante.value] == "/" && 
							   archivo[lineaActual][visorAFuturo.value] == "/" ) {
								   
						tratarComentario(tablaTokens, archivo[lineaActual], vigilante, visorAFuturo, lineaActual);
						
					} else if (isNumeric(archivo[lineaActual][vigilante.value]))  {
						
						tratarNumero (tablaTokens, tablaConstantes, tablaErroresLexicos, archivo[lineaActual], vigilante, visorAFuturo, lineaActual);
						
					} else if (isLetter(archivo[lineaActual][vigilante.value])){
						
						verificarToken(tablaTokens, tablaIdentificadores, archivo[lineaActual], vigilante, visorAFuturo, 
						lineaActual);		

					} else {			
						var descripcionDelError = "No se pudo detectar el error. ";
						insertarEnTablaDeErrores (tablaErroresLexicos, descripcionDelError, lineaActual, vigilante.value);
						vigilante.value = archivo[lineaActual].length + 1;
					}
				
			} else {
				vigilante.value = archivo[lineaActual].length + 1;
			}
		}//end While
	}//end for

	sintatico ();
	
	exibirTablas(tablaTokens, tablaConstantes, tablaLiterales, tablaIdentificadores,tablaErroresLexicos);
	gerarArquivoTexto(tablaTokens, tablaConstantes, tablaLiterales, tablaErroresLexicos, tablaIdentificadores, tablaErroresSintaticos);

}//End main

}
