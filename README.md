# ME · site da campanha

Site estático (HTML, CSS e JavaScript puros, sem build) que apresenta o jogo de tabuleiro **ME** e recebe os apoios da campanha de financiamento coletivo por Pix.

Endereço: **https://playme.app.br**

```
index.html               página única (na raiz: o GitHub Pages publica a raiz da branch main)
404.html
robots.txt  sitemap.xml  .nojekyll
assets/js/config.js      ← ÚNICO arquivo a editar para atualizar a campanha
assets/js/main.js        lógica dos estados, barra de meta, Pix e demo
assets/css/style.css
assets/img/              personagens, caixa, peões, tabuleiro, capas dos vídeos, og-me.png, favicon
assets/video/            vídeos de apresentação (horizontal, vertical e vertical de 15 s)
assets/fonts/            Montserrat (hospedada aqui, sem Google Fonts)
.github/workflows/pages.yml   só verifica que nada confidencial foi versionado
docs/                    material confidencial, ignorado pelo git (nunca publicar)
```

---

## Rodar localmente

Na raiz do repositório:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra http://localhost:8000. O `--bind 127.0.0.1` é importante: como o servidor serve a raiz, ele também enxerga `docs/` e `.git/`, e assim fica acessível só no seu computador, não para a rede Wi-Fi.

## Publicar no GitHub Pages

O site é publicado direto da branch `main`, pasta raiz. Tudo o que estiver versionado na raiz vai ao ar. Por isso `docs/` fica no `.gitignore` e nunca deve ser versionado; o workflow `.github/workflows/pages.yml` falha se algum arquivo de `docs/` entrar no repositório.

1. No repositório: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
2. Escolha **Branch: `main`** e pasta **`/ (root)`**, e salve.
   - **Nunca** escolha a pasta `/docs`.
3. Em 1 ou 2 minutos o site aparece em https://tiberiodamaso.github.io/playme/.

Cada push em `main` publica de novo automaticamente.

O arquivo `.nojekyll` faz o GitHub servir os arquivos como estão, sem passar pelo Jekyll (que transformaria o README em página).

### Domínio playme.app.br (quando o DNS estiver pronto)

Não configure o domínio antes de cadastrar o DNS: o GitHub passaria a redirecionar para um endereço que ainda não abre.

1. Cadastre o DNS no Registro.br (abaixo) e espere propagar.
2. Em **Settings → Pages → Custom domain**, digite `playme.app.br` e salve. O GitHub cria sozinho o arquivo `CNAME` na raiz da branch (faça `git pull` depois).
3. Quando o certificado for emitido (pode levar até 24 h), marque **Enforce HTTPS**.

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

## A campanha (por Pix)

Todos os dados ficam em **`assets/js/config.js`**. Campo desconhecido continua `null`, e o site esconde o que é `null`. Valores em reais são números sem "R$" e sem ponto (`25000`). Datas usam o formato `"2026-12-10T21:00:00-03:00"` (horário de Brasília).

Os apoios são feitos por Pix, na chave do `config.js`, e o site muda sozinho de estado pela data e hora de quem visita:

| Estado | Quando | O que o visitante vê |
|---|---|---|
| **Campanha ativa** (atual) | `dataFim` é `null` (sem data para acabar) ou ainda não chegou | Botões "ME apoie", contagem até o fim (só se houver `dataFim`), barra de meta e o card do Pix (o que a pessoa recebe e os 3 passos para apoiar). |
| **Encerrada** | depois de `dataFim` | Agradecimento, botão "Ver quem apoiou", resultado final da barra. O Pix some do site. |

### Regras que o site comunica

- **Qualquer valor:** o nome da pessoa entra na lista de apoiadores do site, como nome e sobrenome ou primeiro nome com a inicial do sobrenome (ex.: "Ana S."), ou ela pode não aparecer. Apelidos, frases, nomes de empresas, links e conteúdo ofensivo não são publicados; revise cada nome antes de incluir.
- **A partir de `pixValorCopia` (hoje R$ 350):** uma cópia do jogo e o nome na lista. O frete é cobrado à parte e combinado por e-mail.
- **Depois do Pix:** a pessoa envia o comprovante por e-mail (campo `email`), com nome e sobrenome para a lista e, se o apoio dá direito a cópia, o nome completo de quem vai receber e o endereço completo com CEP, para o cálculo do frete e o envio. O botão do site abre o app de e-mail com assunto e mensagem prontos, já com os campos do endereço quando o valor dá direito a cópia; a pessoa só precisa preencher e anexar o comprovante.
- **Se a meta não for atingida:** todo o valor arrecadado é usado integralmente na produção do jogo. Não há devolução por meta não atingida.
- **Direito de arrependimento:** quem apoia com `pixValorCopia` ou mais (com direito a cópia) pode desistir em até 7 dias, contados do apoio ou do recebimento do jogo, e receber o valor de volta (art. 49 do CDC). O pedido chega pelo `email`. Apoios abaixo desse valor não são devolvidos.

Esses são compromissos assumidos com quem apoia: guarde o registro de cada Pix, do nome pedido e do endereço de quem tem direito à cópia.

### Campos do Pix

- `pixChave`: chave que recebe os apoios (hoje o CNPJ 50.102.013/0001-40). CNPJ ou CPF podem ter pontuação: o site mostra assim, mas copia e gera o código só com os números. Com `null`, o Pix some do site.
- `pixValores`: valores sugeridos em botões (ex.: `[50, 100, 150, 200, 350, 500]`). Use `[]` para mostrar só a chave.
- `pixValorCopia`: valor mínimo que garante uma cópia do jogo.
- `pixNome` e `pixCidade`: nome e cidade do recebedor (com chave CNPJ, a razão social e a cidade da empresa), exigidos pelo padrão do Pix (BR Code). Com os dois preenchidos, cada botão gera um **Pix copia e cola** já com o valor e, em telas a partir de 720 px, um QR Code. Com algum deles `null`, o botão só sugere o valor e a pessoa digita a quantia no app do banco. Depois de preencher, faça um Pix de teste de valor baixo pelo app do banco.

O QR Code é gerado no próprio navegador pela biblioteca `assets/js/vendor/qrcode.js` (qrcode-generator, licença MIT), carregada só quando alguém escolhe um valor.

### Atualizar a barra de meta e a lista de apoiadores

Um site estático não tem como saber quando um Pix chega. A barra e a lista mudam quando você atualiza o `config.js`:

```js
arrecadadoReais: 8350,              // total confirmado, em reais
apoiadores: 37,                     // número de apoiadores
arrecadadoAtualizadoEm: "25/11/2026",
listaApoiadores: ["Ana Souza", "Bia", "Carlos M."],   // só quem autorizou
```

Depois, commit e push em `main`. O GitHub Pages publica em 1 ou 2 minutos. Pelo próprio GitHub dá para editar no navegador: abra o arquivo, clique no lápis e depois em "Commit changes".

Enquanto `arrecadadoReais` for `null`, a barra aparece vazia com "Meta: R$ 25.000 para produzir 100 cópias. Seja a primeira pessoa a apoiar!". Acima de 100%, a barra fica cheia e o percentual real aparece no texto.

### Seção "Compartilhe"

Mensagens prontas para os visitantes espalharem o site, em duas versões ("Já apoiei" e "Ainda não apoiei"), com botões para WhatsApp, Telegram, Facebook, X, o menu de compartilhar do celular, "Copiar mensagem" e "Copiar link". São só links: nenhum script de terceiros é carregado. A seção some quando a campanha termina.

O link enviado é sempre o de `urlCompartilhar` no `config.js` (hoje `"https://playme.app.br/"`), mesmo com o site aberto no GitHub Pages ou no seu computador. Por isso o domínio precisa estar abrindo o site (DNS e **Settings → Pages**, acima) antes de divulgar: até lá, os links compartilhados não abrem. Com `null`, o site usa o endereço em que estiver aberto.

### Vídeo

A seção logo depois da abertura mostra o vídeo de apresentação: o horizontal (`ME_Redes_16x9.mp4`) em telas a partir de 720 px e o vertical (`ME_Redes_9x16.mp4`) no celular. Os vídeos só são baixados quando a pessoa dá o play; até lá aparecem as capas `assets/img/video-16x9.webp` e `video-9x16.webp`.

Abaixo do vídeo, o bloco "Ajude a espalhar o ME" tem o botão do WhatsApp com mensagem pronta e "Copiar link do vídeo". O link leva à página já na seção do vídeo (por exemplo `https://playme.app.br/#video`), com a campanha logo abaixo. Também há links para baixar os três arquivos, incluindo o vertical de 15 s, para quem quiser postar nos stories, no status ou no feed.

Se trocar um vídeo, mantenha o mesmo nome de arquivo, atualize a capa correspondente e o texto em "Ler o texto do vídeo" no `index.html`. O GitHub recusa arquivos acima de 100 MB; os atuais têm de 1 a 4 MB.

### Outros campos

- `dataFim`: fim da campanha. Hoje é `null`: a campanha não tem data para acabar.
- `metaReais`: meta (hoje R$ 25.000).
- `previsaoEntrega`: hoje "segundo semestre de 2027". Aparece no FAQ "Quando recebo o jogo?", sempre como estimativa que depende da velocidade para atingir a meta e com o aviso de que as atualizações vão por e-mail para quem apoiou, e no nível da cópia no card do Pix.
- `email`, `instagram`: os links aparecem no rodapé e no FAQ. O `email` também recebe os comprovantes.

## Outros pontos editáveis no HTML

Procure em `index.html` por:

- **`<!-- FOTO:`**: troque o personagem pela sua foto (salve em `assets/img/`, de preferência WebP, quadrada, com uns 480 px).
- **`<!-- BIO:`**: sua biografia em "Quem fez".
- **`id="depoimentos"`**: seção de relatos de playtests, oculta. Preencha com relatos reais e remova o atributo `hidden`.

Os elementos que dependem do `config.js` estão marcados com `data-config="nomeDoCampo"`.

## Privacidade (LGPD)

O site não usa cookies, analytics nem recursos de terceiros: as fontes estão hospedadas no próprio site. Se um dia quiser medir visitas, use uma ferramenta sem cookies (por exemplo Plausible ou GoatCounter) e atualize a nota do rodapé.

## Conteúdo confidencial

- `docs/` está no `.gitignore` e nunca deve ser versionado nem publicado.
- O site mostra só **8 perguntas de exemplo** (4 na demo e 4 nos cards de categoria), nenhuma da categoria Intimidade. Não acrescente outras.
- Não use nome, logo ou marca de empresas do Grupo Ludens (LudensLab, Ludens Spirit, Ludeka).
