// Datos ficticios de la demo.
export const PRECIO = 400; // $/hora → 2h mínimo = $800 MXN

export const ACOMP = [
  { id: 1, nombre: 'Valeria Huerta Hernández', edad: 34, foto: require('../../assets/foto de perfil.webp'), rating: 4.9, serv: 214, tags: ['Paciente', 'Trámites', 'Maneja auto'], bio: 'Estudió gerontología. Le encanta platicar de música y futbol.', x: 0.22, y: 0.3 },
  { id: 2, nombre: 'Meredith Pamela Huesca Elías', edad: 41, foto: require('../../assets/foto de perfil.webp'), rating: 4.8, serv: 189, tags: ['Cariñosa', 'Citas médicas', 'Cocina'], bio: 'Enfermera técnica jubilada. Acompaña con calma y cariño.', x: 0.68, y: 0.22 },
  { id: 3, nombre: 'Paulina Alejandra Díaz Cebada', edad: 29, foto: require('../../assets/foto de perfil.webp'), rating: 4.7, serv: 97, tags: ['Divertido', 'Paseos', 'Tecnología'], bio: 'Ayuda con celulares y apps. Ideal para paseos y actividades.', x: 0.45, y: 0.5 },
  { id: 4, nombre: 'Vanessa Cuautle Coyac', edad: 52, foto: require('../../assets/foto de perfil.webp'), rating: 5.0, serv: 302, tags: ['Muy puntual', 'Misa', 'Reuniones'], bio: 'Más de 10 años acompañando adultos mayores en familia.', x: 0.8, y: 0.48 },
  { id: 5, nombre: 'Maria Jose Hernández Sánchez', edad: 31, foto: require('../../assets/foto de perfil.webp'), rating: 4.9, serv: 120, tags: ['Alegre', 'Paseos', 'Juegos de mesa'], bio: 'Le encantan los juegos de mesa, el café y las buenas pláticas.', x: 0.58, y: 0.12 },
];

export const ACTS = [
  { id: 'tramites', n: 'Trámites', i: '📄' },
  { id: 'medica', n: 'Cita médica', i: '🩺' },
  { id: 'paseo', n: 'Paseo', i: '🌳' },
  { id: 'familia', n: 'Reunión familiar', i: '👨‍👩‍👧' },
  { id: 'compras', n: 'Compras', i: '🛒' },
  { id: 'otro', n: 'Otra cosa', i: '✨' },
];

export const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00'];
export const DS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const MS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const dias = () => Array.from({ length: 90 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return { k: i, d: DS[d.getDay()], n: d.getDate(), m: MS[d.getMonth()], mes: d.getMonth(), anio: d.getFullYear(), fecha: d };
});

export const money = (n) => `$${n.toFixed(2)}`;
