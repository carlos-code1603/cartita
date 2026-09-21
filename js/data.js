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
    razones:   { num: 'Capítulo 03', titulo: 'Razones',          sub: 'Lo que quiero que sepas.' },
    carta:     { num: 'Capítulo 04', titulo: 'Carta para ti',    sub: 'Sin distracciones. Solo lo que quiero decirte.' }
  },

  /* Línea de tiempo (Capítulo 01). En orden cronológico.
     { fecha: '2023-05-14', titulo: 'El primer café', frase: 'Una frase corta.', foto: 'assets/fotos/historia/01.jpg' }
     ⚠ PENDIENTE DE REVISIÓN: las fechas, títulos y frases de abajo son
       placeholders. Sustitúyelos por los reales antes de publicar. */
  historia: [
    {
      fecha: 'PENDIENTE — pon la fecha real',            // PENDIENTE
      titulo: 'PENDIENTE — título del momento',           // PENDIENTE
      frase: 'Un evento especial, los dos arreglados, con la escalinata de flores blancas de fondo.', // PENDIENTE (borrador)
      foto: 'assets/fotos/historia/historia-01-evento-formal.jpg'
    },
    {
      fecha: 'PENDIENTE — pon la fecha real',            // PENDIENTE
      titulo: 'PENDIENTE — título del momento',           // PENDIENTE
      frase: 'El mismo momento, un poco más de cerca.',   // PENDIENTE (borrador)
      foto: 'assets/fotos/historia/historia-02-evento-formal-closeup.jpg'
    }
  ],

  /* Galería (Capítulo 02). Cada flor revela una foto.
     { foto: 'assets/fotos/recuerdos/10.jpg', pie: 'Texto opcional al pie' }
     ⚠ PENDIENTE DE REVISIÓN: los pies de foto son un borrador descriptivo,
       no los recuerdos reales. Cámbialos por lo que ustedes vivieron. */
  recuerdos: [
    { foto: 'assets/fotos/recuerdos/recuerdo-01-selfie-gorro.jpg',        pie: 'Una foto muy de cerca, así de simple.' },                                    // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-02-cena-collar-girasol.jpg', pie: 'Una comida juntos, y ese dije de girasol que le queda perfecto al sitio.' }, // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-03-selfie-noche.jpg',        pie: 'Una noche cualquiera, haciendo caras.' },                                    // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-04-sofa-cerca.jpg',          pie: 'Un rato tranquilo, muy cerca.' },                                            // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-05-sofa-arriba.jpg',         pie: 'Otro rato tranquilo, vistos desde arriba.' },                                // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-06-perro-sala.jpg',          pie: 'En la sala, con el perro haciéndonos compañía.' },                           // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-07-filtro-perrito.jpg',      pie: 'Con el filtro de perrito, como siempre.' },                                  // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-08-selfie-arriba-abajo.jpg', pie: 'Una selfie chistosa, de cabeza.' },                                          // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-09-beso-mejilla-salon.jpg',  pie: 'Un beso en la mejilla, sin ocasión especial.' },                             // PENDIENTE (borrador)
    { foto: 'assets/fotos/recuerdos/recuerdo-10-beso-mejilla-filtro.jpg', pie: 'Otro beso, esta vez con el filtro de besos por toda la cara.' }              // PENDIENTE (borrador)
  ],

  /* Razones (Capítulo 03). Una cadena por razón.
     Con una sola, se muestra centrada y en grande.
     Con varias, se revelan una por una al tocar "Otra razón". */
  razones: [
    'La razón por la que hice esto es para que no te falte algo amarillo, ya que eres un girasol, mi vida — te regalo todos los girasoles del mundo :3'
  ],

  /* Carta (Capítulo 04). Un párrafo por elemento del arreglo.
     Si dejas 'firma' vacía, simplemente no se muestra. */
  carta: {
    saludo: 'Mi niña,',
    parrafos: [
      'Todo va a salir bien. Sí, te quiero y te amo, te adoro mucho, hermosa.',
      'Vamos a echarle muchas ganas los dos, shi y vamos a salir adelante. Nunca te rindas, mi niña hermosa de mi alma :3'
    ],
    firma: ''
  },

  /* Opcional: fecha de inicio para un contador en vivo (YYYY-MM-DD). */
  inicio: null
};
