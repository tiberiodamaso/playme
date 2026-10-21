/*
 * ME · comportamento do site
 * Lê window.ME_CONFIG (assets/js/config.js) e ajusta a página.
 * Não edite este arquivo para atualizar a campanha: use o config.js.
 */
(function () {
  "use strict";

  var c = window.ME_CONFIG || {};
  var TZ = "America/Sao_Paulo";

  // ---------- Validação: tudo que não passa aqui é tratado como "ainda não definido" ----------
  function isNum(v) { return typeof v === "number" && isFinite(v) && v > 0; }
  function isStr(v) { return typeof v === "string" && v.trim() !== ""; }
  function isUrl(v) { return isStr(v) && /^https?:\/\//i.test(v.trim()); }
  function parseDate(v) {
    if (!isStr(v)) return null;
    var t = Date.parse(v);
    return isNaN(t) ? null : new Date(t);
  }

  // ---------- Formatação ----------
  function brl(n) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency", currency: "BRL",
      minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2
    }).format(n);
  }
  function int(n) { return new Intl.NumberFormat("pt-BR").format(n); }
  function longDate(d) {
    return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(d);
  }
  function longDateTime(d) {
    return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(d);
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function setLink(a, href, external) {
    a.setAttribute("href", href);
    if (external) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); }
    else { a.removeAttribute("target"); a.removeAttribute("rel"); }
  }

  var campaignUrl = isUrl(c.campanhaUrl) ? c.campanhaUrl.trim() : null;
  var instagramUrl = isUrl(c.instagram) ? c.instagram.trim() : null;
  var rewards = Array.isArray(c.recompensas) ? c.recompensas.filter(function (r) { return r && isStr(r.nome); }) : [];

  // ---------- Estado da campanha ----------
  function getState(now) {
    var ini = parseDate(c.dataInicio), fim = parseDate(c.dataFim);
    if (!ini) return "embreve";
    if (now < ini) return "agendado";
    if (fim && now >= fim) return "encerrada";
    return "ativa";
  }

  function ctaFor(state) {
    switch (state) {
      case "agendado":
        return {
          primary: campaignUrl
            ? { text: "Ver a campanha na MeepleStarter", short: "Ver campanha", href: campaignUrl, ext: true }
            : { text: "Lançamento em breve", short: "Em breve", href: "#como-apoiar" },
          secondary: instagramUrl ? { text: "Siga para ser avisado(a) do lançamento", href: instagramUrl, ext: true } : null,
          note: "Lançamento marcado na MeepleStarter."
        };
      case "ativa":
        return {
          primary: campaignUrl
            ? { text: "Apoiar agora", short: "Apoiar agora", href: campaignUrl, ext: true }
            : { text: "Campanha no ar", short: "Apoiar", href: "#como-apoiar" },
          secondary: rewards.length ? { text: "Ver recompensas", href: "#recompensas" } : null,
          note: "A campanha está no ar. Lembre: é tudo ou nada, e se a meta não for batida o dinheiro volta."
        };
      case "encerrada":
        return {
          primary: campaignUrl
            ? { text: "Ver a campanha na MeepleStarter", short: "Ver campanha", href: campaignUrl, ext: true }
            : { text: "Campanha encerrada", short: "Encerrada", href: "#como-apoiar" },
          secondary: instagramUrl ? { text: "Acompanhe no Instagram", href: instagramUrl, ext: true } : null,
          note: "A campanha foi encerrada. Obrigado a cada pessoa que apoiou o ME!"
        };
      default: // "embreve"
        return {
          primary: { text: "Em breve na MeepleStarter", short: "Em breve", href: "#como-apoiar" },
          secondary: instagramUrl ? { text: "Siga para ser avisado(a) do lançamento", href: instagramUrl, ext: true } : null,
          note: "Campanha em preparação. Veja abaixo como funciona o apoio."
        };
    }
  }

  function fillLink(a, spec, label) {
    a.textContent = label;
    if (spec.ext) a.appendChild(el("span", { "class": "visually-hidden" }, " (abre em nova aba)"));
    setLink(a, spec.href, !!spec.ext);
  }

  function applyCtas(state) {
    var spec = ctaFor(state);
    $$("[data-cta]").forEach(function (a) {
      fillLink(a, spec.primary, a.getAttribute("data-cta") === "short" ? spec.primary.short : spec.primary.text);
    });
    $$("[data-cta-secondary]").forEach(function (a) {
      if (spec.secondary) { fillLink(a, spec.secondary, spec.secondary.text); a.hidden = false; }
      else a.hidden = true;
    });
    $$("[data-state-note]").forEach(function (p) { p.textContent = spec.note; });
    var finalText = $("[data-final-text]");
    if (finalText && state === "encerrada") finalText.textContent = "A campanha foi encerrada. Obrigado a cada pessoa que apoiou o ME!";
    document.documentElement.setAttribute("data-campaign-state", state);
  }

  // ---------- Valores simples ----------
  function applyStatic() {
    if (isNum(c.tiragem)) $$('[data-config="tiragem"]').forEach(function (s) { s.textContent = int(c.tiragem); });
    if (isStr(c.plataforma)) $$('[data-config="plataforma"]').forEach(function (s) { s.textContent = c.plataforma; });
    if (isStr(c.modalidade)) $$('[data-config="modalidade"]').forEach(function (s) { s.textContent = c.modalidade; });

    var goal = $("[data-goal-text]");
    if (goal && isNum(c.metaReais)) {
      goal.textContent = brl(c.metaReais) + " para produzir " + (isNum(c.tiragem) ? int(c.tiragem) : "50") + " cópias";
    }

    var ini = parseDate(c.dataInicio), fim = parseDate(c.dataFim);
    var dates = $("[data-dates]"), datesText = $("[data-dates-text]");
    if (dates && (ini || fim)) {
      var t = ini && fim ? longDate(ini) + " a " + longDate(fim)
            : ini ? "Início em " + longDateTime(ini)
            : "Até " + longDateTime(fim);
      datesText.textContent = t;
      dates.hidden = false;
    }

    var delivery = $("[data-delivery-text]");
    if (delivery && isStr(c.previsaoEntrega)) {
      delivery.textContent = "A previsão de entrega é " + c.previsaoEntrega.trim() + ". Os detalhes de envio estão na página da campanha.";
    }

    var footerCampaign = $("[data-footer-campaign]");
    if (footerCampaign && campaignUrl) {
      footerCampaign.firstChild.textContent = "Campanha na MeepleStarter";
      footerCampaign.setAttribute("href", campaignUrl);
    }
  }

  // ---------- Contato e redes ----------
  function applyContacts() {
    var links = [];
    if (instagramUrl) links.push({ key: "instagram", label: "Instagram", href: instagramUrl, ext: true });
    if (isStr(c.whatsapp)) {
      var digits = c.whatsapp.replace(/\D/g, "");
      if (digits.length >= 10) links.push({ key: "whatsapp", label: "WhatsApp", href: "https://wa.me/" + digits, ext: true });
    }
    if (isStr(c.email) && /@/.test(c.email)) links.push({ key: "email", label: "E-mail", href: "mailto:" + c.email.trim(), ext: false });

    links.forEach(function (l) {
      var a = $('[data-link="' + l.key + '"]');
      if (a) { a.setAttribute("href", l.href); a.parentElement.hidden = false; }
    });

    var line = $("[data-contact-line]"), holder = $("[data-contact-links]");
    if (line && holder && links.length) {
      links.forEach(function (l, i) {
        if (i) holder.appendChild(document.createTextNode(" · "));
        var a = el("a", { href: l.href }, l.label);
        if (l.ext) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); a.appendChild(el("span", { "class": "visually-hidden" }, " (abre em nova aba)")); }
        holder.appendChild(a);
      });
      line.hidden = false;
    }
  }

  // ---------- Contribuição direta por Pix ----------
  function applyPix() {
    var box = $("[data-pix]");
    if (!box || !isStr(c.pixChave)) return;
    var key = c.pixChave.trim();
    $("[data-pix-key]", box).textContent = key;
    box.hidden = false;
    var faq = $("[data-pix-faq]");
    if (faq) faq.hidden = false;
    var headerBtn = $("[data-pix-header]");
    if (headerBtn) headerBtn.hidden = false;

    var btn = $("[data-pix-copy]", box), fb = $("[data-pix-feedback]", box);
    btn.addEventListener("click", function () {
      function done(ok) {
        fb.textContent = ok ? "Chave copiada. Agora é só colar no app do seu banco." : "Não deu para copiar automaticamente. Selecione a chave acima e copie.";
        if (ok) { btn.textContent = "Copiada!"; setTimeout(function () { btn.textContent = "Copiar chave"; }, 2500); }
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(key).then(function () { done(true); }, function () { done(false); });
      } else {
        var range = document.createRange();
        range.selectNodeContents($("[data-pix-key]", box));
        var sel = window.getSelection();
        sel.removeAllRanges(); sel.addRange(range);
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        done(ok);
      }
    });
  }

  // ---------- Progresso da meta ----------
  function applyProgress(state) {
    var showBar = (state === "ativa" || state === "encerrada") && isNum(c.metaReais) && isNum(c.arrecadadoReais);
    var showBackers = (state === "ativa" || state === "encerrada") && isNum(c.apoiadores);
    $$("[data-progress]").forEach(function (box) {
      var main = $("[data-progress-main]", box);
      if (showBar) {
        var pct = Math.floor((c.arrecadadoReais / c.metaReais) * 100);
        var bar = $("[role=progressbar]", box);
        bar.setAttribute("aria-valuenow", String(Math.min(pct, 100)));
        bar.setAttribute("aria-valuetext", pct + "% da meta");
        $("[data-progress-fill]", box).style.width = Math.min(pct, 100) + "%";
        $("[data-progress-raised]", box).textContent = brl(c.arrecadadoReais);
        $("[data-progress-of]", box).textContent = "arrecadados de " + brl(c.metaReais);
        $("[data-progress-pct]", box).textContent = "(" + pct + "%)";
      }
      if (main) main.hidden = !showBar;
      var backers = $("[data-progress-backers]", box);
      if (showBackers) {
        backers.textContent = int(c.apoiadores) + (c.apoiadores === 1 ? " apoiador" : " apoiadores");
        backers.hidden = false;
      } else backers.hidden = true;
      box.hidden = !(showBar || showBackers);
    });
  }

  // ---------- Contagem regressiva ----------
  var timer = null;
  function applyCountdown(state) {
    var box = $("[data-countdown]");
    if (!box) return;
    if (timer) { clearInterval(timer); timer = null; }
    var target = null, label = "";
    if (state === "agendado") { target = parseDate(c.dataInicio); label = "A campanha começa em"; }
    else if (state === "ativa" && parseDate(c.dataFim)) { target = parseDate(c.dataFim); label = "A campanha termina em"; }
    if (!target) { box.hidden = true; return; }

    $("[data-countdown-label]", box).textContent = label;
    var parts = { d: $('[data-cd="d"]', box), h: $('[data-cd="h"]', box), m: $('[data-cd="m"]', box), s: $('[data-cd="s"]', box) };
    function tick() {
      var diff = target.getTime() - Date.now();
      if (diff <= 0) { clearInterval(timer); timer = null; applyAll(); return; }
      var s = Math.floor(diff / 1000);
      parts.d.textContent = String(Math.floor(s / 86400));
      parts.h.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
      parts.m.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      parts.s.textContent = String(s % 60).padStart(2, "0");
    }
    tick();
    box.hidden = false;
    timer = setInterval(tick, 1000);
  }

  // ---------- Recompensas ----------
  function applyRewards(state) {
    var grid = $("[data-rewards]"), lead = $("[data-rewards-lead]");
    if (!grid || !rewards.length) return; // mantém os cards-esqueleto do HTML
    grid.replaceChildren();
    if (lead) lead.textContent = state === "encerrada"
      ? "Estes foram os níveis de apoio da campanha."
      : "Cada nível de apoio está disponível na página da campanha na MeepleStarter.";

    rewards.forEach(function (r) {
      var card = el("article", { "class": "reward" + (r.destaque === true ? " reward-featured" : "") });
      if (r.destaque === true) card.appendChild(el("span", { "class": "reward-badge" }, "Recomendado"));
      card.appendChild(el("h3", null, r.nome.trim()));
      if (isNum(r.valor)) card.appendChild(el("p", { "class": "reward-price" }, brl(r.valor)));
      if (isStr(r.descricao)) card.appendChild(el("p", { "class": "reward-desc" }, r.descricao.trim()));
      var itens = Array.isArray(r.itens) ? r.itens.filter(isStr) : [];
      if (itens.length) {
        var ul = el("ul");
        itens.forEach(function (i) { ul.appendChild(el("li", null, i.trim())); });
        card.appendChild(ul);
      }
      if (isNum(r.limite)) card.appendChild(el("p", { "class": "reward-limit" }, "Limitado a " + int(r.limite) + (r.limite === 1 ? " apoio" : " apoios")));
      if (campaignUrl && state !== "encerrada") {
        var a = el("a", { "class": "btn " + (r.destaque === true ? "btn-primary" : "btn-ghost") });
        fillLink(a, { href: campaignUrl, ext: true }, state === "ativa" ? "Apoiar com esta recompensa" : "Ver na MeepleStarter");
        if (r.destaque === true) { a.style.background = "var(--ink)"; a.style.color = "var(--white)"; a.style.boxShadow = "none"; }
        card.appendChild(a);
      }
      grid.appendChild(card);
    });
  }

  function applyAll() {
    var state = getState(new Date());
    applyCtas(state);
    applyProgress(state);
    applyCountdown(state);
    applyRewards(state);
  }

  // ---------- Demo "Experimente" ----------
  var DEMO = [
    { cat: "Social", icon: "social", color: "var(--orange)",
      q: "Como você sai de uma festa:",
      opts: ["Vou ao banheiro e sumo", "Aviso todo mundo", "Aviso só quem me trouxe", "Saio de fininho"],
      answer: 1, why: "A despedida da Juli dura 40 minutos. Ninguém vai embora antes dela terminar." },
    { cat: "Digital", icon: "digital", color: "var(--green)",
      q: "Chega um áudio de cinco minutos:",
      opts: ["Escuto tudo na hora", "Respondo por texto", "Escuto acelerado", "Deixo pra depois e esqueço"],
      answer: 2, why: "Em 2x. Em 3x se for do grupo da família." },
    { cat: "Personalidade", icon: "personalidade", color: "var(--blue)",
      q: "O que te tira do sério mais rápido:",
      opts: ["Injustiça", "Barulho de mastigação", "Ser interrompido(a)", "Ser ignorado(a)"],
      answer: 2, why: "Quem fala pelos cotovelos precisa terminar a frase." },
    { cat: "Social", icon: "social", color: "var(--orange)",
      q: "Na hora de dividir a conta:",
      opts: ["Pago tudo e cobro depois", "Faço a conta exata", "Divido igual pra não discutir", "Sumo na maquininha"],
      answer: 0, why: "E cobra mesmo: Pix copia e cola e lembrete no dia seguinte." }
  ];
  var LETTERS = ["A", "B", "C", "D"];

  function initDemo() {
    var card = $("[data-demo-card]"), live = $("[data-demo-live]");
    if (!card) return;
    var idx = 0, score = 0;

    function icon(name) {
      var svgNS = "http://www.w3.org/2000/svg";
      var s = document.createElementNS(svgNS, "svg");
      s.setAttribute("aria-hidden", "true");
      var u = document.createElementNS(svgNS, "use");
      u.setAttribute("href", "#ic-" + name);
      s.appendChild(u);
      return s;
    }

    function renderQuestion(focus) {
      var d = DEMO[idx];
      card.replaceChildren();
      card.style.setProperty("--cat", d.color);
      var head = el("div", { "class": "dq-head" });
      var cat = el("span", { "class": "dq-cat" });
      cat.appendChild(icon(d.icon));
      cat.appendChild(document.createTextNode(d.cat));
      head.appendChild(cat);
      head.appendChild(el("span", { "class": "dq-count" }, "Pergunta " + (idx + 1) + " de " + DEMO.length));
      card.appendChild(head);
      var qid = "dq-q-" + idx;
      card.appendChild(el("p", { "class": "dq-question", id: qid }, d.q));
      card.appendChild(el("p", { "class": "dq-ask" }, "O que a Juli respondeu?"));
      var list = el("ul", { "class": "dq-options", "aria-labelledby": qid });
      d.opts.forEach(function (o, i) {
        var li = el("li");
        var b = el("button", { type: "button", "class": "dq-option" });
        b.appendChild(el("b", null, LETTERS[i]));
        b.appendChild(el("span", null, o));
        b.addEventListener("click", function () { choose(i); });
        li.appendChild(b);
        list.appendChild(li);
      });
      card.appendChild(list);
      if (focus) { var first = $(".dq-option", card); if (first) first.focus(); }
    }

    function choose(i) {
      var d = DEMO[idx], ok = i === d.answer;
      if (ok) score++;
      $$(".dq-option", card).forEach(function (b, j) {
        b.disabled = true;
        if (j === d.answer) { b.classList.add("is-answer"); b.appendChild(el("span", { "class": "tag" }, "Juli")); }
        else if (j === i) { b.classList.add("is-wrong"); b.appendChild(el("span", { "class": "tag" }, "Você")); }
      });
      var res = el("div", { "class": "dq-result" });
      res.appendChild(el("strong", null, ok ? "Acertou!" : "Não foi dessa vez."));
      res.appendChild(el("p", null, (ok ? "" : "A Juli escolheu " + LETTERS[d.answer] + ", " + d.opts[d.answer].toLowerCase() + ". ") + d.why));
      card.appendChild(res);
      var last = idx === DEMO.length - 1;
      var next = el("button", { type: "button", "class": "btn btn-primary dq-next" }, last ? "Ver meu resultado" : "Próxima pergunta");
      next.addEventListener("click", function () {
        if (last) renderFinal(); else { idx++; renderQuestion(true); }
      });
      card.appendChild(next);
      if (live) live.textContent = (ok ? "Acertou! " : "Errou. ") + "Resposta da Juli: " + LETTERS[d.answer] + ", " + d.opts[d.answer] + ". " + d.why;
      next.focus();
    }

    function renderFinal() {
      card.replaceChildren();
      card.style.removeProperty("--cat");
      var msg = score === 4 ? "Você conhece a Juli melhor do que a mãe dela."
              : score === 3 ? "Quase perfeito. A Juli ainda guarda um segredinho."
              : score === 2 ? "Metade certo. A Juli ainda tem muito para revelar."
              : "A Juli é um mistério para você. E tudo bem: é assim que o jogo começa.";
      var box = el("div", { "class": "dq-final" });
      box.appendChild(el("p", { "class": "kicker" }, "Seu resultado"));
      var h = el("p", { "class": "dq-score", tabindex: "-1" }, score + " de " + DEMO.length);
      box.appendChild(h);
      box.appendChild(el("p", null, msg));
      box.appendChild(el("p", null, "No ME são 180 perguntas, e a pessoa do outro lado da mesa é real."));
      var g = el("div", { "class": "cta-group" });
      var a = el("a", { "class": "btn btn-primary", "data-cta": "primary", href: "#como-apoiar" }, "Em breve na MeepleStarter");
      g.appendChild(a);
      box.appendChild(g);
      var again = el("button", { type: "button", "class": "dq-restart" }, "Jogar de novo");
      again.addEventListener("click", function () { idx = 0; score = 0; renderQuestion(true); });
      box.appendChild(again);
      card.appendChild(box);
      applyCtas(getState(new Date()));
      if (live) live.textContent = "Resultado: você acertou " + score + " de " + DEMO.length + ". " + msg;
      h.focus();
    }

    renderQuestion(false);
  }

  // ---------- Animação de entrada ----------
  function initReveal() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(function (i) { i.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (i) { io.observe(i); });
  }

  applyStatic();
  applyContacts();
  applyPix();
  applyAll();
  initDemo();
  initReveal();
})();
