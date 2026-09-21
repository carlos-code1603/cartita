# 🌻 Para Joss

Micrositio dedicado, construido en HTML/CSS/JS sin dependencias ni build.

## Estructura

```
index.html        Estructura: nav, portada y los cuatro capítulos
css/styles.css    Sistema visual (paleta, tipografía, transiciones)
js/data.js        ← TODO EL CONTENIDO (textos, momentos, fotos, razones, carta)
js/field.js       Campo de flores animado (Canvas 2D)
js/router.js      Rutas por hash (#inicio, #historia, #recuerdos, #razones, #carta)
js/recuerdos.js   Capítulo 02: galería que florece + lightbox
js/main.js        Arranque, menú móvil, gestos de la portada
assets/fotos/     historia/ y recuerdos/ (cada una con su subcarpeta mini/)
tools/            optimizar-fotos.py
```

## Agregar fotos

1. Copia las fotos originales (PNG o JPG) en `assets/fotos/historia/` o `assets/fotos/recuerdos/`.
2. Corre el optimizador (requiere `pip install pillow`):

   ```
   python3 tools/optimizar-fotos.py
   ```

   Convierte cada foto a JPEG de máximo 1600 px (para verla en grande) y genera
   una miniatura de 640 px en `mini/` (para la cuadrícula). Borra el original PNG.
3. Referencia la foto en `js/data.js` por su ruta `.jpg`. La miniatura se busca sola.

## Rutas

| Ruta         | Sección           |
|--------------|-------------------|
| `#inicio`    | Portada           |
| `#historia`  | Nuestra historia  |
| `#recuerdos` | Recuerdos         |
| `#razones`   | Razones           |
| `#carta`     | Carta para ti     |

## Probar en local

Abre `index.html` directamente o sirve la carpeta:

```
python3 -m http.server 8080
```

## Deploy en Netlify Drop

Arrastra la carpeta completa del proyecto a https://app.netlify.com/drop.
No hace falta configuración: las rutas son por hash, así que no requieren redirects.
