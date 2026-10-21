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

  var instagramUrl = isUrl(c.instagram) ? c.instagram.trim() : null;
  var whatsDigits = isStr(c.whatsapp) ? c.whatsapp.replace(/\D/g, "") : "";
  if (whatsDigits.length < 10) whatsDigits = "";
  var hasPix = isStr(c.pixChave);
  var copyMin = isNum(c.pixValorCopia) ? c.pixValorCopia : null;
  var tiragem = isNum(c.tiragem) ? int(c.tiragem) : "50";

  // ---------- Estado da campanha ----------
  // A campanha é por Pix e está aberta até dataFim. Depois disso, "encerrada".
  function getState(now) {
    var fim = parseDate(c.dataFim);
    return fim && now >= fim ? "encerrada" : "ativa";
  }

  function ctaFor(state) {
    if (state === "encerrada") {
      return {
        primary: { text: "Ver quem apoiou", href: "#apoiadores" },
        secondary: null,
        note: "A campanha foi encerrada. Obrigado a cada pessoa que apoiou o ME!"
      };
    }
    return {
      primary: hasPix ? { text: "Apoiar com Pix", href: "#pix" } : { text: "Como apoiar", href: "#como-apoiar" },
      secondary: { text: "Experimente o jogo", href: "#experimente" },
      note: copyMin ? "A partir de " + brl(copyMin) + ", uma cópia do jogo é sua." : "Qualquer valor ajuda a levar o ME para a gráfica."
    };
  }

  function applyCtas(state) {
    var spec = ctaFor(state);
    $$("[data-cta]").forEach(function (a) { a.textContent = spec.primary.text; a.setAttribute("href", spec.primary.href); });
    $$("[data-cta-secondary]").forEach(function (a) {
      if (spec.secondary) { a.textContent = spec.secondary.text; a.setAttribute("href", spec.secondary.href); a.hidden = false; }
      else a.hidden = true;
    });
    $$("[data-state-note]").forEach(function (p) { p.textContent = spec.note; });
    var finalText = $("[data-final-text]");
    if (finalText && state === "encerrada") finalText.textContent = "A campanha foi encerrada. Obrigado a cada pessoa que apoiou o ME!";

    // Pix só durante a campanha
    var pixOpen = hasPix && state !== "encerrada";
    ["[data-pix]", "[data-pix-header]"].forEach(function (s) { $$(s).forEach(function (e) { e.hidden = !pixOpen; }); });
    $$("[data-reward-pix]").forEach(function (e) { e.hidden = !pixOpen; });
    document.documentElement.setAttribute("data-campaign-state", state);
  }

  // ---------- Valores simples ----------
  function applyStatic() {
    if (isNum(c.tiragem)) $$('[data-config="tiragem"]').forEach(function (s) { s.textContent = tiragem; });
    if (copyMin) $$("[data-pix-offer-value]").forEach(function (s) { s.textContent = brl(copyMin); });

    var goal = $("[data-goal-text]");
    if (goal && isNum(c.metaReais)) goal.textContent = brl(c.metaReais) + " para produzir " + tiragem + " cópias";

    var fim = parseDate(c.dataFim);
    var dates = $("[data-dates]");
    if (dates && fim) { $("[data-dates-text]").textContent = "Até " + longDateTime(fim); dates.hidden = false; }

    var delivery = $("[data-delivery-text]");
    if (delivery && isStr(c.previsaoEntrega)) {
      delivery.textContent = "A previsão de entrega é " + c.previsaoEntrega.trim() + ". O frete é combinado pelo WhatsApp, conforme o seu endereço.";
    }
  }

  // ---------- Contato e redes ----------
  function applyContacts() {
    var links = [];
    if (instagramUrl) links.push({ key: "instagram", label: "Instagram", href: instagramUrl, ext: true });
    if (whatsDigits) links.push({ key: "whatsapp", label: "WhatsApp", href: "https://wa.me/" + whatsDigits, ext: true });
    if (isStr(c.email) && /@/.test(c.email)) links.push({ key: "email", label: "E-mail", href: "mailto:" + c.email.trim(), ext: false });

    links.forEach(function (l) {
      var a = $('[data-link="' + l.key + '"]');
      if (a) { a.setAttribute("href", l.href); a.parentElement.hidden = false; }
    });
    if (whatsDigits) {
      var fa = $('[data-link="whatsapp-faq"]');
      if (fa) { fa.setAttribute("href", "https://wa.me/" + whatsDigits); $("[data-contact-line-faq]").hidden = false; }
    }

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

  // ---------- Pix ----------
  // Monta o "Pix copia e cola" (BR Code, padrão EMV do Banco Central).
  function emv(id, value) { return id + String(value.length).padStart(2, "0") + value; }
  function crc16(str) {
    var crc = 0xFFFF;
    for (var i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (var j = 0; j < 8; j++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }
  function ascii(s, max) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9 ]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
  }
  function pixPayload(key, amount, name, city) {
    var p = emv("00", "01") +
      emv("26", emv("00", "br.gov.bcb.pix") + emv("01", key)) +
      emv("52", "0000") + emv("53", "986") + emv("54", amount.toFixed(2)) +
      emv("58", "BR") + emv("59", name) + emv("60", city) +
      emv("62", emv("05", "***")) + "6304";
    return p + crc16(p);
  }

  var qrLoader = null;
  function loadQr() {
    if (window.qrcode) return Promise.resolve();
    if (!qrLoader) qrLoader = new Promise(function (ok, fail) {
      var s = document.createElement("script");
      s.src = "assets/js/vendor/qrcode.js";
      s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
    return qrLoader;
  }
  function drawQr(holder, text, label) {
    loadQr().then(function () {
      var qr = window.qrcode(0, "M");
      qr.addData(text); qr.make();
      var n = qr.getModuleCount(), m = 2, d = "";
      for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (qr.isDark(y, x)) d += "M" + (x + m) + " " + (y + m) + "h1v1h-1z";
      var ns = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", "0 0 " + (n + 2 * m) + " " + (n + 2 * m));
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", label);
      svg.setAttribute("shape-rendering", "crispEdges");
      var bg = document.createElementNS(ns, "rect");
      bg.setAttribute("width", "100%"); bg.setAttribute("height", "100%"); bg.setAttribute("fill", "#fff");
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", d); path.setAttribute("fill", "#232B2C");
      svg.appendChild(bg); svg.appendChild(path);
      holder.replaceChildren(svg);
    }, function () { holder.replaceChildren(); });
  }

  function copyText(text, fallbackNode, btn, idleLabel, fb, okMsg) {
    function done(ok) {
      fb.textContent = ok ? okMsg : "Não deu para copiar automaticamente. Selecione o texto acima e copie.";
      if (ok) { btn.textContent = "Copiado!"; setTimeout(function () { btn.textContent = idleLabel; }, 2500); }
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      var range = document.createRange();
      range.selectNodeContents(fallbackNode);
      var sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      done(ok);
    }
  }

  // Botão de WhatsApp com a mensagem pronta para enviar o comprovante.
  function fillWhats(holder, amount) {
    if (!holder) return;
    holder.replaceChildren();
    if (whatsDigits) {
      var withCopy = copyMin && (!amount || amount >= copyMin);
      var msg = "Olá! Fiz um Pix" + (amount ? " de " + brl(amount) : "") + " para apoiar o ME. Segue o comprovante.\n" +
        "Nome e sobrenome para a lista de apoiadores (ou \"não quero aparecer\"): \n" +
        (withCopy ? "Endereço para envio da cópia" + (amount ? "" : " (se apoiei com " + brl(copyMin) + " ou mais)") + ": " : "");
      var a = el("a", { "class": "btn btn-primary btn-sm pix-whats", href: "https://wa.me/" + whatsDigits + "?text=" + encodeURIComponent(msg), target: "_blank", rel: "noopener" }, "Enviar comprovante pelo WhatsApp");
      a.appendChild(el("span", { "class": "visually-hidden" }, " (abre em nova aba)"));
      holder.appendChild(a);
    } else {
      holder.textContent = "Guarde o comprovante do Pix: o WhatsApp para enviá-lo será publicado nesta página.";
    }
  }

  function applyPix() {
    var box = $("[data-pix]");
    if (!box || !hasPix) return;
    var key = c.pixChave.trim();
    var keyNode = $("[data-pix-key]", box);
    keyNode.textContent = key;

    if (copyMin) {
      ["[data-pix-offer]", "[data-pix-term-copy]", "[data-pix-term-below]", "[data-pix-term-address]"].forEach(function (s) {
        $$(s, box).forEach(function (e) { e.hidden = false; });
      });
    }
    var whatsMain = $("[data-pix-whats-main]", box);
    fillWhats(whatsMain, null);

    var fb = $("[data-pix-feedback]", box);


    var keyBtn = $("[data-pix-copy]", box);
    keyBtn.addEventListener("click", function () {
      copyText(key, keyNode, keyBtn, "Copiar chave", fb, "Chave copiada. Agora é só colar no app do seu banco.");
    });

    // Valores pré-definidos
    var values = Array.isArray(c.pixValores) ? c.pixValores.filter(isNum) : [];
    values = values.filter(function (v, i) { return values.indexOf(v) === i; });
    if (!values.length) return;

    var name = isStr(c.pixNome) ? ascii(c.pixNome, 25) : "";
    var city = isStr(c.pixCidade) ? ascii(c.pixCidade, 15) : "";
    var canCode = name !== "" && city !== "";

    var grid = $("[data-pix-amount-grid]", box);
    var codeBox = $("[data-pix-code]", box), codeText = $("[data-pix-code-text]", box);
    var codeLabel = $("[data-pix-code-label]", box), codeBtn = $("[data-pix-code-copy]", box);
    var qrHolder = $("[data-pix-qr]", box), suggest = $("[data-pix-suggest]", box);
    var note = $("[data-pix-copy-note]", box);
    var current = "";

    if (canCode) $("[data-pix-key-label]", box).textContent = "Ou use a chave Pix e escolha outro valor";

    values.forEach(function (v) {
      var b = el("button", { type: "button", "class": "pix-amount", "aria-pressed": "false", "data-value": String(v) }, brl(v));
      var withCopy = copyMin && v >= copyMin;
      if (withCopy) { b.classList.add("pix-amount-copy"); b.appendChild(el("small", null, " + cópia do jogo")); }
      b.addEventListener("click", function () {
        $$(".pix-amount", grid).forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        fb.textContent = "";
        $("[data-pix-note-text]", note).replaceChildren(
          el("strong", null, brl(v) + ": "),
          document.createTextNode(withCopy ? "uma cópia do ME e seu nome na lista de apoiadores. Frete à parte." : "seu nome na lista de apoiadores deste site."));
        note.hidden = false;
        fillWhats(whatsMain, v);
        if (canCode) {
          current = pixPayload(key, v, name, city);
          codeText.textContent = current;
          codeLabel.textContent = "Pix copia e cola de " + brl(v);
          codeBtn.textContent = "Copiar código Pix";
          codeBox.hidden = false;
          drawQr(qrHolder, current, "QR Code do Pix de " + brl(v));
        } else {
          suggest.textContent = "Copie a chave abaixo e digite " + brl(v) + " no app do seu banco.";
          suggest.hidden = false;
        }
      });
      grid.appendChild(b);
    });
    codeBtn.addEventListener("click", function () {
      if (current) copyText(current, codeText, codeBtn, "Copiar código Pix", fb, "Código copiado. No app do banco, escolha Pix copia e cola e cole.");
    });
    $("[data-pix-amounts]", box).hidden = false;

    // O card "Cópia do ME" já deixa o valor mínimo selecionado.
    $$('[data-pix-select="copia"]').forEach(function (a) {
      a.addEventListener("click", function () {
        var target = copyMin && $('.pix-amount[data-value="' + copyMin + '"]', grid);
        if (target) target.click();
      });
    });
  }

  // ---------- Barra de meta ----------
  function applyProgress(state) {
    var hasGoal = isNum(c.metaReais), hasRaised = isNum(c.arrecadadoReais);
    $$("[data-progress]").forEach(function (box) {
      if (!hasGoal) { box.hidden = true; return; }
      var pct = hasRaised ? Math.floor((c.arrecadadoReais / c.metaReais) * 100) : 0;
      var bar = $("[role=progressbar]", box);
      bar.setAttribute("aria-valuenow", String(Math.min(pct, 100)));
      bar.setAttribute("aria-valuetext", hasRaised ? pct + "% da meta" : "Nenhum apoio registrado ainda");
      $("[data-progress-fill]", box).style.width = Math.min(pct, 100) + "%";

      var text = $("[data-progress-text]", box);
      if (hasRaised) {
        text.replaceChildren(el("strong", null, brl(c.arrecadadoReais)),
          document.createTextNode(" arrecadados de " + brl(c.metaReais) + " "),
          el("span", { "class": "progress-pct" }, "(" + pct + "%)"));
      } else {
        text.replaceChildren(document.createTextNode("Meta: "), el("strong", null, brl(c.metaReais)),
          document.createTextNode(" para produzir " + tiragem + " cópias." + (state === "encerrada" ? "" : " Seja a primeira pessoa a apoiar!")));
      }

      var backers = $("[data-progress-backers]", box);
      if (isNum(c.apoiadores)) {
        backers.textContent = int(c.apoiadores) + (c.apoiadores === 1 ? " apoiador" : " apoiadores");
        backers.hidden = false;
      } else backers.hidden = true;

      var upd = $("[data-progress-updated]", box);
      if (isStr(c.arrecadadoAtualizadoEm)) upd.textContent = "Atualizado em " + c.arrecadadoAtualizadoEm.trim() + ". O valor é atualizado manualmente conforme os Pix são confirmados.";
      box.hidden = false;
    });
  }

  // ---------- Lista de apoiadores ----------
  function applyBackers() {
    var list = $("[data-backers]"), empty = $("[data-backers-empty]");
    if (!list) return;
    var names = Array.isArray(c.listaApoiadores) ? c.listaApoiadores.filter(isStr) : [];
    if (!names.length) return;
    names.forEach(function (n) { list.appendChild(el("li", null, n.trim())); });
    list.hidden = false;
    if (empty) empty.hidden = true;
  }

  // ---------- Contagem regressiva ----------
  var timer = null;
  function applyCountdown(state) {
    var box = $("[data-countdown]");
    if (!box) return;
    if (timer) { clearInterval(timer); timer = null; }
    var target = state === "ativa" ? parseDate(c.dataFim) : null;
    if (!target) { box.hidden = true; return; }

    $("[data-countdown-label]", box).textContent = "A campanha termina em";
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

  function applyAll() {
    var state = getState(new Date());
    applyCtas(state);
    applyProgress(state);
    applyCountdown(state);
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
      var a = el("a", { "class": "btn btn-primary", "data-cta": "primary", href: "#pix" }, "Apoiar com Pix");
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
  applyBackers();
  applyAll();
  initDemo();
  initReveal();
})();
