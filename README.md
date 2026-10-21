# ME · site da campanha

Site estático (HTML, CSS e JavaScript puros, sem build) que apresenta o jogo de tabuleiro **ME** e leva visitantes à campanha de financiamento coletivo na MeepleStarter.

Endereço: **https://playme.app.br**

```
site/                    ← tudo que vai ao ar (e só isso)
  index.html             página única
  404.html
  CNAME  robots.txt  sitemap.xml
  assets/js/config.js    ← ÚNICO arquivo a editar para atualizar a campanha
  assets/js/main.js      lógica dos estados, demo e recompensas
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

## Quando a campanha for definida (checklist)

Todos os dados ficam em **`site/assets/js/config.js`**. Campo desconhecido continua `null`, e o site esconde o que é `null`. Valores em reais são números sem "R$" e sem ponto (`15000`). Datas usam o formato `"2027-03-01T10:00:00-03:00"` (horário de Brasília).

O site calcula o estado sozinho, pela data e hora de quem visita:

| Estado | Quando | O que o visitante vê |
|---|---|---|
| **Em breve** (atual) | `dataInicio` é `null` | Botão "Em breve na MeepleStarter", que rola até "Como apoiar". Com `instagram` preenchido, aparece também "Siga para ser avisado(a) do lançamento". Sem contagem, sem valores, recompensas em modo "em breve". |
| **Lançamento agendado** | `dataInicio` no futuro | Contagem regressiva até o início e botão "Ver a campanha na MeepleStarter" apontando para `campanhaUrl`. |
| **Campanha ativa** | entre `dataInicio` e `dataFim` | Botão "Apoiar agora", contagem até o fim, barra de progresso, número de apoiadores e botões nas recompensas. |
| **Encerrada** | depois de `dataFim` | Agradecimento, link para a campanha e resultado final. |

Ordem sugerida:

1. **Contato e redes** (pode ser já): `instagram`, `whatsapp`, `email`. Os links aparecem no rodapé e em "Quem fez". No estado "Em breve", o Instagram vira a ação "Siga para ser avisado(a)".
2. **Página da campanha criada na MeepleStarter**: `campanhaUrl`.
3. **Recompensas definidas**: `recompensas` (os cards são gerados sozinhos; marque `destaque: true` em um só nível) e `metaReais` (o painel passa a mostrar "R$ X para produzir 50 cópias").
4. **Prazo de entrega definido**: `previsaoEntrega` (aparece no FAQ "Quando recebo o jogo?").
5. **Data de lançamento marcada**: `dataInicio` e `dataFim`. O site passa para **Lançamento agendado** e, na hora marcada, para **Campanha ativa** sozinho, sem novo deploy.
6. **Durante a campanha**: atualize `arrecadadoReais` e `apoiadores` (veja abaixo).
7. **Depois do fim**: o site passa para **Encerrada** sozinho. Faça uma última atualização de `arrecadadoReais` e `apoiadores` com os números finais.

Para testar antes de publicar, rode o site localmente com `python3 -m http.server` e abra no navegador.

### Atualizar `arrecadadoReais` e `apoiadores` durante a campanha

1. Copie os números da página da campanha na MeepleStarter.
2. Edite `site/assets/js/config.js`, por exemplo:
   ```js
   arrecadadoReais: 8350,
   apoiadores: 37,
   ```
3. Faça commit e push em `main`. O Actions publica em cerca de 1 minuto. Pelo próprio GitHub dá para editar no navegador: abra o arquivo, clique no lápis e depois em "Commit changes".

A barra de progresso só aparece com campanha ativa ou encerrada e com `metaReais` e `arrecadadoReais` preenchidos e maiores que zero. Os números não se atualizam sozinhos: o site mostra exatamente o que estiver no `config.js`.

---

### Contribuição direta por Pix

O campo `pixChave` do `config.js` mostra, em "Como apoiar" e no FAQ, a opção de contribuir por Pix direto ao criador. Com `null`, a opção some do site. A opção aparece em todos os estados da campanha, e o site informa que:

- é uma contribuição voluntária, sem recompensa nem cópia do jogo;
- não conta para a meta na MeepleStarter;
- é devolvida integralmente para a conta de origem se a meta não for atingida.

Esse último item é um compromisso seu com quem contribuir: guarde o registro dos Pix recebidos para conseguir devolver.

**Não coloque a chave Pix na página da campanha na MeepleStarter.** Os Termos de Uso Gerais da plataforma (seção 5) proíbem publicar lá dados de conta bancária e "links para pagamentos externos". No seu próprio site isso é permitido.

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
- Não use nome, logo ou marca de empresas do Grupo Ludens (LudensLab, Ludens Spirit, Ludeka). A MeepleStarter pode ser citada e linkada como plataforma da campanha.
