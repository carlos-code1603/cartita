# 🌻 Para Joss

Micrositio dedicado, construido en HTML/CSS/JS sin dependencias ni build.

## Estructura

```
index.html        Estructura: nav, portada y los cuatro capítulos
css/styles.css    Sistema visual (paleta, tipografía, transiciones)
js/data.js        ← TODO EL CONTENIDO (textos, momentos, fotos, razones, carta)
js/field.js       Campo de flores animado (Canvas 2D)
js/router.js      Rutas por hash (#inicio, #historia, #recuerdos, #razones, #carta)
js/main.js        Arranque, menú móvil, gestos de la portada
assets/fotos/     Aquí van las fotos
```

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
