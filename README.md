# ME · site da campanha

Site estático (HTML, CSS e JavaScript puros, sem build) que apresenta o jogo de tabuleiro **ME** e recebe os apoios da campanha de financiamento coletivo por Pix.

Endereço: **https://playme.app.br**

```
site/                    ← tudo que vai ao ar (e só isso)
  index.html             página única
  404.html
  CNAME  robots.txt  sitemap.xml
  assets/js/config.js    ← ÚNICO arquivo a editar para atualizar a campanha
  assets/js/main.js      lógica dos estados, barra de meta, Pix e demo
  assets/css/style.css
  assets/img/            personagens, caixa, peões, tabuleiro, og-me.png, favicon
  assets/fonts/          Montserrat (hospedada aqui, sem Google Fonts)
.github/workflows/pages.yml   publica somente /site
docs/                    material confidencial, ignorado pelo git (nunca publicar)
```

---

## Rodar localmente

```bash
python3 -m http.server 8000 --directory site --bind 127.0.0.1
```

Abra http://localhost:8000.

Rode o comando da raiz do repositório e não esqueça o `--directory site`. Sem ele, o servidor mostra uma lista de pastas em vez do site e expõe `docs/` e `.git/`. O `--bind 127.0.0.1` deixa o site acessível só no seu computador, e não para a rede Wi-Fi.

## Publicar no GitHub Pages

O site é publicado pelo **GitHub Actions**, a partir da pasta `/site`. Só o que está em `/site` vai ao ar: README, `.github` e principalmente `docs/` ficam de fora, mesmo que algo entre no repositório por engano. O workflow também falha de propósito se encontrar arquivos de `docs/` versionados ou links para `docs/` no site.

1. Faça o push do repositório para o GitHub (branch `main`).
2. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
   - Não escolha "Deploy from a branch" e **nunca** selecione a pasta `/docs`.
3. Ainda em **Settings → Pages → Custom domain**, digite `playme.app.br` e salve.
   - Com o deploy via Actions, o GitHub não lê o arquivo `site/CNAME`. O domínio vale pelo que estiver configurado nessa tela. O arquivo fica no repositório só como registro.
4. Quando o certificado for emitido (pode levar até 24 h depois do DNS propagar), marque **Enforce HTTPS**.

Cada push em `main` que altere `site/` publica de novo automaticamente. Para publicar manualmente: **Actions → Publicar site no GitHub Pages → Run workflow**.

## DNS no Registro.br

No Registro.br, abra o domínio `playme.app.br` → **DNS → Editar zona**. Se a opção não aparecer, ative antes "Utilizar os servidores DNS do Registro.br".

| Tipo | Nome | Valor |
|---|---|---|
| A | `playme.app.br` (raiz, deixe o nome em branco) | `185.199.108.153` |
| A | raiz | `185.199.109.153` |
| A | raiz | `185.199.110.153` |
| A | raiz | `185.199.111.153` |
| AAAA | raiz | `2606:50c0:8000::153` |
| AAAA | raiz | `2606:50c0:8001::153` |
| AAAA | raiz | `2606:50c0:8002::153` |
| AAAA | raiz | `2606:50c0:8003::153` |
| CNAME | `www` | `<usuario>.github.io` (troque `<usuario>` pelo seu usuário do GitHub) |

Esses IPs vêm da documentação oficial. Confira se continuam os mesmos antes de cadastrar: [Gerenciar um domínio personalizado para seu site do GitHub Pages](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

Para conferir a propagação:

```bash
dig playme.app.br +noall +answer
dig www.playme.app.br +noall +answer
```

## Verificar o domínio na conta do GitHub (evita sequestro de domínio)

Sem a verificação, outra conta do GitHub poderia apontar um site para o seu domínio se a configuração do Pages ficar vaga em algum momento.

1. No GitHub, clique na sua foto → **Settings → Pages** (configurações da **conta**, não do repositório).
2. **Add a domain** → `playme.app.br`.
3. O GitHub mostra um registro **TXT** parecido com `_github-pages-challenge-<usuario>.playme.app.br` e um valor. Cadastre esse TXT na zona do Registro.br.
4. Espere propagar e clique em **Verify**. Mantenha o registro TXT cadastrado.

Documentação: [Verificar seu domínio personalizado para o GitHub Pages](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

---

## A campanha (por Pix, direto com o criador)

Todos os dados ficam em **`site/assets/js/config.js`**. Campo desconhecido continua `null`, e o site esconde o que é `null`. Valores em reais são números sem "R$" e sem ponto (`25000`). Datas usam o formato `"2026-12-10T21:00:00-03:00"` (horário de Brasília).

A campanha não usa plataforma: os apoios são feitos por Pix, direto para você, e o site muda sozinho de estado pela data e hora de quem visita:

| Estado | Quando | O que o visitante vê |
|---|---|---|
| **Campanha ativa** (atual) | antes de `dataFim` | Botões "Apoiar com Pix", contagem até o fim, barra de meta, recompensas e o card do Pix. |
| **Encerrada** | depois de `dataFim` | Agradecimento, botão "Ver quem apoiou", resultado final da barra. O Pix some do site. |

### Regras que o site comunica

- **Qualquer valor:** o nome da pessoa (ou apelido) entra na lista de apoiadores do site, do jeito que ela pedir, ou nenhum, se preferir.
- **A partir de `pixValorCopia` (hoje R$ 500):** uma cópia do jogo e o nome na lista. O frete é cobrado à parte e combinado pelo WhatsApp.
- **Depois do Pix:** a pessoa envia o comprovante pelo WhatsApp (campo `whatsapp`), dizendo como quer aparecer e, se for o caso, o endereço de entrega. O botão do site abre a conversa com a mensagem pronta.
- **Se a meta não for atingida:** o jogo é produzido mesmo assim, com o valor arrecadado, e não há devolução por meta não atingida.

Esses são compromissos seus com quem apoia: guarde o registro de cada Pix, do nome pedido e do endereço de quem tem direito à cópia.

### Campos do Pix

- `pixChave`: chave que recebe os apoios. Com `null`, o Pix some do site.
- `pixValores`: valores sugeridos em botões (ex.: `[50, 100, 150, 200, 250, 500]`). Use `[]` para mostrar só a chave.
- `pixValorCopia`: valor mínimo que garante uma cópia do jogo.
- `pixNome` e `pixCidade`: **seu** nome e **sua** cidade (do recebedor), exigidos pelo padrão do Pix (BR Code). Com os dois preenchidos, cada botão gera um **Pix copia e cola** já com o valor e, em telas a partir de 720 px, um QR Code. Com algum deles `null`, o botão só sugere o valor e a pessoa digita a quantia no app do banco. Depois de preencher, faça um Pix de teste de valor baixo pelo app do banco.

O QR Code é gerado no próprio navegador pela biblioteca `assets/js/vendor/qrcode.js` (qrcode-generator, licença MIT), carregada só quando alguém escolhe um valor.

### Atualizar a barra de meta e a lista de apoiadores

Um site estático não tem como saber quando um Pix chega. A barra e a lista mudam quando você atualiza o `config.js`:

```js
arrecadadoReais: 8350,              // total confirmado, em reais
apoiadores: 37,                     // número de apoiadores
arrecadadoAtualizadoEm: "25/11/2026",
listaApoiadores: ["Ana Souza", "Bia", "Carlos M."],   // só quem autorizou
```

Depois, commit e push em `main`. O Actions publica em cerca de 1 minuto. Pelo próprio GitHub dá para editar no navegador: abra o arquivo, clique no lápis e depois em "Commit changes".

Enquanto `arrecadadoReais` for `null`, a barra aparece vazia com "Meta: R$ 25.000 para produzir 50 cópias. Seja a primeira pessoa a apoiar!". Acima de 100%, a barra fica cheia e o percentual real aparece no texto.

### Outros campos

- `dataFim`: fim da campanha (hoje 10/12/2026, 21h).
- `metaReais`: meta (hoje R$ 25.000).
- `previsaoEntrega`: aparece no FAQ "Quando recebo o jogo?".
- `whatsapp`, `instagram`, `email`: os links aparecem no rodapé e em "Quem fez".

## Outros pontos editáveis no HTML

Procure em `site/index.html` por:

- **`<!-- FOTO:`**: troque o personagem pela sua foto (salve em `site/assets/img/`, de preferência WebP, quadrada, com uns 480 px).
- **`<!-- BIO:`**: sua biografia em "Quem fez".
- **`id="depoimentos"`**: seção de relatos de playtests, oculta. Preencha com relatos reais e remova o atributo `hidden`.

Os elementos que dependem do `config.js` estão marcados com `data-config="nomeDoCampo"`.

## Privacidade (LGPD)

O site não usa cookies, analytics nem recursos de terceiros: as fontes estão hospedadas no próprio site. Se um dia quiser medir visitas, use uma ferramenta sem cookies (por exemplo Plausible ou GoatCounter) e atualize a nota do rodapé.

## Conteúdo confidencial

- `docs/` está no `.gitignore` e nunca deve ser versionado nem publicado.
- O site mostra só **8 perguntas de exemplo** (4 na demo e 4 nos cards de categoria), nenhuma da categoria Intimidade. Não acrescente outras.
- Não use nome, logo ou marca de empresas do Grupo Ludens (LudensLab, Ludens Spirit, Ludeka).
