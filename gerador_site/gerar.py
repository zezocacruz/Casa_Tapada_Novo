# -*- coding: utf-8 -*-
"""
Gerador do site da Casa da Tapada.

Os TEXTOS estão em textos/pt.py, textos/en.py, textos/es.py e textos/fr.py.
Este ficheiro tem os MODELOS das páginas (a estrutura HTML).

Para atualizar o site:
    1. Mudar o texto no ficheiro da língua certa (ex.: textos/pt.py).
    2. Correr:  python gerar.py
    3. As páginas são escritas na pasta ../codigo_git_NOVO
       (português na raiz; inglês em /en, espanhol em /es, francês em /fr).
"""
import os, sys, importlib, json
from urllib.parse import quote

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.abspath(os.path.join(AQUI, "..", "codigo_git_NOVO"))
sys.path.insert(0, os.path.join(AQUI, "textos"))

LINGUAS = ["pt", "en", "es", "fr"]

# Medidas das fotos (largura, altura da versão grande), escritas pelo otimizar_fotos.py
with open(os.path.join(AQUI, "fotos.json"), encoding="utf-8") as _fh:
    MEDIDAS = json.load(_fh)

# Largura com que as fotos aparecem no ecrã (o browser escolhe a versão pequena ou a grande)
ECRA_INTEIRO = "100vw"
TAM_CARTAO = "(max-width: 768px) 75vw, 25vw"
TAM_GALERIA = "(max-width: 768px) 75vw, 22vw"
TAM_METADE = "(max-width: 768px) 90vw, 45vw"
PAGINAS = ["index.html", "casa.html", "regiao.html", "historia.html", "reservar.html", "legal.html"]

# ---------------------------------------------------------------- dados fixos
TEL = "+351927539498"
TEL_VISIVEL = "+351 927 539 498"
EMAIL = "casadatapadaturismo@gmail.com"
EMAIL_RECLAMACOES = "casadatapadaturismo@gmail.com"
INSTAGRAM = "https://www.instagram.com/casadatapadaturismo/"
AIRBNB = "https://www.airbnb.pt/rooms/1791404531724363427"
# Perfil "Casa da Tapada Turismo Rural" no Google Maps (avaliações públicas)
GOOGLE_AVALIACOES = "https://maps.google.com/?cid=9964221634762812004"
# Mudar para True quando o anúncio do Airbnb já tiver avaliações:
# volta a aparecer o botão "Airbnb" junto às avaliações da página inicial.
AIRBNB_TEM_AVALIACOES = False
BOOKING = ""      # pôr aqui o link quando o anúncio estiver ativo
FACEBOOK = "https://www.facebook.com/share/1MHd3AVH89/"     # pôr aqui o link do Facebook
MORADA_MAPA = "Tapada, 6230-130 Atalaia do Campo, Fundão, Portugal"
RNAL = "180494/AL"


def wa(msg):
    return "https://wa.me/351927539498?text=" + quote(msg, safe="")

def mapa_link(q):
    return "https://www.google.com/maps/search/?api=1&query=" + quote(q, safe="")

SVG_TEL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"/></svg>'
SVG_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.12-1.47-.72-1.7-.8s-.39-.12-.56.12-.64.8-.78.97-.29.18-.54.06a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.71-1.33a.45.45 0 0 0-.02-.42c-.06-.12-.56-1.34-.76-1.84s-.4-.42-.56-.43h-.48a.92.92 0 0 0-.67.31 2.8 2.8 0 0 0-.87 2.08 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.69 2.23.75 3.03.63a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .15-1.2c-.06-.11-.23-.17-.48-.29z"/></svg>'

# Fotos de cada divisão (as legendas/alt estão nos ficheiros de texto)
DIVISOES_FOTOS = {
    "quartos": ["f38", "f75", "f76", "f59", "f77"],
    "sala": ["f8", "f1", "f7"],
    "cozinha": ["f5", "f6", "f3", "f4"],
    "casa-de-banho": ["f13", "f14", "f15"],
    "piscina": ["f71", "f72", "f73", "f70"],
    "exterior": ["f51", "f54", "f50", "f22", "f20", "f62", "f65", "f44", "f25"],
}

# ---------------------------------------------------------------- utilitários
def esc_attr(s):
    return s.replace('"', "&quot;")

def falta(texto="Falta"):
    return f'<span class="falta">{texto}</span>'

class Pag:
    """Contexto de uma página: língua, prefixo para fotos/css, textos."""
    def __init__(self, lingua, pagina):
        self.l = lingua
        self.p = pagina
        self.T = importlib.import_module(lingua).T
        self.raiz = "" if lingua == "pt" else "../"

    def foto(self, f, pequena=False):
        """Caminho da foto. As fotos são WebP criadas pelo otimizar_fotos.py."""
        if f == "logo":
            return f"{self.raiz}fotos/logo.jpeg"
        if f not in MEDIDAS:
            sys.exit(f"Falta a foto {f}: põe-na em gerador_site/fotos_base/ e corre python otimizar_fotos.py")
        return f"{self.raiz}fotos/{f}{'-800' if pequena else ''}.webp"

    def srcset(self, f):
        """As duas versões da foto, para o browser escolher a mais leve que chega."""
        return f"{self.foto(f, True)} 800w, {self.foto(f)} {MEDIDAS[f][0]}w"

    def img(self, f, sizes, alt=None, extra='loading="lazy"'):
        """<img> com versão pequena (telemóvel, cartões) e grande (PC, ampliação).
        sizes = largura com que a foto aparece no ecrã, para o browser escolher."""
        alt = self.alt(f) if alt is None else alt
        return f'<img src="{self.foto(f)}" srcset="{self.srcset(f)}" sizes="{sizes}" alt="{alt}" {extra}'.rstrip() + ">"

    def alt(self, f):
        return esc_attr(self.T["alts"].get(f, ""))

    def link_lingua(self, outra):
        if outra == self.l:
            return self.p
        if self.l == "pt":
            return f"{outra}/{self.p}"
        if outra == "pt":
            return f"../{self.p}"
        return f"../{outra}/{self.p}"

URL_BASE = "https://zezocacruz.github.io/Casa_Tapada_Novo/"

def head(c, chave):
    T = c.T
    titulo, desc = T["meta"][chave]
    alternates = "\n".join(
        f'    <link rel="alternate" hreflang="{l}" href="{URL_BASE}{"" if l == "pt" else l + "/"}{c.p}">' for l in LINGUAS)
    return f'''<!DOCTYPE html>
<html lang="{T["html_lang"]}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{titulo}</title>
    <meta name="description" content="{esc_attr(desc)}">
    <meta name="theme-color" content="#6f7d5c">
    <meta property="og:title" content="{esc_attr(titulo)}">
    <meta property="og:description" content="{esc_attr(desc)}">
    <meta property="og:image" content="{URL_BASE}fotos/f71.jpg">
    <meta property="og:locale" content="{T["og_locale"]}">
{alternates}
    <link rel="alternate" hreflang="x-default" href="{URL_BASE}{c.p}">
    <link rel="icon" href="{c.foto("logo")}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{c.raiz}style.css">
</head>
<body>
'''

NOMES_LINGUAS = {"pt": "Português", "en": "English", "es": "Español", "fr": "Français"}

ICONE_FACEBOOK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>'
ICONE_INSTAGRAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'
ICONE_TELEFONE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
ICONE_GLOBO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'

def topo(c):
    T = c.T
    itens = [("index.html", T["nav"]["inicio"]), ("casa.html", T["nav"]["casa"]),
             ("regiao.html", T["nav"]["regiao"]), ("historia.html", T["nav"]["historia"])]
    ativo = ' class="ativo"'
    links = "\n".join(f'            <a href="{h}"{ativo if h == c.p else ""}>{t}</a>' for h, t in itens)
    res_cls = "menu-reservar ativo" if c.p == "reservar.html" else "menu-reservar"
    linguas = []
    for l in LINGUAS:
        extra = ' class="ativo" aria-current="true"' if l == c.l else ""
        linguas.append(f'                    <a href="{c.link_lingua(l)}" lang="{l}" hreflang="{l}"{extra}>{NOMES_LINGUAS[l]}</a>')
    linguas = "\n".join(linguas)
    facebook = (f'\n                <a href="{FACEBOOK}" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook">{ICONE_FACEBOOK}</a>'
                if FACEBOOK else "")
    return f'''
    <!-- ===== CABEÇALHO ===== -->
    <header class="topo" id="topo">
        <a href="index.html" class="topo-logo" aria-label="Casa da Tapada">
            <img src="{c.foto("logo")}" alt="Casa da Tapada">
        </a>
        <nav class="menu" id="menu" aria-label="{T["nav"]["aria_menu"]}">
{links}
            <div class="menu-icones">{facebook}
                <a href="{INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">{ICONE_INSTAGRAM}</a>
                <a href="tel:{TEL}" aria-label="{T["nav"]["ligar"]} {TEL_VISIVEL}" title="{TEL_VISIVEL}">{ICONE_TELEFONE}</a>
            </div>
            <div class="linguas">
                <button type="button" class="linguas-botao" aria-expanded="false" aria-label="{T["nav"]["aria_linguas"]}">{ICONE_GLOBO}<span>{c.l.upper()}</span></button>
                <div class="linguas-lista">
{linguas}
                </div>
            </div>
            <a href="reservar.html" class="{res_cls}">{T["nav"]["reservar"]}</a>
        </nav>
        <button class="menu-botao" id="menuBotao" aria-label="{T["nav"]["abrir"]}" data-abrir="{T["nav"]["abrir"]}" data-fechar="{T["nav"]["fechar"]}" aria-expanded="false" aria-controls="menu">
            <span></span><span></span><span></span>
        </button>
    </header>
'''

def rodape(c):
    T = c.T
    R = T["rodape"]
    fb = f'<a href="{FACEBOOK}" target="_blank" rel="noopener">Facebook</a>' if FACEBOOK else f'<span>Facebook {falta()}</span>'
    return f'''
    <!-- ===== RODAPÉ ===== -->
    <footer class="rodape">
        <div class="rodape-grelha">
            <div>
                <img src="{c.foto("logo")}" alt="Casa da Tapada" class="rodape-logo">
                <p>{R["frase"]}</p>
                <p class="rodape-morada">Tapada, 6230-130 Atalaia do Campo<br>Fundão, Portugal</p>
            </div>
            <div>
                <h3>{R["navegar"]}</h3>
                <a href="casa.html">{T["nav"]["casa"]}</a>
                <a href="regiao.html">{T["nav"]["regiao"]}</a>
                <a href="historia.html">{T["nav"]["historia"]}</a>
                <a href="reservar.html">{T["nav"]["reservar"]}</a>
            </div>
            <div>
                <h3>{R["contactos"]}</h3>
                <a href="tel:{TEL}">{TEL_VISIVEL}</a>
                <a href="mailto:{EMAIL}">{EMAIL}</a>
                <a href="{INSTAGRAM}" target="_blank" rel="noopener">Instagram</a>
                <a href="{AIRBNB}" target="_blank" rel="noopener">Airbnb</a>
                {fb}
            </div>
        </div>
        <div class="rodape-legal">
            <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener" class="btn-reclamacoes">{R["livro"]}</a>
            <p>{R["registo"]} {RNAL} · {R["reclamacoes_email"]} <a href="mailto:{EMAIL_RECLAMACOES}">{EMAIL_RECLAMACOES}</a></p>
            <p><a href="legal.html#termos">{R["termos"]}</a> · <a href="legal.html#privacidade">{R["privacidade"]}</a> · <a href="legal.html#cookies">{R["cookies"]}</a> · <a href="legal.html#litigios">{R["litigios"]}</a> · <a href="legal.html#identificacao">{R["identificacao"]}</a></p>
            <p>© <span id="ano">2026</span> Casa da Tapada</p>
        </div>
    </footer>

    <!-- ===== BARRA FIXA (só telemóvel) ===== -->
    <nav class="barra-movel" aria-label="{R["aria_barra"]}">
        <a href="tel:{TEL}">
            {SVG_TEL}
            {T["nav"]["ligar"]}
        </a>
        <a href="{wa(T["wa_info"])}" target="_blank" rel="noopener">
            {SVG_WA}
            WhatsApp
        </a>
        <a href="reservar.html" class="barra-reservar">{T["nav"]["reservar"]}</a>
    </nav>

    <script src="{c.raiz}main.js"></script>
</body>
</html>
'''

def pagina_topo(c, d, foto):
    return f'''
        <section class="pagina-topo">
            {c.img(foto, ECRA_INTEIRO, alt="", extra='class="pagina-topo-img"')}
            <div class="pagina-topo-conteudo">
                <p class="sobretitulo">{d["sobre"]}</p>
                <h1>{d["titulo"]}</h1>
                <p>{d["texto"]}</p>
            </div>
        </section>
'''

def cab(sobre, titulo, texto=""):
    t = f'\n                <p class="cabecalho-texto">{texto}</p>' if texto else ""
    s = f'\n                <p class="sobretitulo">{sobre}</p>' if sobre else ""
    return f'''            <div class="cabecalho-seccao">{s}
                <h2>{titulo}</h2>{t}
            </div>
'''

def faixa(d):
    return f'''
        <section class="faixa-reservar">
            <h2>{d["titulo"]}</h2>
            <p>{d["texto"]}</p>
            <a href="reservar.html" class="btn btn-claro">{d["botao"]}</a>
        </section>
'''

def plataformas(c):
    T = c.T
    # O Booking só aparece quando houver link (BOOKING preenchido lá em cima)
    booking = (f'\n                    <a class="plataforma" href="{BOOKING}" target="_blank" rel="noopener">Booking.com</a>' if BOOKING else "")
    # O Airbnb só aparece aqui quando o anúncio tiver avaliações (AIRBNB_TEM_AVALIACOES lá em cima)
    airbnb = (f'\n                    <a class="plataforma" href="{AIRBNB}" target="_blank" rel="noopener">Airbnb ↗</a>' if AIRBNB_TEM_AVALIACOES else "")
    return f'''                <div class="plataformas">
                    <a class="plataforma" href="{GOOGLE_AVALIACOES}" target="_blank" rel="noopener"><b>★★★★★</b> {T["index"]["aval_google"]} ↗</a>{airbnb}{booking}
                </div>
'''

# ================================================================ PÁGINAS
# Fotos que vão trocando no topo da página inicial:
# (foto no PC, foto no telemóvel, ligação)
HERO = [
    ("f71", "f72", "casa.html#piscina", "piscina"),
    ("f51", "f51", "casa.html#exterior", "exterior"),
    ("f38", "f38", "casa.html#quartos", "quartos"),
    ("f28", "f28", "regiao.html", "regiao"),
]

def hero_lista(c):
    titulos = {i: t for i, t, _ in c.T["casa"]["divisoes"]}
    titulos["regiao"] = c.T["nav"]["regiao"]
    return [(pc, mov, titulos[k], link) for pc, mov, link, k in HERO]

def hero_slides(c):
    out = []
    for n, (pc, mov, rotulo, link) in enumerate(hero_lista(c)):
        carregar = 'fetchpriority="high"' if n == 0 else 'loading="lazy"'
        out.append(f'''            <picture class="hero-slide{" ativo" if n == 0 else ""}" data-rotulo="{rotulo}" data-link="{link}">
                <source media="(max-width: 768px)" srcset="{c.srcset(mov)}" sizes="{ECRA_INTEIRO}">
                {c.img(pc, ECRA_INTEIRO, extra=carregar)}
            </picture>''')
    return "\n".join(out)

def p_index(c):
    T = c.T; I = T["index"]
    destaques = "\n".join(f'            <div class="destaque"><strong>{a}</strong><span>{b}</span></div>' for a, b in I["destaques"])
    cartoes = "\n".join(
        f'''                <a href="casa.html#{anc}" class="cartao-foto">
                    {c.img(f, TAM_CARTAO)}
                    <span>{nome}</span>
                </a>''' for anc, f, nome in I["casa_cartoes"])
    momentos = "\n".join(
        f'''                <article class="momento">
                    {c.img(f, TAM_CARTAO)}
                    <h3>{h}</h3>
                    <p>{p}</p>
                </article>''' for f, h, p in I["momentos"])
    aval = "\n".join(
        f'''                    <blockquote class="avaliacao">
                        <p>"{t}"</p>
                        <cite>{n}</cite>
                    </blockquote>''' for t, n in I["avaliacoes"])
    nota_aval = f'\n                <p class="nota">{I["aval_nota"]}</p>' if I.get("aval_nota") else ""
    reg = "\n".join(
        f'''                <a href="regiao.html#{a}" class="regiao-cartao">
                    <h3>{h}</h3>
                    <p>{p}</p>
                </a>''' for a, h, p in I["reg_cartoes"])
    faq = "\n".join(f'''                <details>
                    <summary>{q}</summary>
                    <p>{a.replace("{AIRBNB}", AIRBNB)}</p>
                </details>''' for q, a in I["faq"])
    lang = c.l
    return f'''
        <!-- ===== 1. ENTRADA ===== -->
        <section class="hero" data-hero>
{hero_slides(c)}
            <button type="button" class="hero-seta hero-ant" aria-label="{T["anterior"]}">&#8249;</button>
            <button type="button" class="hero-seta hero-seg" aria-label="{T["seguinte"]}">&#8250;</button>
            <div class="hero-conteudo">
                <p class="hero-local">Atalaia do Campo · Fundão</p>
                <h1>Casa da Tapada</h1>
                <p class="hero-frase">{I["hero_frase"]}</p>
                <div class="hero-botoes">
                    <a href="reservar.html" class="btn btn-claro">{T["nav"]["reservar"]}</a>
                    <a href="casa.html" class="btn btn-contorno">{I["btn_conhecer"]}</a>
                </div>
            </div>
        </section>

        <!-- ===== 2. BOAS-VINDAS ===== -->
        <section class="seccao boas-vindas">
            <div class="boas-vindas-texto">
                <p class="sobretitulo">{I["bv_sobre"]}</p>
                <h2>{I["bv_titulo"]}</h2>
                <p>{I["bv_p1"]}</p>
                <p>{I["bv_p2"]}</p>
                <a href="historia.html" class="link-seta">{I["bv_link"]}</a>
            </div>
            <div class="boas-vindas-fotos">
                {c.img("f44", "(max-width: 768px) 45vw, 22vw")}
                {c.img("f8", "(max-width: 768px) 45vw, 22vw")}
            </div>
        </section>

        <!-- ===== 3. DESTAQUES ===== -->
        <section class="destaques" aria-label="{I["destaques_aria"]}">
{destaques}
        </section>

        <!-- ===== 4. A CASA ===== -->
        <section class="seccao">
{cab(I["casa_sobre"], I["casa_titulo"])}            <div class="deslizar" data-deslizar>
{cartoes}
            </div>
            <div class="centrado"><a href="casa.html" class="btn btn-principal">{I["btn_ver_casa"]}</a></div>
        </section>

        <!-- ===== 5. MOMENTOS ===== -->
        <section class="seccao seccao-areia">
{cab(I["mom_sobre"], I["mom_titulo"])}            <div class="deslizar" data-deslizar>
{momentos}
            </div>
        </section>

        <!-- ===== 6. AVALIAÇÕES ===== -->
        <section class="seccao">
            <div class="cabecalho-seccao">
                <p class="sobretitulo">{I["aval_sobre"]}</p>
                <h2>{I["aval_titulo"]}</h2>
{plataformas(c)}            </div>
            <div class="carrossel">
                <button class="carrossel-seta" data-dir="-1" aria-label="{T["anterior"]}">&#8249;</button>
                <div class="deslizar deslizar-avaliacoes" data-deslizar>
{aval}
                </div>
                <button class="carrossel-seta" data-dir="1" aria-label="{T["seguinte"]}">&#8250;</button>
            </div>{nota_aval}
        </section>

        <!-- ===== 7. RESERVAR DIRETAMENTE ===== -->
        <section class="reserva-direta">
            {c.img("f73", ECRA_INTEIRO, alt="", extra='class="reserva-direta-fundo" loading="lazy"')}
            <div class="reserva-direta-caixa">
                <p class="sobretitulo">{I["rd_sobre"]}</p>
                <h2>{I["rd_titulo"]}</h2>
                <p>{I["rd_texto"]}</p>
                <div class="hero-botoes">
                    <a href="{wa(T["wa_info"])}" class="btn btn-principal" target="_blank" rel="noopener">WhatsApp</a>
                    <a href="mailto:{EMAIL}?subject={quote(T["email_assunto"])}" class="btn btn-contorno-escuro">Email</a>
                </div>
                <div class="rd-airbnb">
                    <p>{I["rd_airbnb"]}</p>
                    <a href="{AIRBNB}" class="btn btn-airbnb" target="_blank" rel="noopener">{T["btn_airbnb"]} ↗</a>
                </div>
            </div>
        </section>

        <!-- ===== 8. REGIÃO ===== -->
        <section class="seccao">
{cab(I["reg_sobre"], I["reg_titulo"], I["reg_texto"])}            <div class="regiao-cartoes">
{reg}
            </div>
            <div class="centrado"><a href="regiao.html" class="btn btn-contorno-escuro">{I["reg_btn"]}</a></div>
        </section>

        <!-- ===== 9. METEOROLOGIA ===== -->
        <section class="seccao seccao-tempo">
{cab(I["tempo_sobre"], I["tempo_titulo"], I["tempo_texto"])}            <div class="tempo-caixa">
                <a class="weatherwidget-io" href="https://forecast7.com/{lang}/40d05n7d43/atalaia-do-campo/" data-label_1="ATALAIA DO CAMPO" data-label_2="{I["tempo_label"]}" data-font="Inter" data-icons="Climacons Animated" data-days="5" data-theme="pure" data-basecolor="#faf7f2" data-textcolor="#3d3a35" data-highcolor="#c2a26b" data-lowcolor="#6f7d5c" data-suncolor="#c2a26b" data-cloudcolor="#8a9479" data-raincolor="#6f7d5c">ATALAIA DO CAMPO · {I["tempo_label"]}</a>
            </div>
            <script>
                !function(d,s,id){{var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){{js=d.createElement(s);js.id=id;js.src='https://weatherwidget.io/js/widget.min.js';fjs.parentNode.insertBefore(js,fjs);}}}}(document,'script','weatherwidget-io-js');
            </script>
        </section>

        <!-- ===== 10. COMO CHEGAR ===== -->
        <section class="seccao seccao-areia como-chegar">
            <div class="como-chegar-texto">
                <p class="sobretitulo">{I["cc_sobre"]}</p>
                <h2>{I["cc_titulo"]}</h2>
                <p>Tapada, 6230-130 Atalaia do Campo<br>Fundão, Portugal</p>
                <p>{I["cc_texto"]}</p>
                <div class="hero-botoes">
                    <a href="{mapa_link(MORADA_MAPA)}" class="btn btn-principal" target="_blank" rel="noopener">Google Maps</a>
                    <a href="https://waze.com/ul?q={quote(MORADA_MAPA)}&amp;navigate=yes" class="btn btn-contorno-escuro" target="_blank" rel="noopener">Waze</a>
                </div>
            </div>
            <div class="mapa">
                <iframe src="https://www.google.com/maps?q={quote(MORADA_MAPA)}&amp;z=13&amp;hl={lang}&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="{I["cc_mapa_titulo"]}"></iframe>
            </div>
        </section>

        <!-- ===== 11. PERGUNTAS FREQUENTES ===== -->
        <section class="seccao">
{cab(I["faq_sobre"], I["faq_titulo"])}            <div class="faq">
{faq}
            </div>
        </section>
'''

def galeria(c, fotos):
    return "\n".join(f'                {c.img(f, TAM_GALERIA)}' for f in fotos)

def p_casa(c):
    T = c.T; C = T["casa"]
    saltar = "\n".join(f'            <a href="#{i}">{t}</a>' for i, t, _ in C["divisoes"])
    corpo = pagina_topo(c, C["topo"], "f1")
    corpo += f'''
        <nav class="saltar" aria-label="{C["saltar_aria"]}">
{saltar}
            <a href="#comodidades">{C["comod_titulo_curto"]}</a>
        </nav>
'''
    for n, (i, t, txt) in enumerate(C["divisoes"]):
        cls = "seccao divisao" + (" seccao-areia" if n % 2 else "")
        corpo += f'''
        <section class="{cls}" id="{i}">
            <div class="divisao-texto">
                <h2>{t}</h2>
                <p>{txt}</p>
            </div>
            <div class="galeria" data-galeria>
{galeria(c, DIVISOES_FOTOS[i])}
            </div>
        </section>
'''
    comod = "\n".join(f"                <li>{x}</li>" for x in C["comodidades"])
    criancas = "\n".join(f"                    <li>{x}</li>" for x in C["criancas"])
    corpo += f'''
        <section class="seccao" id="comodidades">
{cab(C["comod_sobre"], C["comod_titulo"])}            <ul class="comodidades">
{comod}
            </ul>
            <div class="aviso-caixa">
                <h3>{C["criancas_titulo"]}</h3>
                <ul>
{criancas}
                </ul>
            </div>
        </section>
'''
    corpo += faixa(C["faixa"])
    corpo += f'''
        <div class="lightbox" id="lightbox" aria-hidden="true">
            <button class="lightbox-fechar" aria-label="{T["fechar"]}">&times;</button>
            <button class="lightbox-seta lightbox-ant" aria-label="{T["anterior"]}">&#8249;</button>
            <img src="" alt="" id="lightboxImg">
            <button class="lightbox-seta lightbox-seg" aria-label="{T["seguinte"]}">&#8250;</button>
        </div>
'''
    return corpo

def p_regiao(c):
    T = c.T; R = T["regiao"]
    corpo = pagina_topo(c, R["topo"], "f28")
    saltar = "\n".join(f'            <a href="#{i}">{t}</a>' for i, t in R["saltar"])
    corpo += f'''
        <nav class="saltar" aria-label="{R["saltar_aria"]}">
{saltar}
        </nav>
'''
    locais = "\n".join(
        f'''                <article class="local">
                    <p class="local-tag">{tag}</p>
                    <h3>{nome}</h3>
                    <p>{txt}</p>
                    <a href="{mapa_link(q)}" target="_blank" rel="noopener" class="link-seta">{R["ver_mapa"]}</a>
                </article>''' for nome, tag, txt, q in R["locais"])
    corpo += f'''
        <section class="seccao" id="descobrir">
{cab(R["locais_sobre"], R["locais_titulo"], R["locais_texto"])}            <div class="locais">
{locais}
            </div>
        </section>
'''
    sab = "\n".join(f"                <p>{p}</p>" for p in R["sabores_p"])
    corpo += f'''
        <section class="seccao regiao-bloco seccao-areia" id="sabores">
            {c.img("f24", TAM_METADE)}
            <div class="regiao-bloco-texto">
                <p class="sobretitulo">{R["sabores_sobre"]}</p>
                <h2>{R["sabores_titulo"]}</h2>
{sab}
            </div>
        </section>
'''
    corpo += f'''
        <section class="seccao" id="experiencias">
{cab(R["exp_sobre"], R["exp_titulo"])}            <div class="experiencia">
                <h3>Alpreade Xplore</h3>
                <p>{R["exp_texto"]}</p>
                <a href="https://www.instagram.com/alpreade.xplore/" target="_blank" rel="noopener" class="btn btn-principal">{R["exp_btn"]}</a>
            </div>
        </section>
'''
    eventos = "\n".join(
        f'''                <article class="evento">
                    <p class="evento-data">{data}</p>
                    <div>
                        <h3>{nome}</h3>
                        <p>{txt}</p>
                    </div>
                </article>''' for data, nome, txt in R["eventos"])
    corpo += f'''
        <section class="seccao seccao-areia" id="eventos">
{cab(R["eventos_sobre"], R["eventos_titulo"], R["eventos_texto"])}            <div class="eventos">
{eventos}
            </div>
        </section>
'''
    grupos = "\n".join(
        f'''                <div class="servicos-grupo">
                    <h3>{titulo}</h3>
                    <ul>
{chr(10).join("                        <li>" + x + "</li>" for x in itens)}
                    </ul>
                </div>''' for titulo, itens in R["servicos"])
    corpo += f'''
        <section class="seccao" id="aldeia">
{cab(R["aldeia_sobre"], R["aldeia_titulo"], R["aldeia_texto"])}            <div class="servicos">
{grupos}
            </div>
            <p class="nota centrado">{R["aldeia_fundao"]}</p>
        </section>
'''
    corpo += faixa(R["faixa"])
    return corpo

def p_historia(c):
    H = c.T["historia"]
    corpo = pagina_topo(c, H["topo"], "f25")
    corpo += '\n        <article class="historia">\n'
    for titulo, paras, foto in H["capitulos"]:
        corpo += f'            <h2>{titulo}</h2>\n'
        for p in paras:
            corpo += f'            <p>{p}</p>\n'
        if foto:
            corpo += "            " + c.img(foto, "(max-width: 768px) 90vw, 720px", extra='class="historia-img" loading="lazy"') + "\n"
    corpo += f'''            <p class="historia-assinatura">{H["assinatura"]}<br><span>{H["assinatura_nome"]}</span></p>
        </article>

        <section class="seccao seccao-areia">
            <div class="valores">
{chr(10).join(f"                <div><h3>{h}</h3><p>{p}</p></div>" for h, p in H["valores"])}
            </div>
        </section>
'''
    return corpo

def p_reservar(c):
    T = c.T; R = T["reservar"]; K = R["cal"]
    passos = "\n".join(f'                <li><span>{n}</span><h3>{h}</h3><p>{p}</p></li>' for n, (h, p) in enumerate(R["passos"], 1))
    resumo = "\n".join(f'                <div><strong>{a}</strong><span>{b}</span></div>' for a, b in R["resumo"])
    inclui = "\n".join(f"                        <li>{x}</li>" for x in R["inclui"])
    cond = []
    for n, (titulo, itens) in enumerate(R["condicoes"]):
        lis = "\n".join(f"                        <li>{x}</li>" for x in itens)
        cond.append(f'''                <details{" open" if n == 0 else ""}>
                    <summary>{titulo}</summary>
                    <ul>
{lis}
                    </ul>
                </details>''')
    cond = "\n".join(cond)
    # O Booking só aparece quando houver link (BOOKING preenchido lá em cima)
    booking = (f'<a href="{BOOKING}" class="btn btn-contorno-escuro" target="_blank" rel="noopener">Booking.com</a>' if BOOKING else "")
    O = R["opcoes"]
    # dados para o calendário (lidos pelo main.js)
    dados = {
        "ocupadas": [],
        "tel": TEL.replace("+", ""), "email": EMAIL,
        "msg": K["msg"], "assunto": K["assunto"],
        "noite": K["noite"], "noites": K["noites"], "sim": K["sim"], "nao": K["nao"],
    }
    dados_json = json.dumps(dados, ensure_ascii=False).replace("</", "<\\/")
    hosp = "\n".join(f'                            <option value="{n}"{" selected" if n == 2 else ""}>{n}</option>' for n in range(1, 7))
    return f'''
        <section class="reservar-topo">
            <p class="sobretitulo">{R["sobre"]}</p>
            <h1>{R["titulo"]}</h1>
            <p>{R["texto"]}</p>
        </section>

        <!-- ===== DUAS FORMAS DE RESERVAR ===== -->
        <section class="reservar-opcoes" aria-label="{O["aria"]}">
            <div class="opcao opcao-direta">
                <p class="opcao-selo">{O["direto_selo"]}</p>
                <h2>{O["direto_titulo"]}</h2>
                <p>{O["direto_texto"]}</p>
                <a href="#disponibilidade" class="btn btn-principal">{O["direto_btn"]}</a>
            </div>
            <div class="opcao">
                <h2>{O["airbnb_titulo"]}</h2>
                <p>{O["airbnb_texto"]}</p>
                <a href="{AIRBNB}" class="btn btn-contorno-escuro" target="_blank" rel="noopener">{T["btn_airbnb"]} ↗</a>
            </div>
        </section>

        <!-- ===== CALENDÁRIO + PEDIDO ===== -->
        <section class="seccao reserva-calendario" id="disponibilidade">
            <div class="cal-caixa" id="calendario">
                <div class="cal-topo">
                    <h2>{K["titulo"]}</h2>
                    <p>{K["texto"]}</p>
                </div>
                <div class="cal-navegacao">
                    <button type="button" class="cal-seta" id="calAnt" aria-label="{K["anterior"]}">&#8249;</button>
                    <div class="cal-meses" aria-live="polite"></div>
                    <button type="button" class="cal-seta" id="calSeg" aria-label="{K["seguinte"]}">&#8250;</button>
                </div>
                <div class="cal-legenda">
                    <button type="button" class="cal-limpar" id="calLimpar">{K["limpar"]}</button>
                </div>
                <p class="nota">{K["nota"]}</p>
            </div>

            <form class="pedido-caixa" id="pedido" onsubmit="return false">
                <div class="pedido-datas">
                    <label>{K["checkin"]}<input type="text" id="pedIn" readonly placeholder="{K["escolher"]}"></label>
                    <label>{K["checkout"]}<input type="text" id="pedOut" readonly placeholder="{K["escolher"]}"></label>
                </div>
                <p class="pedido-noites" id="pedNoites"></p>
                <div class="pedido-datas">
                    <label>{K["hospedes"]}
                        <select id="pedHosp">
{hosp}
                        </select>
                    </label>
                    <label>{K["animais"]}
                        <select id="pedAnimais">
                            <option value="nao">{K["nao"]}</option>
                            <option value="sim">{K["sim"]}</option>
                        </select>
                    </label>
                </div>
                <label>{K["nome"]}<input type="text" id="pedNome" placeholder="{K["nome_ph"]}" autocomplete="name"></label>
                <label>{K["notas"]}<textarea id="pedNotas" rows="3" maxlength="600" placeholder="{K["notas_ph"]}"></textarea></label>
                <div class="pedido-preco">
                    <div><strong>{K["preco_titulo"]}</strong><span>{K["preco"]}</span></div>
                    <p>{K["preco_texto"]}</p>
                </div>
                <p class="pedido-aviso" id="pedAviso" hidden>{K["aviso"]}</p>
                <a href="#" class="btn btn-principal" id="pedWa" target="_blank" rel="noopener">{K["btn_wa"]}</a>
                <a href="#" class="btn btn-contorno-escuro" id="pedEmail">{K["btn_email"]}</a>
            </form>
            <script type="application/json" id="calendario-dados">{dados_json}</script>
        </section>

        <section class="seccao seccao-areia">
{cab("", R["como_titulo"])}            <ol class="passos">
{passos}
            </ol>
        </section>

        <section class="seccao">
{cab("", R["resumo_titulo"])}            <div class="resumo">
{resumo}
            </div>
            <div class="inclui">
                {c.img("f2", "(max-width: 768px) 90vw, 260px")}
                <div>
                    <h3>{R["inclui_titulo"]}</h3>
                    <ul>
{inclui}
                    </ul>
                </div>
            </div>
        </section>

        <section class="seccao seccao-areia">
{cab("", R["cond_titulo"])}            <div class="faq">
{cond}
            </div>
            <p class="nota centrado">{R["cond_nota"]}</p>
        </section>

        <section class="seccao">
{cab("", R["plataformas_titulo"], R["plataformas_texto"])}            <div class="reservar-botoes">
                <a href="{AIRBNB}" class="btn btn-contorno-escuro" target="_blank" rel="noopener">{T["btn_airbnb"]} ↗</a>
                {booking}
            </div>
        </section>

        <section class="seccao seccao-areia">
{cab("", R["contactos_titulo"])}            <div class="contactos">
                <a href="{wa(T["wa_info"])}" target="_blank" rel="noopener"><strong>WhatsApp / {R["telefone"]}</strong><span>{TEL_VISIVEL}</span></a>
                <a href="mailto:{EMAIL}"><strong>Email</strong><span>{EMAIL.replace("@", "@<wbr>")}</span></a>
                <a href="{INSTAGRAM}" target="_blank" rel="noopener"><strong>Instagram</strong><span>@casadatapadaturismo</span></a>
                <a href="{mapa_link(MORADA_MAPA)}" target="_blank" rel="noopener"><strong>{R["morada"]}</strong><span>Tapada, 6230-130 Atalaia do Campo, Fundão</span></a>
            </div>
        </section>
'''

def p_legal(c):
    return c.T["legal_html"].replace("{RNAL}", RNAL).replace("{EMAIL}", EMAIL_RECLAMACOES)

CONSTRUTORES = {
    "index.html": ("index", p_index), "casa.html": ("casa", p_casa), "regiao.html": ("regiao", p_regiao),
    "historia.html": ("historia", p_historia), "reservar.html": ("reservar", p_reservar), "legal.html": ("legal", p_legal),
}

def main():
    total = 0
    for l in LINGUAS:
        pasta = SAIDA if l == "pt" else os.path.join(SAIDA, l)
        os.makedirs(pasta, exist_ok=True)
        for p in PAGINAS:
            c = Pag(l, p)
            chave, f = CONSTRUTORES[p]
            html = head(c, chave) + topo(c) + "\n    <main>\n" + f(c) + "\n    </main>\n" + rodape(c)
            with open(os.path.join(pasta, p), "w", encoding="utf-8", newline="\n") as fh:
                fh.write(html)
            total += 1
    print(f"{total} páginas geradas em {SAIDA}")

if __name__ == "__main__":
    main()
