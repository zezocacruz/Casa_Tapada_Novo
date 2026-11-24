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

    // Fotos que vão trocando no topo da página inicial (sozinhas, com setas ou a deslizar o dedo)
    const hero = document.querySelector('[data-hero]');
    if (hero) {
        const slides = Array.from(hero.querySelectorAll('.hero-slide'));
        const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let atual = 0, relogio = null;
        const ir = function (n) {
            slides[atual].classList.remove('ativo');
            atual = (n + slides.length) % slides.length;
            slides[atual].classList.add('ativo');
        };
        const iniciar = function () {
            clearInterval(relogio);
            if (!reduzido && slides.length > 1) relogio = setInterval(function () { ir(atual + 1); }, 6000);
        };
        const ant = hero.querySelector('.hero-ant');
        const seg = hero.querySelector('.hero-seg');
        if (ant) ant.addEventListener('click', function () { ir(atual - 1); iniciar(); });
        if (seg) seg.addEventListener('click', function () { ir(atual + 1); iniciar(); });
        let toqueX = null, toqueY = null;
        hero.addEventListener('touchstart', function (e) { toqueX = e.touches[0].clientX; toqueY = e.touches[0].clientY; }, { passive: true });
        hero.addEventListener('touchend', function (e) {
            if (toqueX === null) return;
            const dx = e.changedTouches[0].clientX - toqueX;
            const dy = e.changedTouches[0].clientY - toqueY;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { ir(atual + (dx < 0 ? 1 : -1)); iniciar(); }
            toqueX = null;
        });
        document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(relogio); else iniciar(); });
        iniciar();
    }

    // Lista de línguas (globo no cabeçalho)
    const linguasBotao = document.querySelector('.linguas-botao');
    if (linguasBotao) {
        const caixa = linguasBotao.parentElement;
        const fecharLinguas = function () { caixa.classList.remove('aberto'); linguasBotao.setAttribute('aria-expanded', 'false'); };
        linguasBotao.addEventListener('click', function (e) {
            e.stopPropagation();
            const aberto = caixa.classList.toggle('aberto');
            linguasBotao.setAttribute('aria-expanded', aberto);
        });
        document.addEventListener('click', function (e) { if (!caixa.contains(e.target)) fecharLinguas(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharLinguas(); });
    }

    // Realçar o atalho da secção onde a pessoa está (barra "saltar")
    document.querySelectorAll('.saltar').forEach(function (nav) {
        const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
        const seccoes = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
        if (!seccoes.some(Boolean)) return;
        let anterior = -1;
        const atualizar = function () {
            const linha = window.innerHeight * 0.35;
            let atual = -1;
            seccoes.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= linha) atual = i; });
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
                for (let i = seccoes.length - 1; i >= 0; i--) { if (seccoes[i]) { atual = i; break; } }
            }
            if (atual === anterior) return;
            anterior = atual;
            links.forEach(function (a, i) {
                a.classList.toggle('ativo', i === atual);
                if (i === atual) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
            });
            if (atual >= 0 && nav.scrollWidth > nav.clientWidth) {
                const a = links[atual];
                nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
            }
        };
        let pedido = false;
        window.addEventListener('scroll', function () {
            if (pedido) return;
            pedido = true;
            requestAnimationFrame(function () { pedido = false; atualizar(); });
        }, { passive: true });
        atualizar();
    });

    // Calendário de disponibilidade + pedido de reserva (página Reservar)
    const cal = document.getElementById('calendario');
    const dadosEl = document.getElementById('calendario-dados');
    if (cal && dadosEl) {
        const D = JSON.parse(dadosEl.textContent);
        const lingua = document.documentElement.lang || 'pt-PT';
        const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
        const iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
        const ler = function (s) { const p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
        const somar = function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); };

        // Noites ocupadas (a data de saída fica livre)
        const ocupadas = new Set();
        D.ocupadas.forEach(function (par) {
            for (let d = ler(par[0]); d < ler(par[1]); d = somar(d, 1)) ocupadas.add(iso(d));
        });

        const fmtMes = new Intl.DateTimeFormat(lingua, { month: 'long', year: 'numeric' });
        const fmtSemana = new Intl.DateTimeFormat(lingua, { weekday: 'short' });
        const fmtData = new Intl.DateTimeFormat(lingua, { day: '2-digit', month: '2-digit', year: 'numeric' });
        const fmtLongo = new Intl.DateTimeFormat(lingua, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        const semana = [0, 1, 2, 3, 4, 5, 6].map(function (i) { return fmtSemana.format(new Date(2024, 0, 1 + i)).replace('.', '').slice(0, 3); });  // seg, ter... (em pt o "short" dá "segunda")

        const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const mesMax = new Date(hoje.getFullYear(), hoje.getMonth() + 18, 1);
        let vista = new Date(mesAtual);
        let inicio = null, fim = null;

        const grelha = cal.querySelector('.cal-meses');
        const btnAnt = document.getElementById('calAnt');
        const btnSeg = document.getElementById('calSeg');
        const movel = window.matchMedia('(max-width: 768px)');
        const nMeses = function () { return movel.matches ? 1 : 2; };

        const livreParaEntrar = function (d) { return d >= hoje && !ocupadas.has(iso(d)); };
        const intervaloLivre = function (a, b) {
            for (let d = a; d < b; d = somar(d, 1)) if (ocupadas.has(iso(d))) return false;
            return true;
        };

        const campos = {
            entrada: document.getElementById('pedIn'), saida: document.getElementById('pedOut'),
            noites: document.getElementById('pedNoites'), hosp: document.getElementById('pedHosp'),
            animais: document.getElementById('pedAnimais'), nome: document.getElementById('pedNome'),
            notas: document.getElementById('pedNotas'), aviso: document.getElementById('pedAviso'),
            wa: document.getElementById('pedWa'), email: document.getElementById('pedEmail'),
        };

        const mensagem = function () {
            const n = Math.round((fim - inicio) / 86400000);
            return D.msg
                .replace('{in}', fmtData.format(inicio))
                .replace('{out}', fmtData.format(fim))
                .replace('{noites}', n + ' ' + (n === 1 ? D.noite : D.noites))
                .replace('{hospedes}', campos.hosp.value)
                .replace('{animais}', campos.animais.value === 'sim' ? D.sim : D.nao)
                .replace('{nome}', campos.nome.value.trim() || '-')
                .replace('{notas}', campos.notas.value.trim() || '-');
        };

        const atualizarPedido = function () {
            const completo = inicio && fim;
            campos.entrada.value = inicio ? fmtData.format(inicio) : '';
            campos.saida.value = fim ? fmtData.format(fim) : '';
            if (completo) {
                const n = Math.round((fim - inicio) / 86400000);
                campos.noites.textContent = n + ' ' + (n === 1 ? D.noite : D.noites);
                campos.aviso.hidden = true;
                const msg = mensagem();
                campos.wa.href = 'https://wa.me/' + D.tel + '?text=' + encodeURIComponent(msg);
                campos.email.href = 'mailto:' + D.email + '?subject=' + encodeURIComponent(D.assunto) + '&body=' + encodeURIComponent(msg);
            } else {
                campos.noites.textContent = '';
                campos.wa.href = '#';
                campos.email.href = '#';
            }
            campos.wa.classList.toggle('desativado', !completo);
            campos.email.classList.toggle('desativado', !completo);
        };

        const desenhar = function () {
            grelha.innerHTML = '';
            for (let m = 0; m < nMeses(); m++) {
                const primeiro = new Date(vista.getFullYear(), vista.getMonth() + m, 1);
                const bloco = document.createElement('div');
                bloco.className = 'cal-mes';
                const titulo = document.createElement('p');
                titulo.className = 'cal-titulo';
                const nomeMes = fmtMes.format(primeiro);
                titulo.textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
                bloco.appendChild(titulo);
                const dias = document.createElement('div');
                dias.className = 'cal-dias';
                semana.forEach(function (s) {
                    const e = document.createElement('span'); e.className = 'cal-semana'; e.textContent = s; dias.appendChild(e);
                });
                const desvio = (primeiro.getDay() + 6) % 7;
                for (let i = 0; i < desvio; i++) dias.appendChild(document.createElement('span'));
                const total = new Date(primeiro.getFullYear(), primeiro.getMonth() + 1, 0).getDate();
                for (let dia = 1; dia <= total; dia++) {
                    const d = new Date(primeiro.getFullYear(), primeiro.getMonth(), dia);
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.className = 'cal-dia';
                    b.textContent = dia;
                    b.dataset.data = iso(d);
                    b.setAttribute('aria-label', fmtLongo.format(d));
                    const passado = d < hoje;
                    const ocupado = ocupadas.has(iso(d));
                    const podeSair = inicio && !fim && d > inicio && intervaloLivre(inicio, d);
                    if (passado) b.classList.add('passado');
                    else if (ocupado) b.classList.add('ocupado');
                    if (passado || (ocupado && !podeSair)) b.disabled = true;
                    if (inicio && d.getTime() === inicio.getTime()) b.classList.add('sel', 'sel-inicio');
                    if (fim && d.getTime() === fim.getTime()) b.classList.add('sel', 'sel-fim');
                    if (inicio && fim && d > inicio && d < fim) b.classList.add('intervalo');
                    if (d.getTime() === hoje.getTime()) b.classList.add('hoje');
                    dias.appendChild(b);
                }
                bloco.appendChild(dias);
                grelha.appendChild(bloco);
            }
            btnAnt.disabled = vista <= mesAtual;
            btnSeg.disabled = new Date(vista.getFullYear(), vista.getMonth() + nMeses(), 1) > mesMax;
            atualizarPedido();
        };

        grelha.addEventListener('click', function (e) {
            const b = e.target.closest('.cal-dia');
            if (!b || b.disabled) return;
            const d = ler(b.dataset.data);
            if (!inicio || fim) { if (livreParaEntrar(d)) { inicio = d; fim = null; } }
            else if (d <= inicio) { if (livreParaEntrar(d)) inicio = d; }
            else if (intervaloLivre(inicio, d)) { fim = d; }
            else if (livreParaEntrar(d)) { inicio = d; fim = null; }
            desenhar();
        });
        btnAnt.addEventListener('click', function () { vista = new Date(vista.getFullYear(), vista.getMonth() - 1, 1); desenhar(); });
        btnSeg.addEventListener('click', function () { vista = new Date(vista.getFullYear(), vista.getMonth() + 1, 1); desenhar(); });
        document.getElementById('calLimpar').addEventListener('click', function () { inicio = null; fim = null; desenhar(); });
        if (movel.addEventListener) movel.addEventListener('change', desenhar);

        ['hosp', 'animais', 'nome', 'notas'].forEach(function (k) {
            campos[k].addEventListener('input', atualizarPedido);
            campos[k].addEventListener('change', atualizarPedido);
        });
        [campos.wa, campos.email].forEach(function (botao) {
            botao.addEventListener('click', function (e) {
                if (inicio && fim) return;
                e.preventDefault();
                campos.aviso.hidden = false;
                cal.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
        [campos.entrada, campos.saida].forEach(function (c) {
            c.addEventListener('click', function () { cal.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        });

        desenhar();
    }

    // Ano atual no rodapé
    const ano = document.getElementById('ano');
    if (ano) ano.textContent = new Date().getFullYear();
})();
