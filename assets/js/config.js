/*
 * ============================================================
 *  ME · Configuração central do site
 * ============================================================
 *  Este é o ÚNICO arquivo que precisa ser editado para atualizar
 *  a campanha. A campanha é uma pré-venda por Pix, feita pelo MEI
 *  identificado no rodapé do site.
 *  O site muda sozinho de estado pela data:
 *
 *    dataFim = null          → campanha sem data para acabar, sempre ativa
 *    antes de dataFim        → "Campanha ativa" (Pix, contagem regressiva, barra)
 *    depois de dataFim       → "Encerrada" (agradecimento, sem Pix)
 *
 *  Regras gerais:
 *  - Campo desconhecido fica `null` (ou [] para listas). O site esconde o que é null.
 *  - Valores em reais são números, sem "R$", sem ponto de milhar:
 *    15000 (certo), "15.000" (errado), "R$ 15.000" (errado).
 *  - Datas no formato ISO com fuso de Brasília (-03:00).
 *  - Textos entre aspas duplas. Cuidado com vírgulas no fim de cada linha.
 *
 *  Veja o passo a passo no README.md.
 * ============================================================
 */
window.ME_CONFIG = {
  // --- Campanha ---

  // Número de cópias da primeira tiragem que a campanha vai produzir.
  tiragem: 100,

  // Data e hora de encerramento da campanha (horário de Brasília).
  // null = sem data para acabar (sem contagem regressiva).
  // Depois dela o site agradece e esconde o Pix. Se mudar esta data, mude
  // também "Campanha aberta até 01/05/2027" no index.html e no termos.html.
  // ex.: "2027-03-31T21:00:00-03:00"
  dataFim: "2027-05-01T23:59:59-03:00",

  // Meta da campanha em reais (número inteiro, sem "R$").
  // ex.: 25000
  metaReais: 25000,


  // --- Atualizados manualmente conforme os Pix chegam ---

  // Total arrecadado até agora, em reais (número). Move a barra de meta.
  // ex.: 8350
  arrecadadoReais: null,

  // Número de apoiadores até agora.
  // ex.: 37
  apoiadores: null,

  // Data da última atualização dos números acima, em texto livre.
  // ex.: "25/11/2026"
  arrecadadoAtualizadoEm: null,

  // Nomes da lista de apoiadores: nome e sobrenome ou primeiro nome com a
  // inicial do sobrenome. Só inclua quem autorizou aparecer. Não publique
  // apelidos, frases, nomes de empresas, links nem nada ofensivo.
  // ex.: ["Ana Souza", "Bia", "Carlos M."]
  listaApoiadores: [],

  // --- Compartilhamento ---

  // Endereço enviado nas mensagens de compartilhamento e no link do vídeo,
  // qualquer que seja o endereço em que o site estiver aberto (GitHub Pages,
  // localhost etc.). Com null, usa o endereço atual da página.
  urlCompartilhar: "https://playme.app.br/",

  // --- Pix ---

  // Chave Pix que recebe os apoios. Use null para esconder o Pix do site.
  // CNPJ ou CPF podem ser escritos com pontuação: o site mostra assim, mas
  // copia e gera o código Pix só com os números.
  // ex.: "50.102.013/0001-40"
  pixChave: "50.102.013/0001-40",

  // Valores sugeridos (em reais) que aparecem como botões.
  // Use [] para mostrar só a chave.
  // ex.: [50, 100, 150, 200, 350, 500]
  pixValores: [50, 100, 150, 200, 350, 500],

  // Valor mínimo (em reais) que garante uma cópia do jogo (frete à parte).
  // Abaixo dele, a recompensa é só o nome na lista de apoiadores.
  // ex.: 350
  pixValorCopia: 350,

  // Nome do recebedor (com chave CNPJ, a razão social da empresa) e cidade
  // do recebedor, exigidos pelo padrão do Pix para
  // gerar o "Pix copia e cola" e o QR Code já com o valor escolhido. Sem
  // acentos é mais seguro; o nome é cortado em 25 letras e a cidade em 15.
  // Enquanto algum dos dois for null, os botões de valor só sugerem a quantia
  // e a pessoa copia a chave e digita o valor no app do banco.
  // ex.: pixNome: "Nome Empresarial", pixCidade: "Ribeirao Preto"
  pixNome: "Juliana Bonazone",
  pixCidade: "Ribeirao Preto",

  // --- Contato e redes ---

  // Endereço completo do perfil do Instagram.
  // ex.: "https://www.instagram.com/playme.app"
  instagram: null,

  // E-mail de contato. Recebe os comprovantes do Pix, os nomes para a lista
  // de apoiadores e os endereços de entrega.
  // ex.: "contato@playme.app.br"
  email: "euajudei@playme.app.br"
};
