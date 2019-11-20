/***
 * Função isLetter: a função verifica se um caracter é um número ou não
 * author: http://stackoverflow.com/questions/9862761/how-to-check-if-character-is-a-letter-in-javascript
 */
function isLetter(str) {
	return str != undefined && str.match(/[a-z]/i) != null;
}

/***
 * Função isNumeric: a função verifica um caracter é um número ou não
 * author: http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
 */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/***
 * Função download
 */
function download_tabelas() {
	var content = zip.generate({type:"blob"});
	saveAs(content, "tabelas.zip");
}

/***
 * Função consumirEspacos: Lê os espaços, tabs até o próximo caracter, separador ou número 
 * para ser analisado como token. Atualização das posições dos ponteiros sentinela e lookAhead.
 * @params:	linhaDoArquivo, sentinela, lookAhead
 * author: 	Monica
 */
function consumirEspacos(linhaDoArquivo, sentinela, lookAhead){
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

/***
 * Função tratarComentario: insere o comentário na tabela de tokens com a respectiva linha e 
 * coluna no código e -1 pois não referencia outra tabela(literais, constantes ou identificadores)
 * @params: tabelaTokens (tabela com todos os tokens - tabela única)
 * 			linhaDoArquivo (string com a linha do arquivo sendo analisada)
 * 			sentinela (coluna da linha do código, após o último token)
 * 			lookAhead (coluna do caracter analisado)
 * 			linhaAtual (linha do arquivo de entrada - código - sendo analisado)
 * author: Monica
 */
function tratarComentario (tabelaTokens, linhaDoArquivo, sentinela, lookAhead, linhaAtual) {
	var idDelimitador = comentario["//"];
	
	inserirTabelaTokens(tabelaTokens, idDelimitador, linhaAtual, sentinela.value, -1);
	lookAhead.value = linhaDoArquivo.length;
	sentinela.value = lookAhead.value;
}

/***
 * Insere delimitador na tabela de tokens
 * author: Isabella
 */
function tratarDelimitadores (tabelaTokens, arquivoLinhaAtual, linhaAtual, sentinela, lookAhead) {
	var idDelimitador;

	var valor = Object.keys(delimitadores).map(function(key){
    	idDelimitador = delimitadores[arquivoLinhaAtual[sentinela.value]];
	});

	inserirTabelaTokens(tabelaTokens, idDelimitador, linhaAtual, sentinela.value, -1);
	sentinela.value = lookAhead.value;
	lookAhead.value = lookAhead.value + 1;
	consumirEspacos(arquivoLinhaAtual, sentinela, lookAhead);
}

/***
 * Insere atribuicao na tabela de tokens
 * author: Isabella
 */
function tratarAtribuicao (tabelaTokens, arquivoLinhaAtual, linhaAtual, sentinela, lookAhead) {
	var idDelimitador;

	var valor = Object.keys(atribuicao).map(function(key){
    	idDelimitador = atribuicao[arquivoLinhaAtual[sentinela.value]];
	});
	
	inserirTabelaTokens(tabelaTokens, idDelimitador, linhaAtual, sentinela.value, -1);
	sentinela.value = lookAhead.value;
	lookAhead.value = lookAhead.value + 1;
	consumirEspacos(arquivoLinhaAtual, sentinela, lookAhead);
}

/***
 * Funcao tratarLiteral: verifica se é um char ou string. Concatena até encontrar as aspas que fecham a string.
 * author: Isabella
 */
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
		idLiteralCaracter = literais[arquivoLinhaAtual[sentinela.value]];
		var idLinha = inserirTabelaLiterais(tabelaLiterais, string, linhaAtual, sentinela.value);
		inserirTabelaTokens (tabelaTokens, idLiteralCaracter, linhaAtual, sentinela.value, idLinha); 	
		
		sentinela.value = lookAhead.value + 1;
		lookAhead.value = lookAhead.value + 2;
		consumirEspacos(arquivoLinhaAtual, sentinela, lookAhead);
	
	//erro não fechou aspas
	} else {	
		if (arquivoLinhaAtual[sentinela.value] == "'"){
			descricaoErro = "Tem algo errado com esse char... Aspas sem fechar ou mais de um caracter?!";
			
			//Até encontrar separador
			while (isLetter(arquivoLinhaAtual[lookAhead.value]) || isNumeric(arquivoLinhaAtual[lookAhead.value]) || arquivoLinhaAtual[lookAhead.value] == "'") {
				lookAhead.value = lookAhead.value + 1;
			}
		} else {
			descricaoErro = "Programador que é bom não esquece de fechar as aspas! #FicaADica";
			lookAhead.value = arquivoLinhaAtual.length;
		}
		
		inserirtabelaErros(tabelaErrosLexicos, descricaoErro, linhaAtual, sentinela.value);

		sentinela.value = lookAhead.value;
		lookAhead.value = lookAhead.value + 1;
	}
}

/***
 * Insere semicolon na tabela de tokens
 * author: Isabella
 */
function tratarSemicolon (tabelaTokens, arquivoLinhaAtual, linhaAtual, sentinela, lookAhead) {
	var idDelimitador;

	var valor = Object.keys(semicolon).map(function(key){
    	idDelimitador = semicolon[arquivoLinhaAtual];
	});

	inserirTabelaTokens(tabelaTokens, idDelimitador, linhaAtual, sentinela.value, -1);
	sentinela.value = lookAhead.value;
	lookAhead.value = lookAhead.value + 1;
	consumirEspacos(arquivoLinhaAtual, sentinela, lookAhead);
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
	
	inserirTabelaTokens(tabelaTokens, idDelimitador, linhaAtual, sentinela.value, -1);
	sentinela.value = lookAhead.value;
	lookAhead.value = lookAhead.value + 1;	
	consumirEspacos(linhaDoArquivo, sentinela, lookAhead);
}

/***
 * Função verificaNumero: a função verifica salva o numero na tabela de tokens e constantes
 * author: Isabella e Mônica
 */
function tratarNumero (tabelaTokens, tabelaConstantes, tabelaErrosLexicos, arquivoLinhaAtual, sentinela, lookAhead, linhaAtual) {
	var numero = arquivoLinhaAtual[sentinela.value];
	var erro = false;
	
	while (lookAhead.value < arquivoLinhaAtual.length) {

		if (isNumeric(arquivoLinhaAtual[lookAhead.value]) || arquivoLinhaAtual[lookAhead.value] == ".") {
			numero = numero.concat(arquivoLinhaAtual[lookAhead.value]);
		
		//Separador ou operador
		} else if (!isLetter(arquivoLinhaAtual[lookAhead.value])) {
			break;
		
		//Caracter literal - Erro
		} else {
			
			var descricaoErro = "Número inválido! Você acha que número e letra é a mesma coisa!?";
			inserirtabelaErros (tabelaErrosLexicos, descricaoErro, linhaAtual, sentinela.value);
					
			erro = true;
			break;
		}	
		lookAhead.value = lookAhead.value + 1;
	}

	if (!erro) {
		numero = parseFloat(numero);
		var idLinha = inserirTabelaConstantes(tabelaConstantes, numero, linhaAtual, sentinela.value) ;
		inserirTabelaTokens (tabelaTokens, -2, linhaAtual, sentinela.value, idLinha) ; // id token -> constante = -2
		sentinela.value = lookAhead.value;
		lookAhead.value = lookAhead.value + 1;	
		consumirEspacos(arquivoLinhaAtual, sentinela, lookAhead);	
	} else {	
		while (lookAhead.value < arquivoLinhaAtual.length) {
			
			if (isNumeric(arquivoLinhaAtual[lookAhead.value]) || arquivoLinhaAtual[lookAhead.value] == 
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
			isNumeric(arquivoLinhaAtual[lookAhead.value])|| 
			arquivoLinhaAtual[lookAhead.value] == "_") {
				
			palavra = palavra.concat(arquivoLinhaAtual[lookAhead.value]);
				
		//Separador encontrado
		} else {
			break;
		}
		
		lookAhead.value = lookAhead.value + 1;
	}
	
	//Variável
	if (palavrasReservadas[palavra] == undefined) {
		var idLinha = inserirTabelaIdentificadores (tabelaIdentificadores, palavra, linhaAtual, sentinela.value) ;
		inserirTabelaTokens (tabelaTokens, -1, linhaAtual, sentinela.value, idLinha) ;
	
	//Palavra reservada
	} else {
		var idToken = palavrasReservadas[palavra];
		inserirTabelaTokens (tabelaTokens, idToken, linhaAtual, sentinela.value, -1) ;
	}

	sentinela.value = lookAhead.value;
	lookAhead.value = lookAhead.value + 1;	
}