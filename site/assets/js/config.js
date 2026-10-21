/*
 * ============================================================
 *  ME · Configuração central do site
 * ============================================================
 *  Este é o ÚNICO arquivo que precisa ser editado para atualizar
 *  a campanha. O site lê estes valores e muda sozinho de estado:
 *
 *    dataInicio = null              → "Em breve"
 *    dataInicio no futuro           → "Lançamento agendado" (contagem regressiva)
 *    entre dataInicio e dataFim     → "Campanha ativa" (apoiar, progresso)
 *    depois de dataFim              → "Encerrada" (agradecimento)
 *
 *  Regras gerais:
 *  - Campo desconhecido fica `null` (ou [] para listas). Nunca use 0
 *    ou "" para dizer "ainda não sei": o site esconde o que é null.
 *  - Valores em reais são números, sem "R$", sem ponto de milhar:
 *    15000 (certo), "15.000" (errado), "R$ 15.000" (errado).
 *  - Datas no formato ISO com fuso de Brasília (-03:00).
 *  - Textos entre aspas duplas. Cuidado com vírgulas no fim de cada linha.
 *
 *  Veja o checklist completo no README.md.
 * ============================================================
 */
window.ME_CONFIG = {
  // --- Já definidos ---

  // Nome da plataforma onde a campanha acontece.
  plataforma: "MeepleStarter",

  // Modalidade da campanha na MeepleStarter ("tudo ou nada").
  modalidade: "Meta Fixa",

  // Número de cópias da primeira tiragem que a campanha vai produzir.
  tiragem: 50,

  // --- A definir: preencher quando a campanha for configurada ---

  // Endereço completo da página da campanha na MeepleStarter.
  // ex.: "https://meeplestarter.com.br/slug-do-me"
  campanhaUrl: "https://meeplestarter.com.br/playme",

  // Data e hora de início da campanha (horário de Brasília).
  // ex.: "2027-03-01T10:00:00-03:00"
  dataInicio: "2026-11-03T10:00:00-03:00",

  // Data e hora de encerramento da campanha (horário de Brasília).
  // ex.: "2027-04-15T23:59:00-03:00"
  dataFim: "2026-12-10T21:00:00-03:00",

  // Meta da campanha em reais (número inteiro, sem "R$").
  // ex.: 15000
  metaReais: null,

  // Previsão de entrega das recompensas, em texto livre.
  // ex.: "Agosto de 2027"
  previsaoEntrega: null,

  // Níveis de apoio. Cada item gera um card automaticamente.
  //   nome:      título do nível                  ex.: "Cópia do ME"
  //   valor:     preço em reais (número)          ex.: 249
  //   descricao: frase curta                      ex.: "Uma das 50 cópias da primeira tiragem."
  //   itens:     lista do que vem                 ex.: ["Jogo ME completo", "Nome no manual"]
  //   destaque:  true marca o nível recomendado (use em apenas um)
  //   limite:    quantidade máxima, ou null       ex.: 20
  // ex.: [{ nome: "Cópia do ME", valor: 249, descricao: "…", itens: ["…"], destaque: true, limite: null }]
  recompensas: [],

  // --- Atualizados manualmente durante a campanha ---

  // Total arrecadado até agora, em reais (número). Copie da página da campanha.
  // ex.: 8350
  arrecadadoReais: null,

  // Número de apoiadores até agora. Copie da página da campanha.
  // ex.: 37
  apoiadores: null,

  // --- Contribuição direta por Pix ---

  // Chave Pix para contribuições voluntárias feitas direto ao criador, fora da
  // MeepleStarter (sem recompensa; devolvidas se a meta não for atingida).
  // Use null para esconder a opção do site.
  // ex.: "51486162-fb79-4f2d-a3cb-6eaef5924947"
  pixChave: "51486162-fb79-4f2d-a3cb-6eaef5924947",

  // --- Contato e redes (placeholders) ---

  // Endereço completo do perfil do Instagram.
  // ex.: "https://www.instagram.com/playme.app"
  instagram: null,

  // Número do WhatsApp com DDI e DDD, só dígitos.
  // ex.: "5516999999999"
  whatsapp: null,

  // E-mail de contato.
  // ex.: "contato@playme.app.br"
  email: null
};
