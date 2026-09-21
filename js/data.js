/* =========================================================
   TODO EL CONTENIDO DEL SITIO VIVE AQUÍ.
   Cambia textos, agrega momentos, fotos, razones y la carta
   sin tocar el resto del código.
   Las fotos van en assets/fotos/ y se referencian por ruta.
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
     { fecha: '2023-05-14', titulo: 'El primer café', frase: 'Una frase corta.', foto: 'assets/fotos/01.jpg' } */
  historia: [],

  /* Galería (Capítulo 02). Cada flor revela una foto.
     { foto: 'assets/fotos/10.jpg', pie: 'Texto opcional al pie' } */
  recuerdos: [],

  /* Razones (Capítulo 03). Una cadena por razón, se revelan una por una.
     'Porque te ríes con los ojos.' */
  razones: [],

  /* Carta (Capítulo 04). Un párrafo por elemento del arreglo.
     { saludo: 'Joss,', parrafos: ['...', '...'], firma: 'Con todo mi amor' } */
  carta: { saludo: '', parrafos: [], firma: '' },

  /* Opcional: fecha de inicio para un contador en vivo (YYYY-MM-DD). */
  inicio: null
};
