/*
 * ============================================================
 *  ME · Configuração central do site
 * ============================================================
 *  Este é o ÚNICO arquivo que precisa ser editado para atualizar
 *  a campanha. A campanha é feita por Pix, direto com o criador.
 *  O site muda sozinho de estado pela data:
 *
 *    antes de dataFim (ou dataFim = null) → "Campanha ativa" (Pix, contagem, barra)
 *    depois de dataFim                    → "Encerrada" (agradecimento, sem Pix)
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
  tiragem: 50,

  // Data e hora de encerramento da campanha (horário de Brasília).
  // Depois dela, o site agradece e esconde o Pix.
  // ex.: "2026-12-10T21:00:00-03:00"
  dataFim: "2026-12-10T21:00:00-03:00",

  // Meta da campanha em reais (número inteiro, sem "R$").
  // ex.: 25000
  metaReais: 25000,

  // Previsão de entrega das cópias, em texto livre.
  // ex.: "Março de 2027"
  previsaoEntrega: null,

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

  // --- Pix ---

  // Chave Pix que recebe os apoios. Use null para esconder o Pix do site.
  // ex.: "51486162-fb79-4f2d-a3cb-6eaef5924947"
  pixChave: "51486162-fb79-4f2d-a3cb-6eaef5924947",

  // Valores sugeridos (em reais) que aparecem como botões.
  // Use [] para mostrar só a chave.
  // ex.: [50, 100, 150, 200, 250, 500]
  pixValores: [50, 100, 150, 200, 250, 500],

  // Valor mínimo (em reais) que garante uma cópia do jogo (frete à parte).
  // Abaixo dele, a recompensa é só o nome na lista de apoiadores.
  // ex.: 500
  pixValorCopia: 500,

  // Nome do recebedor e cidade do recebedor, exigidos pelo padrão do Pix para
  // gerar o "Pix copia e cola" e o QR Code já com o valor escolhido. Sem
  // acentos é mais seguro; o nome é cortado em 25 letras e a cidade em 15.
  // Enquanto algum dos dois for null, os botões de valor só sugerem a quantia
  // e a pessoa copia a chave e digita o valor no app do banco.
  // ex.: pixNome: "Tiberio Silva", pixCidade: "Ribeirao Preto"
  pixNome: null,
  pixCidade: "Ribeirao Preto",

  // --- Contato e redes ---

  // Número do WhatsApp com DDI e DDD, só dígitos. Recebe os comprovantes,
  // os nomes para a lista e os endereços de entrega.
  // ex.: "5516999999999"
  whatsapp: "5516981000167",

  // Endereço completo do perfil do Instagram.
  // ex.: "https://www.instagram.com/playme.app"
  instagram: null,

  // E-mail de contato.
  // ex.: "contato@playme.app.br"
  email: null
};
