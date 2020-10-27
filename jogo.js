//Mapa representado em Arrays
//Na representação, o primeiro índice será X e o segundo Y
//Dentro da posição, terá 3 elementos onde o primeiro será Wumpus, Poço OU Brilho,
// o segundo será Fedor e o terceiro será Brisa
const mapa = Array(4);
mapa[0] = Array(4);
mapa[1] = Array(4);
mapa[2] = Array(4);
mapa[3] = Array(4);
mapa[0][0] = ["", "", ""];
mapa[0][1] = ["","Fedor",""];
mapa[0][2] = ["Wumpus","",""];
mapa[0][3] = ["","Fedor",""];
mapa[1][0] = ["","","Brisa"];
mapa[1][1] = ["","",""];
mapa[1][2] = ["Brilho", "Fedor","Brisa"];
mapa[1][3] = ["","",""];
mapa[2][0] = ["Buraco","",""];
mapa[2][1] = ["","","Brisa"];
mapa[2][2] = ["Buraco", "", ""];
mapa[2][3] = ["", "", "Brisa"];
mapa[3][0] = ["","","Brisa"];
mapa[3][1] = ["","",""];
mapa[3][2] = ["","","Brisa"];
mapa[3][3] = ["Buraco","",""];

//Array que ficará os possiveis POÇOS e WUMPUS
var possiveisPocos = [];
var possiveisWumpus = [];
//Array com os caminhos percorridos
var caminhosPercorridos = [];
//Zonas Seguras, são criadas quando o script chega em uma posição e não sente Fedor ou Brisa, o que significa que suas adjacentes
//Não tem Wumpus ou Poços respectivamente
var zonasSemWumpus = [];
var zonasSemPocos = [];

//Constantes
const opcoesValidas = ["moverCima", "moverDireita", "moverBaixo", "moverEsquerda"];
const direcoes = ["Cima", "Baixo", "Direita", "Esquerda"];
const acoes = {
    moverCima: function(x, y){
        if( (y + 1) <= 3 ){
            return [x, y + 1];
        }
        else{
            return [-1, -1];
        }
    },
    moverBaixo: function(x, y){
        if( (y - 1) >= 0 ){
            return [x, y - 1];
        }
        else{
            return [-1, -1];
        }
    },
    moverEsquerda: function(x, y){
        if( (x - 1) >= 0 ){
            return [x - 1, y];
        }
        else{
            return [-1, -1];
        }
    },
    moverDireita: function(x, y){
        if( (x + 1) <= 3 ){
            return [x + 1, y];
        }
        else{
            return [-1, -1];
        }
    },

    atirar: function(x, y, direcao){
        switch(direcao){
            case "Direita":
                x = x + 1;
            break;
            case "Esquerda":
                x = x - 1;
            break;
            case "Cima":
                y = y + 1;
            break;
            case "Baixo":
                y = y - 1;
            break;
        }
        console.log("Efetuando disparo direcionado para: " + direcao + " - Nas coordenadas X:" + (x + 1) + " Y: "+ (y + 1));
        if(mapa[x][y][0] == "Wumpus"){
            return true
        }
        else{
            return false;
        }
    },
    pegarOuro: function(x, y){
        if(mapa[x][y][0] == "Brilho"){
            return true;
        }
        else{
            return false;
        }
    }
}
//Funcoes Auxiliares
function existeNaArray(array, x, y){
    var retorno = -1;
    array.forEach(function(value, index){
        if(value[0] == x && value[1] == y){
            retorno = index;
            return;
        }
    });
    return retorno;
}

//Funcao retorna a Chava caso encontre posições em que Wumpus tem grandes chances de estar, ou -1
function adicionaPerigo(tipo, x, y){
    var keys = [];
    var retorno;
    opcoesValidas.forEach( opcao => {
        retorno = acoes[opcao](x,y);
        //Se for caminho valido e não tiver em caminhos percorridos, adiciona possivel perigo
        if(retorno[0] != -1 && existeNaArray(caminhosPercorridos, retorno[0], retorno[1]) == - 1){
            if(tipo == "Wumpus"){
                //Só adicionará na Array de possiveis Wumpus se não for uma zona que o Script já sabe que é segura
                if( existeNaArray(zonasSemWumpus, retorno[0], retorno[1]) == -1){
                    var key = existeNaArray(possiveisWumpus, retorno[0], retorno[1]);
                    console.log("Risco de Wumpus adicionado em X: " + (retorno[0] + 1) + " Y: "+ (retorno[1] + 1));
                    if(key == -1){
                        //Parametros posição X, Posicao Y e quantas evidências tem de que há um Wumpus nessa coordenada
                        possiveisWumpus.push( [retorno[0], retorno[1], 1] );
                    }
                    else{
                        //Adiciona uma evidência
                        possiveisWumpus[key][2]= possiveisWumpus[key][2] + 1;
                        keys.push(key);
                    }
                }
                else{
                    console.log("Perigo não adicionado - Zona segura de Wumpus X: " + (retorno[0] + 1) + " Y: "+ (retorno[1] + 1));
                }
            }
            else{
                //Só adicionará na Array de possiveis Poços se não for uma zona que o script já sabe que é segura
                if( existeNaArray(zonasSemPocos, retorno[0], retorno[1]) == -1){
                    if( existeNaArray(possiveisPocos, retorno[0], retorno[1]) == -1 ){
                        console.log("Risco de Poço adicionado em X: " + (retorno[0] + 1) + " Y: "+ (retorno[1] + 1));
                        possiveisPocos.push( [retorno[0], retorno[1]] );
                    }
                }
                else{
                    console.log("Perigo não adicionado - Zona segura de poço X: " + (retorno[0] + 1) + " Y: "+ (retorno[1] + 1));
                }
            }
        }
    });  
    return keys; 
}

function removePerigo(tipo, x, y){
    var retorno;
    opcoesValidas.forEach( opcao => {
        retorno = acoes[opcao](x,y);
        if(retorno[0] != -1){
            if(tipo == "Wumpus"){
                if(existeNaArray(zonasSemWumpus, retorno[0], retorno[1]) == -1){
                    console.log("Zona segura de Wumpus adicionado em X: " + (retorno[0] + 1) + " Y: "+ (retorno[1] + 1))
                    zonasSemWumpus.push([retorno[0], retorno[1]]);
                    var key = existeNaArray(possiveisWumpus, retorno[0], retorno[1]);
                    if(key != -1){
                        console.log("Removendo risco de Wumpus em: "+ (retorno[0] + 1) + " Y: "+ (retorno[1] + 1));
                        possiveisWumpus.splice(key, 1);
                    }
                }
            }
            else{
                if(existeNaArray(zonasSemPocos, retorno[0], retorno[1]) == -1){
                    console.log("Zona segura de Poço adicionado em X: " + (retorno[0] + 1) + " Y: "+ (retorno[1] + 1))
                    zonasSemPocos.push( [retorno[0], retorno[1]] );
                    var key = existeNaArray(possiveisPocos, retorno[0], retorno[1]);
                    if(key != -1){
                        console.log("Removendo risco de Poço em: "+ (retorno[0] + 1) + " Y: "+ (retorno[1] + 1));
                        possiveisPocos.splice(key, 1);
                    }
                }
            }
        }
    });
}
//Funcao principal
function mostrarResultado(botao){

    //Declara variaveis
    var retorno;var valida; var i; var posX; var posY; var c;var opcao; var elemento;var keys; var direcaoMira; var acertouWumpus;
    //Auxiliar para caso ele precisa retornar um passo, para não deixar ele repetir a jogada e ficar em loop
    var direcaoAnt = "";
    //Posicao Inicial
    var posicaoX = 0;
    var posicaoY = 0;
    var direcao = "Inicio";
    //Requisitos para finalizar o jogo, Morrer ou matar 1 Wumpus E coletar 1 OURO
    var vivo = 1;
    var ouros = 0;
    var wumpus = 0;
    var pontos = 0;
    //Contador de Jogadas
    var jogadas = 0;
    var aux = 0;
    //Parto do pressuposto que o Inicio nunca terá nada (Brisa e nem Fedor)
    caminhosPercorridos.push([0,0, direcao]);
    zonasSemPocos.push([0,1]);
    zonasSemPocos.push([1,0]);
    zonasSemWumpus.push([0,1]);
    zonasSemWumpus.push([1,0]);
    //Sai do Loop se personagem morrer ou coletar 1 ouro E eliminar 1 Wumpus
    while(vivo == 1 && (ouros == 0 || wumpus == 0)){
        aux++;
        //Variaveis para Visualizações
        posX = posicaoX + 1;
        posY = posicaoY + 1;
        ultDirecao = caminhosPercorridos[jogadas][2];
        console.log("Posição atual X:" + posX +" - " + "Y: " + posY);// + "- Direcao tomada para chegar aqui:" + ultDirecao);
        console.log("Pontos atuais: " + pontos);
        //Percorre todas as direções possiveis (Cima, Baixo, Direita e Esquerda)
        for(i = 0; i < 4; i++){
            opcao = opcoesValidas[i];
            valida = 0;
            retorno = acoes[opcao](posicaoX, posicaoY);
            direcao = opcao.substring(5);
            //É uma direção Valida? (Não sai para fora do mapa)
            if(retorno[0] == -1){
                //Não é Valida
                valida = 1;
                console.log("Nao anda: " + direcao +": Sai pra fora do mapa");
            }
            else{
                //Valida se é seguro se mover para lá
                if(existeNaArray(possiveisPocos,retorno[0], retorno[1]) != -1 || existeNaArray(possiveisWumpus, retorno[0], retorno[1]) != -1){
                    //Nao anda
                    console.log("Nao anda: " + direcao +": Possível Poço ou Possível Wumpus - X: " + (retorno[0] + 1) + " Y: "+ (retorno[1] + 1));
                    valida = 1;
                }
                if(existeNaArray(caminhosPercorridos, retorno[0], retorno[1]) != -1){
                    //Nao anda
                    console.log("Nao anda: " + direcao +": Caminho ja percorrido - X: " + (retorno[0] + 1) + " Y: "+ (retorno[1] + 1));
                    valida = 1;
                }
                if(valida == 0){
                    console.log("Se moveu para: " + direcao);
                    //Se moveu
                    pontos--;
                    direcaoAnt = "";
                    posicaoX = retorno[0];
                    posicaoY = retorno[1];
                    caminhosPercorridos.push( [posicaoX, posicaoY, direcao] );
                    i = 4;
                    jogadas++;
                    //Verifica o que encontrou
                    for(c = 0; c < 4; c++){
                        elemento = mapa[posicaoX][posicaoY][c];
                        if(c == 0){
                            //Wumpus ou Poço mata o personagem, Brilho aciona ação de pegar Ouro
                            if(elemento == "Wumpus" || elemento == "Poco"){
                                vivo = 0;
                                c = 4;
                            }
                            if(elemento == "Brilho"){
                                achouOuro = acoes["pegarOuro"](posicaoX,posicaoY);
                                if(achouOuro){
                                    ouros++;
                                    console.log("Achou ouro. Quantidade ouros coletados: " + ouros);
                                    pontos = pontos + 1000;
                                }
                            }
                        }
                        if(c == 1){
                            if(elemento == "Fedor"){
                                console.log("Sentiu fedor, adiciona perigo de Wumpus nas adjacentes validas");
                                keys = adicionaPerigo("Wumpus", posicaoX, posicaoY);
                                keys.forEach(function(key){
                                    //Se função retornou posições cmo chances altas de ter um Wumpus (Chaves da possiveisWumpus diferente de -1)
                                    if(key != -1){
                                        //Aqui deixei somente 2 a quantidade de evidencias necessárias antes de efetuar o disparo
                                        //Por conta do tamanho do mapa
                                        if(possiveisWumpus[key][2] >= 2){
                                            console.log("Grandes chances de ter um Wumpus em: X: " + (possiveisWumpus[key][0] + 1) + " Y: " + (possiveisWumpus[key][1] + 1) + " preparando para efetuar disparo");
                                            if(possiveisWumpus[key][0] > posicaoX){
                                                direcaoMira = "Direita";
                                            } 
                                            else if(possiveisWumpus[key][0] < posicaoX){
                                                direcaoMira = "Esquerda";
                                            }
                                            else if(possiveisWumpus[key][1] > posicaoY){
                                                direcaoMira = "Cima";
                                            }
                                            else if(possiveisWumpus[key][1] < posicaoY){
                                                direcaoMira = "Baixo";
                                            }
                                            acertouWumpus = acoes["atirar"](posicaoX, posicaoY, direcaoMira);
                                            if(acertouWumpus){
                                                pontos = pontos+1000;
                                                wumpus++;
                                                console.log("Acertou Wumpus. Wumpus eliminados: " + wumpus);
                                            }
                                        }
                                    }
                                });
                            }
                            else{
                                //Não sentiu Fedor, considera adjacentes Zona Segura de Wumpus
                                console.log("Não sentiu Fedor, adjacentes validas não contem Wumpus");
                                removePerigo("Wumpus", posicaoX, posicaoY);
                            }
                        }
                        if(c == 2){
                            if(elemento == "Brisa"){
                                console.log("Sentiu Brisa, adiciona perigo de Buraco nas adjacentes validas");
                                adicionaPerigo("Buraco", posicaoX, posicaoY);
                            }
                            else{
                                //Não sentiu Fedor, considera adjacentes Zona Segura de Wumpus
                                console.log("Não sentiu Brisa, adjacentes validas não contem Poços");
                                removePerigo("Poco", posicaoX, posicaoY);
                            }
                        }
                    }
                }
            }
        }
        if(valida == 1){
            console.log("Não achou caminho valido, Retorna um passo");
            pontos--;
            //Percorreu todas as possiveis direções, porém não achou nenhuma valida e/ou segura, retorna um passo
            posicaoX = caminhosPercorridos[jogadas - 1][0];
            posicaoY = caminhosPercorridos[jogadas - 1][1];
        }
    }
    if(vivo == 1){
        console.log("Programa encerrado!");
        console.log("Pontos: " + pontos);
        console.log("Ouros: " + ouros);
        console.log("Wumpus Eliminados: "+ wumpus);
    }
    else{
        console.log("Personagem morreu!");
        console.log("Pontos: " + pontos);
        console.log("Ouros: " + ouros);
        console.log("Wumpus Eliminados: "+ wumpus);
    }
    botao.style.display = "none";
}