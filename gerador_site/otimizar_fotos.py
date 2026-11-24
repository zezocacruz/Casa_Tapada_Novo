# -*- coding: utf-8 -*-
"""
Cria as versões leves das fotos do site.

As fotos originais ficam em  gerador_site/fotos_base/  (f1.jpg, f2.jpg, ..., logo.jpeg).
Este script escreve em  codigo_git_NOVO/fotos/ :
    fNN.webp      foto grande (até 1600 px de largura), para PC e para a ampliação
    fNN-800.webp  foto pequena (800 px), para telemóvel e cartões
    f71.jpg       cópia em JPG da foto usada quando o site é partilhado (redes sociais)
    logo.jpeg     logótipo pequeno (256 px)
e guarda as medidas de cada foto em  gerador_site/fotos.json  (o gerar.py lê esse ficheiro).

Para acrescentar uma foto nova:
    1. Pôr o JPG em gerador_site/fotos_base/ com um nome novo (por ex. f80.jpg).
    2. Correr:  python otimizar_fotos.py   (precisa do Pillow: python -m pip install pillow)
    3. Usar o nome (f80) no gerar.py e correr  python gerar.py

Só é preciso correr este script quando se mudam fotos. O GitHub não o corre.
"""
import os, json
from PIL import Image, ImageOps

AQUI = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(AQUI, "fotos_base")
SAIDA = os.path.abspath(os.path.join(AQUI, "..", "codigo_git_NOVO", "fotos"))
MEDIDAS = os.path.join(AQUI, "fotos.json")

LARGURA_GRANDE = 1600
LARGURA_PEQUENA = 800
QUALIDADE = 78
FOTO_PARTILHA = "f71"      # a mesma do og:image no gerar.py


def reduzir(img, largura):
    if img.width <= largura:
        return img.copy()
    altura = round(img.height * largura / img.width)
    return img.resize((largura, altura), Image.LANCZOS)


def main():
    os.makedirs(SAIDA, exist_ok=True)
    medidas = {}
    antes = depois = 0
    for nome in sorted(os.listdir(BASE)):
        caminho = os.path.join(BASE, nome)
        chave, ext = os.path.splitext(nome)
        if ext.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        antes += os.path.getsize(caminho)
        img = ImageOps.exif_transpose(Image.open(caminho)).convert("RGB")

        if chave == "logo":
            destino = os.path.join(SAIDA, "logo.jpeg")
            reduzir(img, 256).save(destino, "JPEG", quality=85, optimize=True, progressive=True)
            depois += os.path.getsize(destino)
            continue

        grande = reduzir(img, LARGURA_GRANDE)
        pequena = reduzir(img, LARGURA_PEQUENA)
        for imagem, sufixo in ((grande, ""), (pequena, "-800")):
            destino = os.path.join(SAIDA, f"{chave}{sufixo}.webp")
            imagem.save(destino, "WEBP", quality=QUALIDADE, method=6)
            depois += os.path.getsize(destino)
        medidas[chave] = [grande.width, grande.height]

        if chave == FOTO_PARTILHA:
            destino = os.path.join(SAIDA, f"{chave}.jpg")
            reduzir(img, 1200).save(destino, "JPEG", quality=82, optimize=True, progressive=True)
            depois += os.path.getsize(destino)

    with open(MEDIDAS, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(medidas, fh, indent=1, sort_keys=True)
        fh.write("\n")
    print(f"{len(medidas)} fotos + logótipo: {antes / 1e6:.1f} MB originais -> {depois / 1e6:.1f} MB no site")


if __name__ == "__main__":
    main()
