/* =========================================================
   TODO EL CONTENIDO DEL SITIO VIVE AQUÍ.
   Cambia textos, agrega momentos, fotos, razones y la carta
   sin tocar el resto del código.
   Las fotos van en assets/fotos/historia/ y assets/fotos/recuerdos/
   y se referencian por ruta.
   Busca "PENDIENTE" para ver qué campos siguen siendo placeholders.
   ========================================================= */
window.SITE = {

  nombre: 'Joss',

  portada: {
    overline: 'Un lugar que existe solo para ti',
    titulo: 'Para Joss',
    subtitulo: 'Un campo de flores amarillas, sembrado con recuerdos.',
    boton: 'Entrar'
  },

  capitulos: {
    historia:  { num: 'Capítulo 01', titulo: 'Nuestra historia', sub: 'Los momentos que nos trajeron hasta aquí, en orden, como los vivimos.' },
    recuerdos: { num: 'Capítulo 02', titulo: 'Recuerdos',        sub: 'Toca una flor y deja que se abra.' },
    razones:   { num: 'Capítulo 03', titulo: 'Razones',          sub: 'Cosas que amo de ti, una por una.' },
    carta:     { num: 'Capítulo 04', titulo: 'Carta para ti',    sub: 'Sin distracciones. Solo lo que quiero decirte.' }
  },

  /* Línea de tiempo (Capítulo 01). En orden cronológico.
     { fecha: '2023-05-14', titulo: 'El primer café', frase: 'Una frase corta.', foto: 'assets/fotos/historia/01.png' }
     ⚠ PENDIENTE DE REVISIÓN: las fechas, títulos y frases de abajo son
       placeholders. Sustitúyelos por los reales antes de publicar. */
  historia: [
    {
      fecha: 'PENDIENTE — pon la fecha real',            // PENDIENTE
      titulo: 'PENDIENTE — título del momento',           // PENDIENTE
      frase: 'Un evento especial, los dos arreglados, con la escalinata de flores blancas de fondo.', // PENDIENTE (borrador)
      foto: 'assets/fotos/historia/historia-01-evento-formal.png'
    },
    {
      fecha: 'PENDIENTE — pon la fecha real',            // PENDIENTE
      titulo: 'PENDIENTE — título del momento',           // PENDIENTE
      frase: 'El mismo momento, un poco más de cerca.',   // PENDIENTE (borrador)
      foto: 'assets/fotos/historia/historia-02-evento-formal-closeup.png'
    }
  ],

  /* Galería (Capítulo 02). Cada flor revela una foto.
     { foto: 'assets/fotos/recuerdos/10.png', pie: 'Texto opcional al pie' }
     ⚠ PENDIENTE DE REVISIÓN: los pies de foto son un borrador descriptivo,
       no los recuerdos reales. Cámbialos por lo que ustedes vivieron. */
  recuerdos: [
    { foto: 'assets/fotos/recuerdos/recuerdo-01-selfie-gorro.png',        pie: 'Una foto muy de cerca, así de simple.' },                                    // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-02-cena-collar-girasol.png', pie: 'Una comida juntos, y ese dije de girasol que le queda perfecto al sitio.' }, // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-03-selfie-noche.png',        pie: 'Una noche cualquiera, haciendo caras.' },                                    // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-04-sofa-cerca.png',          pie: 'Un rato tranquilo, muy cerca.' },                                            // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-05-sofa-arriba.png',         pie: 'Otro rato tranquilo, vistos desde arriba.' },                                // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-06-perro-sala.png',          pie: 'En la sala, con el perro haciéndonos compañía.' },                           // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-07-filtro-perrito.png',      pie: 'Con el filtro de perrito, como siempre.' },                                  // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-08-selfie-arriba-abajo.png', pie: 'Una selfie chistosa, de cabeza.' },                                          // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-09-beso-mejilla-salon.png',  pie: 'Un beso en la mejilla, sin ocasión especial.' },                             // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-10-beso-mejilla-filtro.png', pie: 'Otro beso, esta vez con el filtro de besos por toda la cara.' }              // PENDIENTE (borrador)
  ],

  /* Razones (Capítulo 03). Una cadena por razón, se revelan una por una.
     'Porque te ríes con los ojos.' */
  razones: [],

  /* Carta (Capítulo 04). Un párrafo por elemento del arreglo.
     { saludo: 'Joss,', parrafos: ['...', '...'], firma: 'Con todo mi amor' } */
  carta: { saludo: '', parrafos: [], firma: '' },

  /* Opcional: fecha de inicio para un contador en vivo (YYYY-MM-DD). */
  inicio: null
};
