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
