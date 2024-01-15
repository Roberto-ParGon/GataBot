let toM = a => '@' + a.split('@')[0];

// Almacena las respuestas de la encuesta
let encuestaRespuestas = [];

function handler(m, { groupMetadata }) {
  // Verificar si el comando es para la encuesta
  if (m.body.startsWith('!encuesta')) {
    // Obtener la respuesta del participante
    let respuesta = m.body.slice(9).trim();

    // Verificar que el participante no haya respondido antes
    if (!encuestaRespuestas.includes(m.sender)) {
      // Agregar la respuesta a la lista
      encuestaRespuestas.push(m.sender);
      m.reply(`${toM(m.sender)}, Gracias por responder la encuesta!`);
    } else {
      m.reply(`${toM(m.sender)}, Ya has respondido la encuesta anteriormente.`);
    }
  } else if (m.body.startsWith('!formarparejas')) {
    // Verificar si hay suficientes respuestas para formar parejas
    if (encuestaRespuestas.length >= 2) {
      // Seleccionar dos participantes al azar sin repetición
      let pareja1 = encuestaRespuestas.getRandom();
      let pareja2;
      do pareja2 = encuestaRespuestas.getRandom();
      while (pareja2 === pareja1);

      // Eliminar a los participantes seleccionados de la lista
      encuestaRespuestas = encuestaRespuestas.filter(id => id !== pareja1 && id !== pareja2);

      // Enviar mensaje con las parejas formadas
      m.reply(`*${toM(pareja1)}, tu pareja es ${toM(pareja2)}.*

*${toM(pareja2)}, tu pareja es ${toM(pareja1)}.*`, null, {
        mentions: [pareja1, pareja2]
      });
    } else {
      m.reply('No hay suficientes participantes para formar parejas.');
    }
  }
}

// Resto del código...


// Añadir método getRandom al prototipo de Array
Array.prototype.getRandom = function () {
  return this[Math.floor(Math.random() * this.length)];
};

handler.help = ['encuesta', 'formarparejas'];
handler.tags = ['main', 'fun'];
handler.command = ['encuesta', 'formarparejas'];
handler.group = true;
export default handler;
