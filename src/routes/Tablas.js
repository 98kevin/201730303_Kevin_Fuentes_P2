/***
 * Função crearTablas: a função inicializa as tablas do código intermediário para 
 * serem retornadas pelo analisador léxico.
 * @param: tablaIdentificadores, tablaDelimitadores, tablaLiterales, 
 * 		   tablaTokens, tablaCodigos, tablaConstantes
 * author: Isabella e Monica
 */
function crearTablas(tablaIdentificadores, tablaTokens, tablaLiterales, tablaConstantes, 
    tablaErroresLexicos) {
        var retorno = new Array();
    
        // Inicialização da matriz de tablaIdentificadores
        tablaIdentificadores = new Array();
        
        // Inicialização da matriz de tabla unica
        tablaTokens = new Array();
    
        // Inicialização da matriz de tablaLiterales
        tablaLiterales = new Array();
        
        // Inicialização da matriz de constantes
        tablaConstantes = new Array();
        
        // Inicialização da matriz de erros lexicos
        tablaErroresLexicos = new Array();
        
        // Inicialização da matriz de erros sintaticos
        tablaErroresSintaticos = new Array();
        
        retorno[0] = tablaIdentificadores;
        retorno[1] = tablaTokens;
        retorno[2] = tablaLiterales;
        retorno[3] = tablaConstantes;
        retorno[4] = tablaErroresLexicos;
        retorno[5] = tablaErroresSintaticos;
    
        return retorno;
    }