# Casa da Tapada: site (instruções para o Claude)

Site estático (HTML, CSS e JavaScript simples) do alojamento local **Casa da Tapada**: moradia de turismo rural em Tapada, 6230-130 Atalaia do Campo, Fundão (Beira Baixa). Publicado no GitHub Pages: https://zezocacruz.github.io/Casa_Tapada_Novo/

O dono do projeto é o Rodrigo, estudante de engenharia. Fala-se em português de Portugal.

## Regras de trabalho

- Não retirar nada do site sem o Rodrigo pedir. Mudar só o que ele pede.
- Quando ele pedir ideias, explicar antes de fazer.
- Usar "Beira Baixa" (nunca "Beira Interior").
- O tom dos textos é respeitoso e caloroso, tratando o visitante por "você" ou com frases sem pronome.
- O email de contacto do site é `casadatapadaturismo@gmail.com`.

## Trabalhar em dois PCs (Git)

O Rodrigo trabalha em dois computadores e não usa o Git sozinho: é o Claude que faz o pull, o commit e o push.

- **No início de cada sessão, antes de mudar qualquer ficheiro:** correr `git fetch` e `git status`. Se o GitHub tiver alterações que este PC ainda não tem, avisar logo o Rodrigo e propor fazer `git pull` antes de começar.
- **Se houver alterações locais por enviar de uma sessão anterior,** avisar também e perguntar se é para fazer commit e push.
- **Quando o trabalho acabar,** lembrar o Rodrigo de fazer commit e push, para o outro PC e o site ficarem atualizados.

### Repositório e publicação

- Há **um só repositório**, `https://github.com/zezocacruz/Casa_Tapada_Novo` (ramo `main`), com o projeto todo: gerador, site, `CLAUDE.md` e `BASE_DO_PROJETO.md`.
- **O repositório é público** (o GitHub Pages grátis exige isso). Não guardar lá passwords, chaves nem dados pessoais que não estejam já no site.
- **Cada push para o `main` publica o site sozinho** através de `.github/workflows/publicar.yml`: corre o `gerar.py` e publica a pasta `codigo_git_NOVO`. Demora cerca de 1 minuto. Já não se copia nada à mão.
- Para ver se a publicação correu bem: separador **Actions** do repositório no GitHub.
- Ficam fora do Git (ver `.gitignore`): as fotos originais, os `.zip`, `codigo_git/`, `codigo_git_NOVO/fotos_git/`, o cartão A6 e o PDF do Livro de Reclamações. Para os ter nos dois PCs, usa-se uma cloud (OneDrive ou Google Drive).
- Os commits são feitos com o nome `zezocacruz` e o email privado do GitHub (`165302007+zezocacruz@users.noreply.github.com`), para o email pessoal não ficar público.
- Cada PC precisa do Git e do Python 3 instalados (`winget install Git.Git` e `winget install Python.Python.3.12`).

## Estrutura das pastas

- `gerador_site/`: **é aqui que se mudam os textos e a estrutura.**
  - `gerar.py` tem os modelos das páginas e os dados fixos: telefone, email, Airbnb, Booking (vazio por agora), Facebook, RNAL e as fotos que passam no topo (`HERO`).
  - `textos/pt.py`, `en.py`, `es.py` e `fr.py` têm todos os textos. As 4 línguas têm de ter sempre as mesmas chaves.
  - Para gerar o site: `python gerar.py`. Escreve as 24 páginas na pasta `codigo_git_NOVO`: o português na raiz e o inglês, o espanhol e o francês nas pastas `en/`, `es/` e `fr/`.
  - `fotos_base/`: as fotos do site em JPG, tal como chegaram (f1.jpg, f2.jpg, ..., logo.jpeg). **Não vão para o site diretamente.**
  - `otimizar_fotos.py`: cria as versões leves em `codigo_git_NOVO/fotos/` (`fNN.webp` até 1600 px, `fNN-800.webp` para telemóvel e cartões, `f71.jpg` para a partilha nas redes e `logo.jpeg` com 256 px) e escreve as medidas em `fotos.json`. Só se corre quando se muda ou acrescenta uma foto, e precisa do Pillow (`python -m pip install pillow`).
  - Para pôr uma foto nova: copiar o JPG para `fotos_base/`, correr `python otimizar_fotos.py`, usar o nome no `gerar.py` e correr `python gerar.py`. Nas páginas, as fotos entram com `c.img(...)`, que deixa o browser escolher a versão pequena ou a grande.
- `codigo_git_NOVO/`: o site pronto. **É esta pasta que o GitHub publica**, sozinho, a cada push (ver «Repositório e publicação»).
  - Os `.html` são gerados pelo `gerar.py` e não devem ser editados à mão, porque as alterações perdem-se na geração seguinte.
  - `style.css` e `main.js` são editados diretamente.
  - `fotos/` tem só as versões leves criadas pelo `otimizar_fotos.py`. Não se põem lá fotos à mão.
  - A pasta `fotos_git/` lá dentro é uma cópia antiga que o site não usa e não deve ir para o GitHub.
- `codigo_git/`: site antigo, guardado só para consulta. Não vai para o GitHub.
- `imagens/`, `Fotos_Tapada/` e `Fotos_Tapada.zip`: fotos originais. **Não apagar.** Não vão para o GitHub.
- `BASE_DO_PROJETO.md`: público-alvo, tom, cores e estrutura combinados no início.

## Design

- **Cores (variáveis no topo do `style.css`):** creme `#faf7f2`, areia `#f1ece3`, verde-sálvia `#6f7d5c`, dourado `#c2a26b`, texto `#3d3a35`, rodapé `#3f4a3c`.
  - Para **texto pequeno em dourado** (sobretítulos como "A CASA", etiquetas, datas) usa-se `--dourado-texto` (`#7f6232`), mais escuro, para se ler bem. O dourado claro fica para estrelas e enfeites.
- **Letra:** Cormorant Garamond nos títulos e Inter no texto.
- **Telemóvel (até 768px) com estrutura própria:**
  - menu ☰ em ecrã inteiro, com ícones e línguas;
  - barra fixa em baixo com Ligar, WhatsApp e Reservar;
  - cartões e galerias a deslizar;
  - setas e deslizar do dedo nas fotos do topo.

## Funcionalidades

- **Fotos do topo da página inicial:** trocam sozinhas de 6 em 6 segundos e também com setas ou com o dedo.
- **Cabeçalho no PC:** ícones do Facebook, Instagram e telefone, globo com a lista de línguas e o botão Reservar.
- **Página Reservar:**
  - no topo, duas caixas: "Diretamente connosco" (realçada, com o selo "Fica a ganhar": sem intermediários nem comissões) e "Pelo Airbnb";
  - calendário só para escolher datas. **Não mostra dias ocupados.** Por baixo está a frase "A disponibilidade da reserva será confirmada pelo proprietário.";
  - formulário que monta a mensagem para o WhatsApp ou para o email;
  - preço "sob consulta". **Não mostrar preços por noite.**
- **Avaliações:** aparecem na língua da página. A da Celine é original em francês e está traduzida nas outras línguas.
- **Barra de atalhos (A Casa, Região, Legal):** o atalho da secção onde a pessoa está fica realçado.
- **Página Legal:** RNAL 180494/AL, titular Leontino Costa Pinto, NIF 191 479 144, Livro de Reclamações, RGPD, cookies e resolução de litígios (CNIACC).

## Ainda pendente

- Link do Booking: preencher `BOOKING = ""` no `gerar.py` quando o anúncio estiver ativo. Até lá o Booking não aparece no site.
- Domínio próprio (por exemplo `casadatapada.pt`): o Rodrigo compra-o quando o site estiver acabado. Nessa altura, mudar o `URL_BASE` no `gerar.py` e ligar o domínio no GitHub Pages.
- Confirmar os nomes dos cafés e das lojas na página Região.
- Fotos dos locais da região (opcional). Só se podem usar fotos próprias ou com autorização.
