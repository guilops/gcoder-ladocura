import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(here, "..");
const output = path.join(project, ".private-course", "logica-de-programacao-visualg-gamificada.html");

const pages = [
  { chapter: "PRÓLOGO · 01", title: "Bem-vinda à sua primeira missão", lead: "Esta apostila é para quem olha para uma tela de código e pensa: ‘não sei nem por onde começar’. Você não precisa ter estudado matemática avançada, conhecer computadores por dentro ou já ter escrito uma linha de código. Vamos construir o entendimento em camadas: primeiro o problema e o raciocínio; depois os passos; por fim, a escrita e a execução no VisuAlg. Leia sem pressa, teste os exemplos e volte às páginas anteriores sempre que precisar.", facts: [["O que você vai aprender", "Entender computador, programa, lógica, algoritmo, pseudocódigo e IDE; planejar soluções; escrever e testar algoritmos no VisuAlg."], ["Ao concluir", "Você será capaz de explicar a diferença entre lógica, algoritmo e programa; ler e escrever soluções simples; usar variáveis, entradas e saídas, decisões, repetições, procedimentos, funções e vetores; testar e corrigir erros comuns."], ["Como a trilha avança", "Começamos com conceitos do cotidiano e exemplos sem código. Em seguida desenhamos soluções, conhecemos a ferramenta e escrevemos programas cada vez mais completos, até montar jogos e um projeto final."], ["Como estudar", "Faça uma missão por vez. Antes de ver a pista, tente responder. Simule os valores no papel, digite o exemplo, execute, mude uma coisa e observe o que aconteceu. Errar é uma informação útil para a próxima tentativa."], ["O que você precisa", "Curiosidade, papel e lápis. O VisuAlg é apresentado adiante; você pode ler a introdução primeiro e instalar ou abrir a ferramenta quando chegar à missão de preparação."]], challenge: "Escreva o que gostaria de conseguir criar com programação. No fim da apostila, volte a esta resposta e veja o quanto avançou.", hint: "Não tente decorar tudo. Entenda uma ideia, experimente e explique-a com suas próprias palavras. +10 XP" },
  { chapter: "MUNDO 1 · 03", title: "O que é um computador?", lead: "Um computador recebe informações, guarda parte delas, executa instruções e apresenta resultados. Ele não adivinha a intenção de quem programa: precisa de comandos claros, organizados e possíveis de executar.", facts: [["Entrada", "Dados que chegam ao sistema: teclado, mouse, sensor, arquivo ou uma resposta digitada."], ["Processamento", "Instruções transformam ou analisam os dados. A CPU executa operações seguindo a ordem definida."], ["Saída e armazenamento", "A tela, o som ou uma impressão mostram resultados; memória e disco guardam dados por tempos diferentes."]], code: "ENTRADA: duas notas\nPROCESSAMENTO: calcular a média\nSAÍDA: mostrar a média", challenge: "Para um despertador, identifique uma entrada, um processamento e uma saída.", hint: "Exemplo: hora configurada; comparar com o relógio; tocar o alarme. +15 XP" },
  { chapter: "MUNDO 1 · 04", title: "Hardware, software e dados", lead: "Hardware é a parte física que você pode tocar. Software é o conjunto de instruções e programas. Dados são as informações que esses programas recebem, produzem ou armazenam.", facts: [["Hardware", "Teclado, monitor, memória, processador e celular são componentes físicos."], ["Software", "Sistema operacional, navegador, editor e jogo orientam o hardware a realizar tarefas."], ["Dados", "Um nome, uma nota ou uma temperatura não é o programa: é informação processada pelo programa."]], challenge: "Classifique: navegador, mouse, senha digitada e resultado exibido na tela.", hint: "Software, hardware, dado de entrada e dado de saída. +15 XP" },
  { chapter: "MUNDO 1 · 05", title: "Programar, linguagem e IDE", lead: "Programar é transformar uma solução em instruções que uma ferramenta consegue interpretar e executar. Para isso usamos uma linguagem com palavras e regras. E escrevemos dentro de um ambiente que reúne ferramentas úteis para criar e testar o programa.", facts: [["Lógica e linguagem", "A lógica ajuda a decidir como resolver o problema. A linguagem serve para registrar os passos com uma sintaxe específica. A mesma lógica pode ser escrita em linguagens diferentes."], ["O que é uma IDE?", "IDE significa Ambiente de Desenvolvimento Integrado. É um programa que reúne recursos como editor de código, execução e mensagens de erro; algumas IDEs também oferecem ferramentas para acompanhar o programa enquanto ele roda."], ["Editor e interpretador", "O editor é a área em que escrevemos. O interpretador lê o pseudocódigo, verifica se a forma está correta e executa as instruções entendidas. A mensagem de erro é uma pista sobre algo que precisa ser revisto."], ["Por que usar uma ferramenta didática?", "No começo, muitos detalhes técnicos podem distrair do raciocínio. Uma ferramenta educacional permite praticar a sequência, as decisões e os dados com palavras familiares, antes de avançar para linguagens e ferramentas profissionais."]], code: "IDE = editor + execução + apoio para desenvolver\nLÓGICA = raciocínio para resolver\nLINGUAGEM = forma de escrever a solução", challenge: "Na sua rotina, qual ferramenta pode ser considerada uma IDE? Pense em uma que reúna editor e recursos para executar ou testar o que você escreve.", hint: "Uma IDE não é uma linguagem de programação. Ela é o ambiente que ajuda a criar programas escritos em uma linguagem. +20 XP" },
  { chapter: "MUNDO 1 · 06", title: "Algoritmo: um plano executável", lead: "Algoritmo é uma sequência finita e organizada de passos para resolver um problema ou alcançar um resultado. A receita culinária é uma analogia útil, mas um algoritmo também trata cálculos, decisões e repetições.", facts: [["Tem objetivo", "Antes de escrever passos, diga qual resultado você quer obter e quais dados estão disponíveis."], ["Tem ordem", "Trocar a ordem pode mudar o resultado: misturar ingredientes antes de medir pode alterar a receita."], ["Termina", "Uma solução precisa ter um caminho de conclusão. Repetir para sempre costuma ser um defeito, não uma estratégia."]], challenge: "Escreva um algoritmo de cinco passos para calcular quanto troco falta após uma compra.", hint: "Entrada: preço e valor pago. Processo: subtrair. Saída: mostrar o troco. +20 XP" },
  { chapter: "MUNDO 1 · 07", title: "Lógica, algoritmo e programa", lead: "Lógica de programação é a forma estruturada de raciocinar sobre problemas. Algoritmo é uma solução passo a passo. Programa é essa solução escrita numa linguagem executável, como o pseudocódigo do VisuAlg.", facts: [["Lógica", "Escolher relações, regras e ordem para chegar a uma resposta correta."], ["Algoritmo", "Descrever os passos da solução sem depender de uma linguagem específica."], ["Programa", "Codificar os passos com sintaxe e comandos de uma linguagem."]], challenge: "Diga se cada item é lógica, algoritmo ou programa: a regra “se chove, leve guarda-chuva”; a lista ordenada de passos; o código VisuAlg.", hint: "Regra de raciocínio, algoritmo descrito, programa escrito. +20 XP" },
  { chapter: "MUNDO 1 · 08", title: "Quebre o problema em partes", lead: "Problemas grandes assustam porque misturam várias tarefas. Decompor é separar o objetivo em partes pequenas, descobrir o que cada parte precisa e combinar os resultados.", facts: [["Defina a missão", "Use uma frase: “Quero calcular o preço final com desconto”. Evite começar pelo código."], ["Separe subtarefas", "Ler o preço, ler o percentual, calcular o desconto, subtrair e mostrar o total."], ["Procure padrões", "Se vários produtos usam o mesmo cálculo, existe uma regra que pode ser reaproveitada."]], challenge: "Decomponha “organizar uma viagem” em quatro subtarefas que um app poderia ajudar a controlar.", hint: "Datas, destino, orçamento e checklist são bons blocos iniciais. +20 XP" },
  { chapter: "MUNDO 1 · 09", title: "Entrada, processo e saída", lead: "O modelo IPO (Input, Process, Output) ajuda a enxergar os limites de uma solução. Em português, pense em entrada, processamento e saída. Primeiro identifique o que chega, depois o que acontece e por fim o que deve aparecer.", facts: [["Entrada", "Dados necessários. Se falta uma entrada, o processo não tem informação suficiente."], ["Processo", "Fórmula, regra, decisão ou sequência que transforma as entradas."], ["Saída", "Resultado que responde à pergunta do problema, com unidade e rótulo claros."]], code: "LEIA: largura, altura\nCALCULE: area <- largura * altura\nMOSTRE: area em cm2", challenge: "Desenhe o IPO de um conversor de minutos para horas e minutos.", hint: "Entrada: minutos totais. Processo: divisão e resto. Saída: horas e minutos restantes. +20 XP" },
  { chapter: "MUNDO 1 · 10", title: "Fluxograma: desenhe o caminho", lead: "Fluxograma representa o fluxo de um algoritmo com formas conectadas por setas. Ele é útil quando uma solução tem decisões ou caminhos alternativos e ajuda a conversar sobre a lógica antes de programar.", facts: [["Oval", "Marca início ou fim."], ["Retângulo", "Representa uma ação ou cálculo."], ["Paralelogramo", "Representa leitura ou exibição de dados."], ["Losango", "Faz uma pergunta lógica e abre caminhos como SIM e NÃO."]], challenge: "Desenhe um fluxograma para decidir se uma pessoa pode entrar: leia idade, compare com 18 e mostre permitido ou não permitido.", hint: "Use início → entrada → losango → dois resultados → fim. +20 XP" },
  { chapter: "MUNDO 1 · 11", title: "VisuAlg: seu laboratório de algoritmos", lead: "VisuAlg é uma ferramenta didática que permite escrever, executar e acompanhar algoritmos em pseudocódigo, uma forma estruturada de descrever programas com palavras próximas do português. Ele funciona como um laboratório: você formula uma ideia, dá instruções ao computador e observa o resultado.", facts: [["Por que começar com VisuAlg?", "A sintaxe em português estruturado reduz a barreira inicial e deixa o foco nos fundamentos: ordem, variáveis, escolhas e repetições. Você pratica a lógica sem precisar começar memorizando muitas regras de uma linguagem profissional."], ["O que ele não é", "VisuAlg é ótimo para aprender os primeiros conceitos, mas é uma ferramenta educacional. Conhecê-lo não significa que você já domina todas as tecnologias usadas em empresas; significa que está construindo uma base que depois poderá transferir para outras linguagens."], ["Seu primeiro ciclo", "Abra ou crie um algoritmo, escreva as instruções, salve o arquivo, execute e leia a saída. Depois teste com outros valores. Se houver erro, leia a mensagem, confira a linha indicada e revise nomes, palavras reservadas, parênteses e a ordem dos comandos."], ["Como estudar nesta apostila", "Leia o exemplo antes de digitar e tente prever o resultado. Execute, compare com sua previsão e explique a diferença. Salve cada exercício com um nome que lembre a tarefa; assim você consegue voltar e melhorar suas soluções."], ["Compatibilidade", "Há versões e interpretadores compatíveis com diferenças de interface. Procure uma distribuição confiável para seu sistema e acompanhe as instruções dela. Os exemplos usam a sintaxe clássica ensinada nas próximas páginas."]], challenge: "Prepare seu espaço de estudo: escolha onde vai executar os exemplos e crie uma pasta chamada missao_algoritmo para guardar seus exercícios.", hint: "Ainda não precisa instalar nada para entender os conceitos. Quando abrir a ferramenta, a missão seguinte será executar seu primeiro programa. +20 XP" },
  { chapter: "MUNDO 1 · 12", title: "Seu primeiro programa", lead: "O primeiro programa deve provar que a ferramenta executa uma instrução. `escreval` imprime um texto e termina a linha. O programa inteiro precisa de começo, área de comandos e encerramento.", facts: [["Nome", "A primeira linha identifica o algoritmo entre aspas."], ["Corpo", "Depois de inicio ficam os comandos que serão executados."], ["Fim", "fimalgoritmo encerra o pseudocódigo."]], code: "algoritmo \"ola_exploradora\"\ninicio\n   escreval(\"Ola, mundo!\")\nfimalgoritmo", challenge: "Troque a mensagem por seu nome de explorador e por uma frase de boas-vindas.", hint: "Acentos dentro do texto entre aspas são conteúdo; palavras reservadas ficam sem acento. +25 XP" },
  { chapter: "MUNDO 2 · 13", title: "A estrutura do algoritmo", lead: "No VisuAlg, a declaração de variáveis vem antes de `inicio`. O corpo principal fica entre `inicio` e `fimalgoritmo`. Comentários começam com `//` e ajudam pessoas a entender a intenção.", facts: [["Cabeçalho", "algoritmo seguido de nome entre aspas."], ["Declarações", "var apresenta as variáveis que o algoritmo usará."], ["Comandos", "A execução do programa principal começa em inicio e segue linha a linha."]], code: "algoritmo \"mensagem\"\nvar nome: caractere\ninicio\n   // A pessoa informa o nome\n   escreva(\"Ola, \", nome)\nfimalgoritmo", challenge: "Aponte no exemplo cabeçalho, declaração, comentário e comando.", hint: "A variável ainda precisa receber um valor antes de ser usada. +20 XP" },
  { chapter: "MUNDO 2 · 14", title: "Variáveis: caixas com nome", lead: "Uma variável é um espaço identificado pelo nome, cujo conteúdo pode ser consultado e atualizado durante a execução. Imagine uma caixa etiquetada: o nome aponta para o dado atual, não para todos os dados que ela já guardou.", facts: [["Nome útil", "Use nota_final em vez de x quando o propósito for uma nota."], ["Valor muda", "Depois de uma nova atribuição, a variável passa a representar o valor mais recente."], ["Estado", "O conjunto dos valores atuais das variáveis é o estado do algoritmo naquele momento."]], code: "pontos <- 5\npontos <- pontos + 3\nescreval(pontos) // 8", challenge: "Rastreie `vidas <- 3`, depois `vidas <- vidas - 1`. Qual é o valor final?", hint: "A segunda linha lê o valor antigo e grava o resultado novo: 2. +20 XP" },
  { chapter: "MUNDO 2 · 15", title: "Tipo inteiro", lead: "O tipo `inteiro` guarda números sem parte decimal, como 0, 12 ou -4. Escolha-o para quantidades discretas, contagens, idade em anos completos ou número de tentativas.", facts: [["Contar", "Uma quantidade de itens costuma ser inteira: 7 livros, 3 vidas, 12 rodadas."], ["Limites", "Uma variável tem capacidade finita. Evite esperar que um tipo aceite qualquer número imaginável."], ["Cuidado", "Uma divisão de inteiros pode ter resultado com parte decimal; decida se precisa de tipo real."]], code: "var vidas, fase: inteiro\ninicio\n   vidas <- 3\n   fase <- 1", challenge: "Escolha entre inteiro ou real para: quantidade de alunos, altura em metros, número de gols.", hint: "Inteiro, real, inteiro. +15 XP" },
  { chapter: "MUNDO 2 · 16", title: "Tipo real", lead: "O tipo `real` representa números que podem ter casas decimais, como 1.75 ou 19.90. No código do VisuAlg, o separador decimal é ponto; na conversa e na exibição brasileira, costuma-se falar com vírgula.", facts: [["Medidas", "Altura, distância, temperatura e preço geralmente precisam aceitar frações."], ["Atenção", "Representações numéricas no computador podem ter pequenas aproximações. Para dinheiro real, sistemas comerciais usam centavos inteiros ou tipos decimais apropriados."], ["Teste", "Use entradas com fração e valores inteiros para confirmar os dois caminhos."]], code: "var preco, desconto: real\ninicio\n   preco <- 39.90\n   desconto <- preco * 0.10", challenge: "Declare uma variável para temperatura e calcule uma elevação de 2.5 graus.", hint: "Use real nas duas variáveis; some 2.5 à temperatura. +20 XP" },
  { chapter: "MUNDO 2 · 17", title: "Tipo caractere", lead: "O tipo `caractere` guarda texto: nomes, respostas, códigos e mensagens. Texto literal no VisuAlg fica entre aspas duplas. Evite misturar texto e número sem decidir como a operação deve funcionar.", facts: [["Texto", "Uma palavra ou frase pode ser guardada em uma variável caractere."], ["Comparação", "Textos podem ser comparados, mas diferenças de maiúsculas, acentos e espaços podem afetar o resultado."], ["Entrada", "Leia o texto em uma variável antes de usá-lo em mensagem ou condição."]], code: "var jogador: caractere\ninicio\n   escreva(\"Seu nome: \" )\n   leia(jogador)\n   escreval(\"Bem-vinda, \", jogador)", challenge: "Crie um algoritmo que leia o nome de um planeta favorito e o mostre numa frase.", hint: "Use jogador: caractere, leia(jogador) e escreval. +20 XP" },
  { chapter: "MUNDO 2 · 18", title: "Tipo lógico", lead: "Uma variável lógica guarda apenas dois estados: `verdadeiro` ou `falso`. Ela é ótima para representar respostas de sim/não, condições atendidas e sinalizadores de controle.", facts: [["Dois valores", "Não existe um terceiro estado lógico básico nessa declaração."], ["Perguntas", "Uma comparação como idade >= 18 produz um resultado lógico."], ["Decisões", "O comando se usa esse resultado para escolher qual bloco executar."]], code: "var tem_chave: logico\ninicio\n   tem_chave <- verdadeiro\n   escreval(tem_chave)", challenge: "Defina uma variável lógica para “missão concluída” e atribua falso inicialmente.", hint: "Use missao_concluida: logico e missao_concluida <- falso. +20 XP" },
  { chapter: "MUNDO 2 · 19", title: "Declaração e atribuição", lead: "Declarar informa o nome e o tipo antes do uso. Atribuir coloca um valor na variável. No VisuAlg a seta `<-` lê-se “recebe”; não é uma igualdade matemática.", facts: [["Declarar", "Em `var idade: inteiro`, a variável passa a existir com tipo conhecido."], ["Atribuir", "Em `idade <- 20`, o valor 20 é guardado em idade."], ["Atualizar", "Em `idade <- idade + 1`, o lado direito é calculado antes de atualizar o esquerdo."]], code: "var energia: inteiro\ninicio\n   energia <- 10\n   energia <- energia - 4", challenge: "Se saldo começa em 30 e recebe `saldo <- saldo + 12`, qual é o novo saldo?", hint: "42. A seta não pergunta se saldo é igual à soma; ela atualiza. +20 XP" },
  { chapter: "MUNDO 2 · 20", title: "Leia e escreva dados", lead: "`leia` recebe dados digitados. `escreva` imprime sem avançar a linha; `escreval` imprime e avança. A entrada precisa combinar com o tipo da variável que vai recebê-la.", facts: [["Pergunte", "Mostre a pergunta antes de usar leia para orientar a pessoa."], ["Leia", "Guarde a resposta numa variável declarada com tipo adequado."], ["Responda", "Exiba uma frase clara e inclua unidade ou contexto quando necessário."]], code: "algoritmo \"dobro\"\nvar n: real\ninicio\n   escreva(\"Digite um numero: \" )\n   leia(n)\n   escreval(\"Dobro: \", n * 2)\nfimalgoritmo", challenge: "Adapte o programa para pedir um nome e uma cor favorita e imprimir ambos.", hint: "Use duas variáveis caractere e dois comandos leia. +25 XP" },
  { chapter: "MUNDO 2 · 21", title: "Operadores matemáticos", lead: "Operadores combinam valores para produzir resultados. No VisuAlg, use `+`, `-`, `*`, `/`, `div` e `mod` conforme o tipo de cálculo. Verifique sempre se o resultado precisa manter casas decimais.", facts: [["Aritmética", "Adição, subtração, multiplicação e divisão usam +, -, * e /."], ["Quociente inteiro", "`div` obtém a divisão inteira em situações compatíveis."], ["Resto", "`mod` obtém o resto e ajuda a detectar pares, ciclos e unidades restantes."]], code: "escreval(17 div 5) // 3\nescreval(17 mod 5) // 2\nescreval(17 / 5) // 3.4", challenge: "Quantas caixas completas de 6 cabem em 29 itens? Quantos itens sobram?", hint: "29 div 6 = 4; 29 mod 6 = 5. +20 XP" },
  { chapter: "MUNDO 2 · 22", title: "Prioridade e parênteses", lead: "Expressões seguem uma ordem de operações. Parênteses tornam essa ordem visível e reduzem surpresas. Ao traduzir uma fórmula, preserve primeiro a estrutura matemática e só depois simplifique.", facts: [["Multiplicar antes", "Multiplicação e divisão acontecem antes de adição e subtração, salvo parênteses."], ["Agrupe", "Escreva `(a + b) / 2` para média, e não `a + b / 2`."], ["Leia em etapas", "Use variáveis intermediárias para tornar cálculos longos mais fáceis de conferir."]], code: "media <- (nota1 + nota2) / 2\narea <- base * altura\ntotal <- preco - (preco * taxa / 100)", challenge: "Com a=8, b=4 e c=2, compare a+b*c com (a+b)*c.", hint: "Primeiro dá 16; segundo dá 24. Os parênteses mudam a rota. +25 XP" },
  { chapter: "MUNDO 2 · 23", title: "Comparações viram perguntas", lead: "Operadores relacionais comparam valores e produzem verdadeiro ou falso. As respostas podem controlar decisões e repetições. Não confunda atribuição `<-` com igualdade `=`.", facts: [["Maior e menor", "`>`, `<`, `>=` e `<=` comparam magnitudes."], ["Igual e diferente", "`=` testa igualdade; `<>` testa diferença no VisuAlg."], ["Resultado lógico", "A expressão `tentativas < 3` pode ser verdadeira ou falsa."]], code: "idade >= 18\nsenha <> \"\"\nnota = 10", challenge: "Para `energia=4`, calcule `energia > 5`, `energia <= 4` e `energia = 0`.", hint: "Falso, verdadeiro, falso. +20 XP" },
  { chapter: "MUNDO 2 · 24", title: "E, ou, não", lead: "Operadores lógicos combinam condições. `e` exige que todas sejam verdadeiras; `ou` exige pelo menos uma; `nao` inverte o resultado. Use parênteses para deixar a intenção explícita.", facts: [["E", "Acesso liberado pode exigir `senha_correta e cadastro_ativo`."], ["Ou", "Um desconto pode valer se `cupom_valido ou cliente_vip`."], ["Não", "`nao tem_erro` representa o oposto lógico de `tem_erro`."]], code: "se idade >= 18 e tem_ingresso entao\n   escreval(\"Entrada liberada\")\nfimse", challenge: "Acesso infantil: idade <= 12 e acompanhado. A pessoa tem 10 anos e está acompanhada?", hint: "As duas partes são verdadeiras, então o acesso é liberado. +25 XP" },
  { chapter: "MUNDO 2 · 25", title: "Decisão com se", lead: "Uma condição escolhe se um bloco será executado. Em VisuAlg, `se ... entao` abre a decisão e `fimse` fecha o bloco. O algoritmo continua depois do bloco, quer a condição seja verdadeira ou falsa.", facts: [["Pergunta", "A expressão precisa produzir verdadeiro ou falso."], ["Bloco", "Indente os comandos para enxergar o que pertence à decisão."], ["Teste", "Experimente uma entrada que torna a condição verdadeira e outra que a torna falsa."]], code: "se pontos >= 100 entao\n   escreval(\"Nova fase!\")\nfimse", challenge: "Mostre “meta atingida” se vendas for igual ou maior que 10.", hint: "Use `se vendas >= 10 entao` e feche com `fimse`. +25 XP" },
  { chapter: "MUNDO 2 · 26", title: "Se e senão", lead: "Quando há dois caminhos, `senao` define a alternativa para quando a condição é falsa. Cada caminho pode ter mais de um comando, mas os dois ficam dentro do mesmo `fimse`.", facts: [["Verdadeiro", "Executa os comandos antes de senao."], ["Falso", "Executa os comandos depois de senao."], ["Exclusivos", "Em uma decisão simples, apenas um dos dois blocos é executado."]], code: "se nota >= 7 entao\n   escreval(\"Aprovada\")\nsenao\n   escreval(\"Precisa revisar\")\nfimse", challenge: "Decida se temperatura está abaixo de zero. Exiba “congelante” ou “acima de zero”.", hint: "Teste também zero; a condição < 0 o coloca no segundo caminho. +25 XP" },
  { chapter: "MUNDO 2 · 27", title: "Várias opções: escolha", lead: "Aninhar muitos `se` pode dificultar a leitura. Quando uma única variável precisa ser comparada com várias opções discretas, `escolha`, `caso`, `outrocaso` e `fimescolha` deixam os caminhos organizados.", facts: [["Seleção", "A expressão de escolha é comparada com os valores listados em cada caso."], ["Padrão", "outrocaso cobre uma opção inesperada ou não listada."], ["Uso certo", "Escolha serve para opções exatas; faixas como nota maior que 7 continuam boas candidatas a se."]], code: "escolha menu\ncaso 1\n   escreval(\"Iniciar\")\ncaso 2\n   escreval(\"Ajuda\")\noutrocaso\n   escreval(\"Opcao invalida\")\nfimescolha", challenge: "Crie opções para 1=água, 2=suco e demais=opção inválida.", hint: "Leia um inteiro menu antes da estrutura escolha. +25 XP" },
  { chapter: "MUNDO 2 · 28", title: "Valide antes de usar", lead: "Validação verifica se os dados fazem sentido para a regra do problema. O objetivo não é desconfiar da pessoa, mas impedir que uma entrada inválida conduza a um resultado sem significado.", facts: [["Faixa", "Idade não deve ser negativa; nota pode estar entre 0 e 10."], ["Campo obrigatório", "Um nome vazio pode impedir uma mensagem personalizada."], ["Regra", "Descreva o que é válido em linguagem simples e teste limite, abaixo do limite e acima."]], code: "se nota < 0 ou nota > 10 entao\n   escreval(\"Nota invalida\")\nsenao\n   escreval(\"Nota recebida\")\nfimse", challenge: "Que valores testaria para validar uma nota de 0 a 10?", hint: "0 e 10, um dentro da faixa (5), um abaixo (-1) e um acima (11). +30 XP" },
  { chapter: "MUNDO 3 · 29", title: "Repetição: automatize o que se repete", lead: "Laços repetem um bloco sem copiar e colar as mesmas instruções. A escolha depende da pergunta: você sabe quantas vezes vai repetir, repete enquanto uma condição valer ou precisa executar pelo menos uma vez?", facts: [["Para", "Use quando a quantidade de repetições é conhecida ou controlada por contagem."], ["Enquanto", "Use quando continuar depende de uma condição testada antes do bloco."], ["Repita", "Use quando o bloco deve acontecer pelo menos uma vez e a condição de parada é testada no final."]], challenge: "Qual laço combina melhor com: exibir 1 a 10; esperar senha correta; perguntar se quer jogar de novo?", hint: "Para; enquanto; repita. +20 XP" },
  { chapter: "MUNDO 3 · 30", title: "Laço para", lead: "`para` reúne contador, início, limite e passo numa estrutura. É excelente para percorrer uma faixa conhecida, como níveis, dias ou posições de um vetor.", facts: [["Início", "A variável de controle começa no valor indicado."], ["Limite", "A execução segue até o limite, considerando o sentido do passo."], ["Passo", "`passo 1` avança; passo negativo pode percorrer na direção contrária quando a faixa está definida para isso."]], code: "para fase de 1 ate 5 faca\n   escreval(\"Fase \", fase)\nfimpara", challenge: "Altere o laço para mostrar números de 2 até 12, de 2 em 2.", hint: "Use `passo 2`. +25 XP" },
  { chapter: "MUNDO 3 · 31", title: "Laço enquanto", lead: "`enquanto ... faca` verifica a condição antes de cada volta. Se ela já começa falsa, o bloco não executa nenhuma vez. Por isso, prepare as variáveis antes do laço e garanta uma mudança que possa encerrar a repetição.", facts: [["Inicialização", "Defina o contador ou estado antes de enquanto."], ["Condição", "Escreva claramente o que permite continuar."], ["Atualização", "Mude algo dentro do laço para se aproximar da parada."]], code: "contador <- 1\nenquanto contador <= 3 faca\n   escreval(contador)\n   contador <- contador + 1\nfimenquanto", challenge: "Mostre 5, 4, 3, 2, 1 usando enquanto.", hint: "Comece em 5; continue enquanto > 0; subtraia 1. +30 XP" },
  { chapter: "MUNDO 3 · 32", title: "Laço repita até", lead: "`repita ... ate` executa o bloco e só então testa a condição de encerramento. Assim, o conteúdo acontece uma ou mais vezes. Atenção: a condição de `ate` significa PARAR quando verdadeira.", facts: [["Primeira volta", "O bloco sempre roda pelo menos uma vez."], ["Parada", "A condição descreve quando terminar, não quando continuar."], ["Atualização", "Se nada alterar a condição, o laço pode não terminar."]], code: "repita\n   escreval(\"1 - Continuar  0 - Sair\")\n   leia(opcao)\nate opcao = 0", challenge: "Leia uma senha pelo menos uma vez e repita até a pessoa digitar 1234.", hint: "A condição de parada é `ate senha = 1234`. +30 XP" },
  { chapter: "MUNDO 3 · 33", title: "Contador e acumulador", lead: "Contador acompanha quantas ocorrências aconteceram; acumulador soma valores ao longo das voltas. Ambos precisam começar com um valor antes do laço.", facts: [["Contador", "Costuma receber +1 a cada evento ou volta."], ["Acumulador", "Recebe acumulador + valor novo, como total <- total + compra."], ["Inicialização", "Começar um total em 0 e um produto em 1 evita carregar lixo de outra missão."]], code: "total <- 0\npara item de 1 ate 3 faca\n   leia(preco)\n   total <- total + preco\nfimpara", challenge: "Some as idades de quatro pessoas e mostre o total.", hint: "Use um inteiro total iniciado em 0 e um leia dentro do para. +30 XP" },
  { chapter: "MUNDO 3 · 34", title: "Laços dentro de laços", lead: "Um laço pode existir dentro de outro. O laço externo escolhe a linha ou rodada; o interno executa as colunas ou tentativas de cada linha. Cada volta externa reinicia o percurso interno.", facts: [["Custo", "Se o externo repete 3 vezes e o interno 4, o bloco interno executa 12 vezes."], ["Indente", "A indentação deixa visível qual fimpara fecha cada laço."], ["Use com intenção", "Tabuadas, grades e combinações pequenas são bons exemplos; não aninhe sem necessidade."]], code: "para linha de 1 ate 2 faca\n   para coluna de 1 ate 3 faca\n      escreva(\"* \" )\n   fimpara\n   escreval(\"\")\nfimpara", challenge: "Quantas estrelas o exemplo imprime no total?", hint: "2 linhas vezes 3 colunas: 6 estrelas. +30 XP" },
  { chapter: "MUNDO 3 · 35", title: "Rastreie a execução", lead: "Rastrear é simular o algoritmo à mão, linha a linha, anotando o valor de cada variável e o resultado das condições. Uma tabela de rastreamento transforma uma surpresa em sequência observável.", facts: [["Colunas", "Inclua etapa, variável, condição e saída relevante."], ["Uma volta por vez", "Não pule a atualização do contador nem avalie a condição depois da linha errada."], ["Previsão", "Antes de executar, escreva o resultado esperado; depois compare com o resultado real."]], code: "x <- 2\npara i de 1 ate 3 faca\n   x <- x + i\nfimpara", challenge: "Rastreie x e i após cada volta.", hint: "x termina em 8: 2+1=3, +2=5, +3=8. +30 XP" },
  { chapter: "MUNDO 3 · 36", title: "Caça aos bugs", lead: "Bug é um defeito que faz o programa falhar, parar ou produzir resultado incorreto. Depurar é investigar com método, em vez de mudar várias linhas ao acaso.", facts: [["Sintaxe", "Uma palavra incorreta, bloco não fechado ou operador ausente impede interpretar o código."], ["Execução", "Uma entrada inesperada pode revelar uma divisão por zero ou laço que nunca termina."], ["Lógica", "O programa roda, mas a regra está errada: por exemplo, calcular desconto somando em vez de subtrair."]], challenge: "Leia `media <- nota1 + nota2 / 2`. O erro é de sintaxe ou de lógica matemática?", hint: "É lógico: faltam parênteses em torno da soma. +30 XP" },
  { chapter: "MUNDO 3 · 37", title: "Teste limites e casos especiais", lead: "Testar só o caso comum não basta. Dados de fronteira e situações especiais ajudam a revelar erros que ficam escondidos no caminho mais fácil.", facts: [["Limite inferior", "Se a nota começa em 0, teste 0 e também um valor menor."], ["Limite superior", "Se a faixa termina em 10, teste 10 e também um valor maior."], ["Caso vazio", "Listas vazias, texto em branco e tentativa de dividir por zero precisam de uma regra."]], challenge: "Planeje quatro testes para um programa que diz se um número está entre 1 e 100.", hint: "Teste 1, 100, 0 e 101. +30 XP" },
  { chapter: "MUNDO 4 · 38", title: "Divida em procedimentos", lead: "Procedimento nomeia uma tarefa reutilizável e executa comandos sem devolver um resultado como valor. No VisuAlg, declare procedimentos antes do `inicio` principal. Eles deixam o algoritmo mais organizado.", facts: [["Uma tarefa", "Cada procedimento deve ter uma responsabilidade fácil de explicar."], ["Chamada", "Escreva o nome do procedimento no ponto em que quer executar a tarefa."], ["Parâmetros", "Passe informações entre parênteses quando a tarefa precisar de dados diferentes a cada chamada."]], code: "procedimento mostrar_linha\ninicio\n   escreval(\"----------------\")\nfimprocedimento\n\n// no inicio principal:\nmostrar_linha", challenge: "Crie um procedimento que mostre o título de um jogo e chame-o duas vezes.", hint: "Sem parâmetros, no VisuAlg 3 não use parênteses na declaração ou chamada. +30 XP" },
  { chapter: "MUNDO 4 · 39", title: "Funções devolvem um valor", lead: "Função executa uma tarefa e retorna um resultado que pode ser guardado numa variável ou usado numa expressão. A declaração informa o tipo do retorno, e `retorne` entrega o valor.", facts: [["Entrada opcional", "Parâmetros representam dados recebidos pela função."], ["Saída tipada", "Uma função que devolve inteiro declara `: inteiro`; uma que devolve lógico declara `: logico`."], ["Reutilize", "Uma regra em função pode ser chamada em vários pontos sem copiar o cálculo."]], code: "funcao dobro(n: inteiro): inteiro\ninicio\n   retorne n * 2\nfimfuncao\n\n// uso: resultado <- dobro(6)", challenge: "Escreva a assinatura e o retorno de uma função que calcula o quadrado de um inteiro.", hint: "`funcao quadrado(n: inteiro): inteiro`; retorne n * n. +35 XP" },
  { chapter: "MUNDO 4 · 40", title: "Parâmetros e escopo", lead: "Parâmetro é um nome que recebe um dado na chamada. Variável local existe dentro de uma rotina; variável global é declarada fora e pode ser acessada em outros blocos. Prefira passar o que a rotina precisa de forma explícita.", facts: [["Parâmetro por valor", "A rotina recebe uma cópia do valor para usar no próprio cálculo."], ["Local", "Uma variável declarada dentro da rotina serve àquela tarefa."], ["Global", "Pode ser acessada por várias rotinas, mas mudanças inesperadas dificultam rastrear o estado."]], code: "funcao somar(a, b: inteiro): inteiro\ninicio\n   retorne a + b\nfimfuncao\n\nresultado <- somar(4, 7)", challenge: "Quais valores a e b recebem na chamada somar(4, 7)?", hint: "a recebe 4; b recebe 7; a função devolve 11. +30 XP" },
  { chapter: "MUNDO 4 · 41", title: "Vetores: várias posições", lead: "Vetor guarda vários valores do mesmo tipo sob um nome e índices. É útil quando há notas de uma turma ou itens de uma lista. No VisuAlg, a faixa de índices faz parte da declaração.", facts: [["Mesmo tipo", "Um vetor de inteiros não mistura texto e números na mesma estrutura."], ["Índice", "A posição identifica onde o valor fica; use índices dentro dos limites declarados."], ["Faixa", "Com [1..5], as posições válidas são 1, 2, 3, 4 e 5."]], code: "var notas: vetor[1..3] de real\ninicio\n   notas[1] <- 8.5\n   notas[2] <- 7.0\n   notas[3] <- 9.0", challenge: "Quantas posições há em `itens: vetor[0..4] de inteiro`?", hint: "Cinco posições: 0, 1, 2, 3 e 4. +30 XP" },
  { chapter: "MUNDO 4 · 42", title: "Percorra e resuma um vetor", lead: "Use um laço para visitar as posições de um vetor. No mesmo percurso, você pode contar valores, acumular uma soma e depois calcular uma média.", facts: [["Índice de controle", "O contador do laço deve coincidir com os índices válidos."], ["Acumulador", "Comece soma em 0 antes de percorrer o vetor."], ["Média", "Divida a soma pela quantidade, que precisa ser maior que zero."]], code: "soma <- 0\npara i de 1 ate 3 faca\n   soma <- soma + notas[i]\nfimpara\nmedia <- soma / 3", challenge: "Para notas 6, 8 e 10, qual média o trecho calcula?", hint: "A soma é 24; a média é 8. +35 XP" },
  { chapter: "MUNDO 4 · 43", title: "Encontre o maior e procure um item", lead: "Busca linear verifica posições uma por uma até encontrar o valor ou terminar o vetor. Para achar o maior, compare cada item com o melhor valor conhecido até aquele momento.", facts: [["Busca", "Comece com encontrado falso; quando achar, marque verdadeiro."], ["Maior", "Inicialize o maior com a primeira posição, não com zero se os dados podem ser negativos."], ["Posição", "Guarde o índice encontrado se o programa precisar dizer onde o valor está."]], code: "encontrado <- falso\npara i de 1 ate quantidade faca\n   se valores[i] = procurado entao\n      encontrado <- verdadeiro\n   fimse\nfimpara", challenge: "Por que o maior deve começar em valores[1] e não em zero?", hint: "Se todos os números forem negativos, zero não pertence à lista e pareceria o maior. +35 XP" },
  { chapter: "MUNDO 4 · 44", title: "Matrizes: linhas e colunas", lead: "Matriz organiza valores em duas dimensões, como uma tabela de assentos ou um tabuleiro. Acessar uma célula exige dois índices: linha e coluna.", facts: [["Declaração", "VisuAlg permite vetor com dois intervalos, como matriz[1..3,1..4]."], ["Acesso", "Use matriz[linha,coluna] para localizar uma célula."], ["Percurso", "Dois laços aninhados percorrem todas as linhas e colunas."]], code: "var tabuleiro: vetor[1..2,1..3] de caractere\n\npara linha de 1 ate 2 faca\n   para coluna de 1 ate 3 faca\n      escreva(tabuleiro[linha,coluna])\n   fimpara\nfimpara", challenge: "Quantas células existem em uma matriz 3 por 4?", hint: "3 x 4 = 12. +35 XP" },
  { chapter: "MUNDO 4 · 45", title: "Textos também são dados", lead: "Nomes, comandos e respostas digitadas são dados caractere. Planeje o que o algoritmo deve fazer com espaços, letras maiúsculas e entradas inesperadas. Não trate um texto como número sem convertê-lo de forma adequada.", facts: [["Mensagem", "Use aspas duplas para textos literais."], ["Comparar", "Uma opção como `resposta = \"sim\"` depende da forma exata digitada."], ["Orientar", "Explique exemplos válidos na pergunta para reduzir respostas ambíguas."]], code: "var resposta: caractere\ninicio\n   escreva(\"Deseja jogar? (sim/nao): \" )\n   leia(resposta)\n   se resposta = \"sim\" entao\n      escreval(\"Vamos!\")\n   fimse", challenge: "Que outra resposta precisa ser tratada para a pessoa que digita “não”?", hint: "Crie um senao que encerre ou explique como começar. +30 XP" },
  { chapter: "CHEFE · 46", title: "Mini game: adivinhe o código", lead: "Vamos combinar entrada, tentativa, contador, decisão e repetição. Uma pessoa escolhe um número secreto e a outra tenta adivinhar. Nesta versão de dois jogadores, quem prepara o jogo escolhe o segredo no código antes de entregar o teclado.", facts: [["Estado", "Guarde segredo, tentativa e quantidade de palpites."], ["Regra", "Repita enquanto tentativa for diferente do segredo."], ["Feedback", "Diga se o palpite é maior ou menor para orientar a próxima tentativa."]], code: "algoritmo \"adivinhe\"\nvar segredo, tentativa, tentativas: inteiro\ninicio\n   segredo <- 7 // altere antes de jogar\n   tentativas <- 0\n   repita\n      escreva(\"Seu palpite: \" )\n      leia(tentativa)\n      tentativas <- tentativas + 1\n      se tentativa < segredo entao\n         escreval(\"Maior\")\n      senao\n         se tentativa > segredo entao\n            escreval(\"Menor\")\n         fimse\n      fimse\n   ate tentativa = segredo\n   escreval(\"Acertou em \", tentativas, \" tentativas!\")\nfimalgoritmo", challenge: "Adicione uma mensagem final com o número de tentativas usadas.", hint: "O código já mostra tentativas; personalize uma regra ou faixa válida. +40 XP · Chefe derrotado" },
  { chapter: "CHEFE · 47", title: "Mini game: quiz de três perguntas", lead: "Um quiz calcula uma pontuação a partir de respostas. Cada pergunta compara a resposta com a correta e soma pontos quando há acerto. Teste uma sequência de tudo certo, tudo errado e respostas misturadas.", facts: [["Comece em zero", "A pontuação é acumulada, então precisa de uma inicialização."], ["Decida por resposta", "Cada acerto altera o placar; um erro pode apenas mostrar a resposta correta."], ["Mostre o resultado", "Dê contexto ao placar e use uma condição para classificar a conquista."]], code: "pontos <- 0\nleia(resposta)\nse resposta = \"A\" entao\n   pontos <- pontos + 1\nfimse\n// repita a regra para cada pergunta", challenge: "Se há três perguntas e a pessoa acerta duas, qual deve ser o placar?", hint: "2 pontos. Uma rotina de pergunta pode evitar copiar código. +40 XP" },
  { chapter: "PROJETO · 48", title: "Planeje antes de codificar", lead: "Um projeto final junta ferramentas conhecidas. Antes do VisuAlg, escreva o objetivo, identifique dados, decomponha a solução, escolha variáveis e planeje testes. Esse roteiro diminui retrabalho.", facts: [["Objetivo", "O programa vai conduzir um quiz de matemática e informar a pontuação."], ["Dados", "Pergunta e resposta são texto; pontos e rodada são inteiros."], ["Regras", "Cada acerto soma 1; ao final, o programa mostra a faixa de desempenho."], ["Testes", "Planeje uma execução com 0, 1 e todas as respostas corretas."]], challenge: "Escreva seu plano em cinco linhas antes de montar o programa da próxima página.", hint: "Se você não sabe como testar uma regra, ainda precisa torná-la mais clara. +35 XP" },
  { chapter: "PROJETO · 49", title: "Projeto final: quiz de matemática", lead: "Este programa usa três perguntas, pontuação, entradas, decisões e uma classificação final. Digite o código, execute e rastreie uma partida. Depois personalize perguntas e mensagens sem mudar a estrutura da solução.", facts: [["Observe", "A pontuação começa em zero e só cresce em respostas corretas."], ["Rastreie", "Depois de cada questão, confira resposta e pontos."], ["Expanda", "Uma nova pergunta pede mais uma leitura e uma regra de pontuação."]], code: "algoritmo \"quiz\"\nvar r: caractere\n    pontos: inteiro\ninicio\n   pontos <- 0\n   escreval(\"2 + 2?\")\n   leia(r)\n   se r = \"4\" entao\n      pontos <- pontos + 1\n   fimse\n   escreval(\"Pontos: \", pontos)\nfimalgoritmo", challenge: "Inclua mais duas perguntas e classifique: 0-1 precisa treinar; 2-3 mestre do quiz.", hint: "Use comparações com pontos e `e` para construir a faixa. +50 XP · Projeto concluído" },
  { chapter: "EPÍLOGO · 50", title: "Você desbloqueou o próximo nível", lead: "Você percorreu o caminho entre uma pergunta e um programa que pode ser executado. Guarde seus algoritmos, releia o que ainda parece confuso e refaça os chefes sem olhar as pistas. Programação cresce com prática deliberada.", facts: [["Vocabulário", "Algoritmo: passos finitos. Variável: nome associado a um valor. Condição: pergunta lógica. Laço: repetição controlada."], ["Próxima trilha", "Aprenda a modelar problemas maiores, pratique estruturas de dados e depois transfira a lógica para uma linguagem de uso profissional."], ["Seu portfólio", "Salve o quiz, o jogo de adivinhação e uma solução própria com enunciado, código e casos de teste."], ["Consulta", "Para conferir sintaxe e recursos, consulte o Manual VisuAlg da EEL-USP e os materiais de aprendizagem de VisuAlg Web."]], challenge: "Escreva uma frase: “Agora consigo explicar algoritmo como...”. Depois escolha seu próximo desafio.", hint: "Parabéns pela conclusão! XP conquistados, conhecimento desbloqueado. Sua curiosidade é o melhor equipamento. FIM DA FASE 1." },
];

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const cover = `
<article class="page cover">
  <div class="cover-top"><span>GCODER · CADERNO DE MISSÕES</span><span>EDIÇÃO 01 / 2026</span></div>
  <div class="cover-orbit orbit-one"></div><div class="cover-orbit orbit-two"></div>
  <div class="cover-content"><p class="cover-kicker">APRENDA DO ZERO · PRATIQUE · SUBA DE NÍVEL</p>
    <div class="pixel-mark">G<span>+</span></div>
    <h1>MISSÃO<br><em>ALGORITMO</em></h1>
    <p class="cover-sub">Lógica de Programação Gamificada com VisuAlg</p>
    <div class="cover-divider"></div>
    <p class="cover-description">Uma expedição de ${pages.length + 1} páginas para entender como computadores seguem instruções — e transformar ideias em programas passo a passo.</p>
    <div class="cover-tags"><span>SEM PRÉ-REQUISITOS</span><span>50 PÁGINAS</span><span>PORTUGOL / VISUALG</span></div>
  </div>
  <div class="cover-bottom"><span>DO PRIMEIRO ALGORITMO AO PROJETO FINAL</span><span>GCODER EDUCAÇÃO</span></div>
</article>`;

const bodyPages = pages.map((page, index) => {
  const facts = page.facts.map(([title, body], itemIndex) => `<div class="fact"><span class="fact-index">${String(itemIndex + 1).padStart(2, "0")}</span><div><strong>${esc(title)}</strong><p>${esc(body)}</p></div></div>`).join("");
  const code = page.code ? `<section class="code-box"><div class="code-label"><span>TERMINAL VISUALG</span><span>MISSÃO ${String(index + 2).padStart(2, "0")}</span></div><pre>${esc(page.code)}</pre></section>` : "";
  return `<article class="page">
    <header class="page-head"><div class="brand"><span class="brand-icon">G</span><span>GCODER <small>ACADEMIA DE ALGORITMOS</small></span></div><div class="page-mark">${String(index + 2).padStart(2, "0")} <i>/ ${pages.length + 1}</i></div></header>
    <div class="chapter">${esc(page.chapter)}</div>
    <h2>${esc(page.title)}</h2>
    <p class="lead">${esc(page.lead)}</p>
    <div class="fact-list">${facts}</div>
    ${code}
    <section class="mission"><div class="mission-label"><span>DESAFIO</span><span>+${esc(page.hint.match(/\+(\d+) XP/)?.[1] || "20")} XP</span></div><p>${esc(page.challenge)}</p><div class="hint"><b>PISTA / GABARITO</b><span>${esc(page.hint.replace(/\s*\+\d+ XP.*/, ""))}</span></div></section>
    <footer class="page-foot"><span>MISSÃO ALGORITMO <b>·</b> VISUALG</span><span>APRENDA FAZENDO</span></footer>
  </article>`;
}).join("\n");

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Missão Algoritmo · GCoder</title><style>
@page { size:A4; margin:0 }
* { box-sizing:border-box }
html,body { margin:0; padding:0; color:#24322f; font-family:Arial,Helvetica,sans-serif; -webkit-print-color-adjust:exact; print-color-adjust:exact }
body { background:#e9ece8 }
.page { position:relative; width:210mm; height:297mm; margin:0 auto 8mm; padding:14mm 16mm 16mm; overflow:hidden; background:#fffdf9; break-after:page; page-break-after:always }
.page:last-child { break-after:auto; page-break-after:auto }
.page-head { display:flex; align-items:center; justify-content:space-between; padding-bottom:7mm; border-bottom:1px solid #dde4dd }
.brand { display:flex; align-items:center; gap:9px; font-size:10pt; font-weight:800; letter-spacing:1px; color:#263a34 }
.brand small { display:block; margin-top:2px; font-size:6pt; letter-spacing:1.5px; color:#75867d }
.brand-icon { width:9mm; height:9mm; display:grid; place-items:center; background:#25443a; color:#fff; border-radius:50%; font:700 15pt Georgia }
.page-mark { color:#25443a; font-size:12pt; font-weight:800 }
.page-mark i { font-size:8pt; font-style:normal; color:#8b9690 }
.chapter { margin-top:8mm; color:#b06f87; font-size:8pt; font-weight:800; letter-spacing:1.5px }
h2 { max-width:170mm; margin:3mm 0 3mm; font-size:27pt; line-height:1.04; letter-spacing:-.6pt; color:#263a34 }
.lead { max-width:176mm; margin:0 0 7mm; color:#57655e; font:11pt/1.53 Georgia,serif }
.fact-list { display:grid; gap:3mm; margin-bottom:6mm }
.fact { display:grid; grid-template-columns:10mm 1fr; gap:3mm; padding:3.2mm 4mm; border:1px solid #e7e8df; background:#f8f7f0 }
.fact-index { display:grid; place-items:center; width:8mm; height:8mm; border-radius:50%; background:#ead8df; color:#764a5d; font-size:7pt; font-weight:800 }
.fact strong { display:block; margin-bottom:1mm; color:#30483e; font-size:10pt }
.fact p { margin:0; color:#647069; font-size:9pt; line-height:1.42 }
.code-box { margin:2mm 0 5mm; overflow:hidden; border-radius:2mm; background:#1e302b; color:#f5f4ed }
.code-label { display:flex; justify-content:space-between; padding:2.5mm 4mm; border-bottom:1px solid #ffffff24; color:#d9a6b8; font-size:6.5pt; font-weight:700; letter-spacing:1px }
pre { margin:0; padding:3.2mm 4mm 4mm; white-space:pre-wrap; color:#f1f0e9; font:8.1pt/1.35 Consolas,"Courier New",monospace }
.mission { margin-top:3mm; padding:4mm; border-left:3px solid #bb7790; background:#f4e9ed }
.mission-label { display:flex; justify-content:space-between; color:#804b60; font-size:7pt; font-weight:800; letter-spacing:1px }
.mission > p { margin:2mm 0 3mm; color:#33453e; font:11pt/1.4 Georgia,serif }
.hint { display:grid; grid-template-columns:27mm 1fr; gap:3mm; padding-top:2.5mm; border-top:1px solid #e2cfd6; color:#66746c; font-size:8pt; line-height:1.4 }
.hint b { color:#804b60; font-size:6.4pt; letter-spacing:.6px }
.page-foot { position:absolute; right:16mm; bottom:8mm; left:16mm; display:flex; justify-content:space-between; padding-top:3mm; border-top:1px solid #dde4dd; color:#829087; font-size:6.5pt; letter-spacing:1px }
.page-foot b { color:#bb7790 }
.cover { display:flex; flex-direction:column; justify-content:space-between; padding:15mm 17mm 13mm; color:#f9f6ef; background:#203a32 }
.cover:before { position:absolute; top:0; right:0; width:65mm; height:100%; background:#2c4b41; content:"" }
.cover-top,.cover-bottom { position:relative; z-index:2; display:flex; justify-content:space-between; color:#d7ddd4; font-size:7pt; font-weight:700; letter-spacing:1.5px }
.cover-content { position:relative; z-index:2; max-width:155mm; margin-top:20mm }
.cover-kicker { color:#e6b5c3; font-size:8pt; font-weight:700; letter-spacing:2px }
.pixel-mark { position:relative; width:23mm; height:23mm; display:grid; place-items:center; margin:12mm 0 7mm; border:1px solid #d6a2b4; color:#fff9f3; font:700 25pt Georgia }
.pixel-mark span { position:absolute; right:1mm; bottom:1mm; color:#e6b5c3; font:700 11pt Arial }
.cover h1 { margin:0; font:800 41pt/0.98 Arial,sans-serif; letter-spacing:-1.5px }
.cover h1 em { color:#e5b3c1; font:italic 39pt/1 Georgia,serif }
.cover-sub { max-width:125mm; margin:7mm 0 0; color:#eef0e8; font:18pt/1.25 Georgia,serif }
.cover-divider { width:30mm; height:1mm; margin:8mm 0; background:#d995ad }
.cover-description { max-width:125mm; color:#d8e0d8; font:12pt/1.7 Georgia,serif }
.cover-tags { display:flex; flex-wrap:wrap; gap:3mm; margin-top:12mm }
.cover-tags span { padding:2.5mm 3mm; border:1px solid #6d887b; color:#f1e4e7; font-size:7pt; font-weight:700; letter-spacing:1px }
.cover-orbit { position:absolute; z-index:1; border:1px solid #567468; border-radius:50% }
.orbit-one { top:37mm; right:-35mm; width:130mm; height:130mm }
.orbit-two { top:70mm; right:-10mm; width:80mm; height:80mm; border-color:#739082 }
.cover-bottom { padding-top:4mm; border-top:1px solid #567468 }
@media screen { .page { box-shadow:0 4px 25px #203a3220 } }
@media print { body { background:white } .page { margin:0; box-shadow:none } }
</style></head><body>${cover}${bodyPages}</body></html>`;

await mkdir(here, { recursive: true });
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, html, "utf8");
console.log(`Wrote ${pages.length + 1} course pages to ${output}`);

const pdfOutput = path.join(project, "assets", "courses", "GCoder-Missao-Algoritmo-VisualG.pdf");
await mkdir(path.dirname(pdfOutput), { recursive: true });
const specialWinAnsi = new Map([
  ["€", 0x80], ["‚", 0x82], ["ƒ", 0x83], ["„", 0x84], ["…", 0x85], ["†", 0x86],
  ["‡", 0x87], ["ˆ", 0x88], ["‰", 0x89], ["Š", 0x8a], ["‹", 0x8b], ["Œ", 0x8c],
  ["Ž", 0x8e], ["‘", 0x91], ["’", 0x92], ["“", 0x93], ["”", 0x94], ["•", 0x95],
  ["–", 0x96], ["—", 0x97], ["˜", 0x98], ["™", 0x99], ["š", 0x9a], ["›", 0x9b],
  ["œ", 0x9c], ["ž", 0x9e], ["Ÿ", 0x9f],
]);
function winAnsi(value) {
  return String(value).replace(/[€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ→←×]/g, (character) => {
    if (character === "→") return "->";
    if (character === "←") return "<-";
    if (character === "×") return String.fromCharCode(0xd7);
    return String.fromCharCode(specialWinAnsi.get(character));
  }).replace(/[^\x00-\xff]/g, "?");
}
function pdfLiteral(value) {
  return winAnsi(value).replace(/([\\()])/g, "\\$1").replace(/[\r\n]/g, " ");
}
function pdfText(x, y, value, size = 10, font = "F1", color = "#30443b") {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(color.slice(i + 1, i + 3), 16) / 255);
  return `BT /${font} ${size} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfLiteral(value)}) Tj ET\n`;
}
function pdfRect(x, y, width, height, color) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(color.slice(i + 1, i + 3), 16) / 255);
  return `q ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x} ${y} ${width} ${height} re f Q\n`;
}
function pdfLine(x1, y1, x2, y2, color = "#dce3dc", width = 0.7) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(color.slice(i + 1, i + 3), 16) / 255);
  return `q ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S Q\n`;
}
function pdfCircle(cx, cy, radius, color) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(color.slice(i + 1, i + 3), 16) / 255);
  const k = radius * 0.55228475;
  return `q ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG 1 w ${cx + radius} ${cy} m ${cx + radius} ${cy + k} ${cx + k} ${cy + radius} ${cx} ${cy + radius} c ${cx - k} ${cy + radius} ${cx - radius} ${cy + k} ${cx - radius} ${cy} c ${cx - radius} ${cy - k} ${cx - k} ${cy - radius} ${cx} ${cy - radius} c ${cx + k} ${cy - radius} ${cx + radius} ${cy - k} ${cx + radius} ${cy} c S Q\n`;
}
function wrapText(text, maxChars) {
  const lines = [];
  for (const paragraph of String(text).split("\n")) {
    if (!paragraph) { lines.push(""); continue; }
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      if (line && `${line} ${word}`.length > maxChars) {
        lines.push(line);
        line = word;
      } else line = line ? `${line} ${word}` : word;
    }
    if (line) lines.push(line);
  }
  return lines;
}
function drawParagraph(commands, text, x, y, maxChars, size, leading, font = "F1", color = "#58675f") {
  const lines = wrapText(text, maxChars);
  for (const line of lines) {
    commands.push(pdfText(x, y, line, size, font, color));
    y -= leading;
  }
  return y;
}
function coverContent() {
  const c = [];
  c.push(pdfRect(0, 0, 595, 842, "#203a32"));
  c.push(pdfRect(420, 0, 175, 842, "#2c4b41"));
  c.push(pdfCircle(488, 470, 130, "#567468"));
  c.push(pdfCircle(515, 470, 80, "#748f82"));
  c.push(pdfText(48, 798, "GCODER  |  CADERNO DE MISSOES", 8, "F2", "#d7ddd4"));
  c.push(pdfText(442, 798, "EDICAO 01 / 2026", 7, "F2", "#d7ddd4"));
  c.push(pdfText(48, 687, "APRENDA DO ZERO  |  PRATIQUE  |  SUBA DE NIVEL", 8, "F2", "#e6b5c3"));
  c.push(pdfRect(48, 632, 62, 62, "#203a32"));
  c.push(pdfLine(48, 632, 110, 632, "#d6a2b4", 1));
  c.push(pdfLine(48, 694, 110, 694, "#d6a2b4", 1));
  c.push(pdfLine(48, 632, 48, 694, "#d6a2b4", 1));
  c.push(pdfLine(110, 632, 110, 694, "#d6a2b4", 1));
  c.push(pdfText(62, 649, "G+", 31, "F3", "#fff9f3"));
  c.push(pdfText(48, 555, "MISSAO", 42, "F2", "#f9f6ef"));
  c.push(pdfText(48, 510, "ALGORITMO", 39, "F2", "#e5b3c1"));
  c.push(pdfText(48, 468, "Logica de Programacao Gamificada com VisualG", 16, "F3", "#eef0e8"));
  c.push(pdfRect(48, 440, 82, 4, "#d995ad"));
  drawParagraph(c, "Uma apostila gratuita, passo a passo, para dar os primeiros passos em logica de programacao com VisuAlg.", 48, 411, 66, 12, 20, "F3", "#d8e0d8");
  const tags = [["SEM PRE-REQUISITOS", 48, 205], [`${pageIds.length} PAGINAS`, 226, 105], ["PORTUGOL / VISUALG", 344, 150]];
  for (const [label, x, w] of tags) {
    c.push(pdfRect(x, 312, w, 25, "#315347"));
    c.push(pdfText(x + 9, 321, label, 7, "F2", "#f1e4e7"));
  }
  c.push(pdfLine(48, 56, 547, 56, "#567468", 0.7));
  c.push(pdfText(48, 38, "DO PRIMEIRO ALGORITMO AO PROJETO FINAL", 7, "F2", "#d7ddd4"));
  c.push(pdfText(443, 38, "GCODER EDUCACAO", 7, "F2", "#d7ddd4"));
  return c.join("");
}
function pageContent(page, index) {
  const c = [];
  c.push(pdfRect(0, 0, 595, 842, "#fffdf9"));
  c.push(pdfRect(48, 792, 27, 27, "#25443a"));
  c.push(pdfText(56, 800, "G", 15, "F3", "#ffffff"));
  c.push(pdfText(84, 807, "GCODER", 9, "F2", "#263a34"));
  c.push(pdfText(84, 796, "ACADEMIA DE ALGORITMOS", 5.7, "F2", "#75867d"));
  c.push(pdfText(500, 805, `${String(index + 2).padStart(2, "0")} / ${pageIds.length}`, 9, "F2", "#25443a"));
  c.push(pdfLine(48, 782, 547, 782));
  c.push(pdfText(48, 758, page.chapter, 7.4, "F2", "#b06f87"));
  let y = 729;
  for (const line of wrapText(page.title, 34)) {
    c.push(pdfText(48, y, line, 23, "F2", "#263a34"));
    y -= 27;
  }
  y -= 4;
  y = drawParagraph(c, page.lead, 48, y, 91, 10, 14.5, "F3", "#57655e") - 10;

  for (let i = 0; i < page.facts.length; i += 1) {
    const [heading, description] = page.facts[i];
    const descLines = wrapText(description, 94);
    const cardHeight = 25 + descLines.length * 10.4;
    y -= cardHeight;
    c.push(pdfRect(48, y, 499, cardHeight - 2, i % 2 ? "#f6f6ef" : "#f8f7f0"));
    c.push(pdfRect(48, y, 3, cardHeight - 2, "#e5b3c1"));
    c.push(pdfText(59, y + cardHeight - 13, heading, 8.7, "F2", "#30483e"));
    let bodyY = y + cardHeight - 25;
    for (const line of descLines) {
      c.push(pdfText(59, bodyY, line, 7.6, "F1", "#647069"));
      bodyY -= 10.1;
    }
    y -= 4;
  }

  if (page.code) {
    const codeLines = page.code.split("\n");
    const codeHeight = 28 + codeLines.length * 10.2;
    y -= codeHeight;
    c.push(pdfRect(48, y, 499, codeHeight, "#1e302b"));
    c.push(pdfText(59, y + codeHeight - 14, "TERMINAL VISUALG", 6.2, "F2", "#d9a6b8"));
    c.push(pdfText(440, y + codeHeight - 14, `MISSAO ${String(index + 2).padStart(2, "0")}`, 6.2, "F2", "#d9a6b8"));
    let codeY = y + codeHeight - 29;
    for (const line of codeLines) {
      for (const wrapped of wrapText(line, 91)) {
        c.push(pdfText(59, codeY, wrapped, 7.15, "F4", "#f1f0e9"));
        codeY -= 9.2;
      }
    }
    y -= 8;
  }

  const xp = page.hint.match(/\+(\d+) XP/)?.[1] || "20";
  const challengeLines = wrapText(page.challenge, 85);
  const hint = page.hint.replace(/\s*\+\d+ XP.*/, "");
  const hintLines = wrapText(hint, 89);
  const missionHeight = 50 + challengeLines.length * 13 + hintLines.length * 10;
  y -= missionHeight;
  c.push(pdfRect(48, y, 499, missionHeight, "#f4e9ed"));
  c.push(pdfRect(48, y, 4, missionHeight, "#bb7790"));
  c.push(pdfText(60, y + missionHeight - 15, "DESAFIO", 6.8, "F2", "#804b60"));
  c.push(pdfText(502, y + missionHeight - 15, `+${xp} XP`, 6.8, "F2", "#804b60"));
  let missionY = y + missionHeight - 32;
  for (const line of challengeLines) {
    c.push(pdfText(60, missionY, line, 9.2, "F3", "#33453e"));
    missionY -= 12;
  }
  missionY -= 3;
  c.push(pdfLine(60, missionY + 2, 535, missionY + 2, "#e2cfd6", 0.5));
  missionY -= 10;
  c.push(pdfText(60, missionY, "PISTA / GABARITO", 5.8, "F2", "#804b60"));
  let hintY = missionY;
  for (const line of hintLines) {
    c.push(pdfText(155, hintY, line, 7.1, "F1", "#66746c"));
    hintY -= 9;
  }
  if (y < 68) console.warn(`Page ${index + 2} may be crowded (content bottom ${y.toFixed(1)}pt)`);
  c.push(pdfLine(48, 50, 547, 50));
  c.push(pdfText(48, 34, "MISSAO ALGORITMO  |  VISUALG", 6.2, "F2", "#829087"));
  c.push(pdfText(433, 34, "APRENDA FAZENDO  |  GCODER", 6.2, "F2", "#829087"));
  return c.join("");
}

const objects = [null];
function addObject(value) { objects.push(value); return objects.length - 1; }
const catalogId = addObject("");
const pagesId = addObject("");
const fontRegularId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
const fontBoldId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
const fontSerifId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic /Encoding /WinAnsiEncoding >>");
const fontMonoId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>");
const pageIds = [];
for (let pageIndex = 0; pageIndex < pages.length + 1; pageIndex += 1) {
  const stream = pageIndex === 0 ? coverContent() : pageContent(pages[pageIndex - 1], pageIndex - 1);
  const streamBuffer = Buffer.from(winAnsi(stream), "latin1");
  const contentId = addObject(Buffer.concat([
    Buffer.from(`<< /Length ${streamBuffer.length} >>\nstream\n`, "ascii"),
    streamBuffer,
    Buffer.from("\nendstream", "ascii"),
  ]));
  const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R /F3 ${fontSerifId} 0 R /F4 ${fontMonoId} 0 R >> >> /Contents ${contentId} 0 R >>`);
  pageIds.push(pageId);
}
objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
objects[pagesId] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >>`;
const infoId = addObject("<< /Title (Missao Algoritmo - Logica de Programacao Gamificada com VisualG) /Author (GCoder Educacao) /Subject (Curso introdutorio de algoritmos e VisualG) >>");
const pdfParts = [Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "binary")];
const offsets = [0];
let byteOffset = pdfParts[0].length;
for (let id = 1; id < objects.length; id += 1) {
  offsets[id] = byteOffset;
  const value = objects[id];
  const objectBytes = Buffer.isBuffer(value) ? value : Buffer.from(value, "latin1");
  const wrapped = Buffer.concat([
    Buffer.from(`${id} 0 obj\n`, "ascii"),
    objectBytes,
    Buffer.from("\nendobj\n", "ascii"),
  ]);
  pdfParts.push(wrapped);
  byteOffset += wrapped.length;
}
const xrefOffset = byteOffset;
let xref = `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
for (let id = 1; id < objects.length; id += 1) xref += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
pdfParts.push(Buffer.from(`${xref}trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R /Info ${infoId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`, "ascii"));
await writeFile(pdfOutput, Buffer.concat(pdfParts));
console.log(`Wrote ${pageIds.length} PDF pages to ${pdfOutput}`);
