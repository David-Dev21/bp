// Formateador de fechas
export const formateadorFecha = {
  // Formato DD/MM/AAAA para mostrar al usuario
  formatearFechaLocal: (fecha: Date): string => {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  },

  // Formato largo en español: "12 de septiembre de 2000"
  formatearFechaLarga: (fecha: Date): string => {
    const nombresMeses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    const dia = fecha.getDate();
    const mes = nombresMeses[fecha.getMonth()];
    const año = fecha.getFullYear();

    return `${dia} de ${mes} de ${año}`;
  },

  // Formato AAAA-MM-DD para enviar al servidor
  formatearFechaISO: (fecha: Date): string => {
    return fecha.toISOString().split('T')[0];
  },

  // Parsear fecha desde string DD/MM/AAAA
  parsearFecha: (fechaStr: string): Date => {
    const [dia, mes, año] = fechaStr.split('/').map(Number);
    return new Date(año, mes - 1, dia);
  },
};
