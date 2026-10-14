/* Lightbox partilhado (Galeria e Planta): clicar numa foto amplia-a; setas/teclado/Esc para navegar */
(function () {
    const galeriaImgs = document.querySelectorAll('.grid-galeria img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (!galeriaImgs.length || !lightbox) return;
    let indiceAtual = 0;

    function mostrar() {
        lightboxImg.src = galeriaImgs[indiceAtual].src;
        lightboxImg.alt = galeriaImgs[indiceAtual].alt;
    }
    function abrirLightbox(indice) {
        indiceAtual = indice;
        mostrar();
        lightbox.classList.add('ativo');
    }
    function fecharLightbox() { lightbox.classList.remove('ativo'); }
    function imagemSeguinte() { indiceAtual = (indiceAtual + 1) % galeriaImgs.length; mostrar(); }
    function imagemAnterior() { indiceAtual = (indiceAtual - 1 + galeriaImgs.length) % galeriaImgs.length; mostrar(); }

    galeriaImgs.forEach((img, i) => img.addEventListener('click', () => abrirLightbox(i)));
    document.getElementById('lightboxClose').addEventListener('click', fecharLightbox);
    document.getElementById('lightboxNext').addEventListener('click', imagemSeguinte);
    document.getElementById('lightboxPrev').addEventListener('click', imagemAnterior);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) fecharLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('ativo')) return;
        if (e.key === 'Escape') fecharLightbox();
        if (e.key === 'ArrowRight') imagemSeguinte();
        if (e.key === 'ArrowLeft') imagemAnterior();
    });
})();
