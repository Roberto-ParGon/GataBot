let toM = (a) => "@" + a.split("@")[0];
let encuestaParticipantes = [];

function handler(m, { groupMetadata }) {
  // Verificar si el mensaje tiene contenido
  if (!m.body) {
    console.log("El mensaje no tiene contenido.");
    return;
  }

  if (m.body.startsWith("!encuesta")) {
    // Iniciar la encuesta y almacenar participantes
    encuestaParticipantes = groupMetadata.participants.map((v) => v.id);
    m.reply("¡Encuesta iniciada! Responde a este mensaje para participar.");
  } else if (m.body.startsWith("!formarparejas")) {
    // Verificar si hay suficientes participantes para formar parejas
    if (encuestaParticipantes.length < 2) {
      m.reply("No hay suficientes participantes para formar parejas.");
      return;
    }

    // Seleccionar dos participantes aleatorios sin repetición
    let pareja1 = encuestaParticipantes.getRandom();
    let pareja2;
    do pareja2 = encuestaParticipantes.getRandom();
    while (pareja2 === pareja1);

    // Eliminar a los participantes seleccionados de la lista
    encuestaParticipantes = encuestaParticipantes.filter(
      (id) => id !== pareja1 && id !== pareja2
    );

    // Enviar mensaje con las parejas formadas
    m.reply(
      `*${toM(pareja1)}, tu pareja es ${toM(pareja2)}.*

*${toM(pareja2)}, tu pareja es ${toM(pareja1)}.*`,
      null,
      {
        mentions: [pareja1, pareja2],
      }
    );
  } else if (encuestaParticipantes.includes(m.sender)) {
    // Almacenar participantes que respondieron a la encuesta
    encuestaParticipantes = encuestaParticipantes.filter(
      (id) => id !== m.sender
    );
    m.reply(`¡Gracias por participar en la encuesta, ${toM(m.sender)}!`);
  }
}

// Resto del código...

// Añadir método getRandom al prototipo de Array
Array.prototype.getRandom = function () {
  return this[Math.floor(Math.random() * this.length)];
};

handler.help = ["encuesta", "formarparejas"];
handler.tags = ["main", "fun"];
handler.command = ["encuesta", "formarparejas"];
handler.group = true;
export default handler;
