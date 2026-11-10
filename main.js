/* Casa da Tapada · interações simples */
(function () {
    // Menu ☰ do telemóvel
    const botao = document.getElementById('menuBotao');
    const menu = document.getElementById('menu');
    if (botao && menu) {
        botao.addEventListener('click', function () {
            const aberto = document.body.classList.toggle('menu-aberto');
            botao.setAttribute('aria-expanded', aberto);
            botao.setAttribute('aria-label', aberto ? (botao.dataset.fechar || 'Fechar menu') : (botao.dataset.abrir || 'Abrir menu'));
        });
        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { document.body.classList.remove('menu-aberto'); });
        });
    }

    // Sombra no cabeçalho ao descer a página
    const topo = document.getElementById('topo');
    if (topo) {
        const atualizar = function () { topo.classList.toggle('com-sombra', window.scrollY > 10); };
        window.addEventListener('scroll', atualizar, { passive: true });
        atualizar();
    }

    // Setas dos carrosséis (no telemóvel desliza-se com o dedo)
    document.querySelectorAll('.carrossel').forEach(function (c) {
        const faixa = c.querySelector('[data-deslizar]');
        c.querySelectorAll('.carrossel-seta').forEach(function (seta) {
            seta.addEventListener('click', function () {
                const cartao = faixa.firstElementChild;
                const passo = cartao ? cartao.offsetWidth + 20 : faixa.clientWidth;
                const dir = Number(seta.dataset.dir);
                const fim = faixa.scrollLeft + faixa.clientWidth >= faixa.scrollWidth - 5;
                if (dir > 0 && fim) faixa.scrollTo({ left: 0, behavior: 'smooth' });
                else if (dir < 0 && faixa.scrollLeft <= 5) faixa.scrollTo({ left: faixa.scrollWidth, behavior: 'smooth' });
                else faixa.scrollBy({ left: dir * passo, behavior: 'smooth' });
            });
        });
    });

    // Ampliar fotos das galerias (setas, teclado e deslizar com o dedo)
    const lb = document.getElementById('lightbox');
    if (lb) {
        const lbImg = document.getElementById('lightboxImg');
        const fotos = Array.from(document.querySelectorAll('[data-galeria] img'));
        let atual = 0;
        const mostrar = function (i) {
            atual = (i + fotos.length) % fotos.length;
            lbImg.src = fotos[atual].src;
            lbImg.alt = fotos[atual].alt;
        };
        const abrir = function (i) { mostrar(i); lb.classList.add('aberto'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
        const fechar = function () { lb.classList.remove('aberto'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
        fotos.forEach(function (f, i) { f.addEventListener('click', function () { abrir(i); }); });
        lb.querySelector('.lightbox-fechar').addEventListener('click', fechar);
        lb.querySelector('.lightbox-ant').addEventListener('click', function (e) { e.stopPropagation(); mostrar(atual - 1); });
        lb.querySelector('.lightbox-seg').addEventListener('click', function (e) { e.stopPropagation(); mostrar(atual + 1); });
        lb.addEventListener('click', function (e) { if (e.target === lb) fechar(); });
        document.addEventListener('keydown', function (e) {
            if (!lb.classList.contains('aberto')) return;
            if (e.key === 'Escape') fechar();
            if (e.key === 'ArrowLeft') mostrar(atual - 1);
            if (e.key === 'ArrowRight') mostrar(atual + 1);
        });
        let toqueX = null;
        lb.addEventListener('touchstart', function (e) { toqueX = e.touches[0].clientX; }, { passive: true });
        lb.addEventListener('touchend', function (e) {
            if (toqueX === null) return;
            const dx = e.changedTouches[0].clientX - toqueX;
            if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
            toqueX = null;
        });
    }

    // Ano atual no rodapé
    const ano = document.getElementById('ano');
    if (ano) ano.textContent = new Date().getFullYear();
})();
