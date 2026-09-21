#!/usr/bin/env python3
"""
Optimiza las fotos del sitio para que carguen rápido en celular.

Para cada imagen (PNG/JPG/JPEG) en assets/fotos/historia y assets/fotos/recuerdos:
  - genera <nombre>.jpg      → JPEG progresivo, lado mayor 1600 px (para el lightbox)
  - genera mini/<nombre>.jpg → JPEG, lado mayor 640 px (para la cuadrícula)
  - borra el original si era PNG (o un JPG más grande que el límite)

Es seguro correrlo varias veces: si un .jpg ya cumple el tamaño y tiene su
miniatura, lo deja como está.

Uso:  python3 tools/optimizar-fotos.py
Requiere: pip install pillow
"""
import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Falta Pillow. Instálalo con: pip install pillow")

RAIZ = Path(__file__).resolve().parent.parent
CARPETAS = [RAIZ / "assets/fotos/historia", RAIZ / "assets/fotos/recuerdos"]
LADO_MAX = 1600
LADO_MINI = 640
CALIDAD = 80
CALIDAD_MINI = 78
FONDO = (255, 248, 231)  # crema, por si alguna imagen trae transparencia
EXT = {".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"}


def a_rgb(im):
    im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        im = im.convert("RGBA")
        fondo = Image.new("RGB", im.size, FONDO)
        fondo.paste(im, mask=im.split()[-1])
        return fondo
    return im.convert("RGB")


def encajar(im, lado):
    if max(im.size) <= lado:
        return im.copy()
    im = im.copy()
    im.thumbnail((lado, lado), Image.LANCZOS)
    return im


def guardar(im, destino, calidad):
    destino.parent.mkdir(parents=True, exist_ok=True)
    tmp = destino.with_suffix(destino.suffix + ".tmp")
    im.save(tmp, "JPEG", quality=calidad, optimize=True, progressive=True, subsampling="4:2:0")
    os.replace(tmp, destino)


def procesar(origen):
    destino = origen.with_suffix(".jpg")
    mini = origen.parent / "mini" / destino.name
    with Image.open(origen) as im:
        im.load()
        ya_bien = (
            origen.suffix.lower() in (".jpg", ".jpeg")
            and origen == destino
            and max(im.size) <= LADO_MAX
            and mini.exists()
        )
        if ya_bien:
            return None
        rgb = a_rgb(im)
        guardar(encajar(rgb, LADO_MAX), destino, CALIDAD)
        guardar(encajar(rgb, LADO_MINI), mini, CALIDAD_MINI)
    if origen != destino:
        origen.unlink()
    return destino, mini


def main():
    total_antes = total_despues = 0
    for carpeta in CARPETAS:
        if not carpeta.is_dir():
            continue
        for origen in sorted(p for p in carpeta.iterdir() if p.is_file() and p.suffix in EXT):
            antes = origen.stat().st_size
            res = procesar(origen)
            if res is None:
                print(f"  ok      {origen.relative_to(RAIZ)}")
                continue
            destino, mini = res
            despues = destino.stat().st_size
            total_antes += antes
            total_despues += despues
            print(f"  {antes/1e6:5.2f} MB → {despues/1e3:4.0f} KB  (+ mini {mini.stat().st_size/1e3:3.0f} KB)  {destino.relative_to(RAIZ)}")
    if total_antes:
        print(f"\nTotal: {total_antes/1e6:.1f} MB → {total_despues/1e6:.1f} MB")


if __name__ == "__main__":
    main()
