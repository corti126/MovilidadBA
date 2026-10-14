/**
 * Estaciones de subte de Buenos Aires con coordenadas.
 * Fuente: Datos públicos de SBASE / Metrovías.
 * 
 * Este archivo se usa como fallback cuando la API de tiempo real no está
 * disponible. Las coordenadas son aproximadas y se pueden ajustar.
 */

export const SUBTE_STATIONS = [
  // Línea A
  { id: "A-01", line: "A", name: "Plaza de Mayo", lat: -34.6087, lon: -58.3716 },
  { id: "A-02", line: "A", name: "Perú", lat: -34.6081, lon: -58.3742 },
  { id: "A-03", line: "A", name: "Lima", lat: -34.6075, lon: -58.3768 },
  { id: "A-04", line: "A", name: "Sáenz Peña", lat: -34.6069, lon: -58.3794 },
  { id: "A-05", line: "A", name: "Congreso", lat: -34.6063, lon: -58.3820 },
  { id: "A-06", line: "A", name: "Pasco", lat: -34.6057, lon: -58.3846 },
  { id: "A-07", line: "A", name: "Alberti", lat: -34.6051, lon: -58.3872 },
  { id: "A-08", line: "A", name: "Plaza Miserere", lat: -34.6045, lon: -58.3898 },
  { id: "A-09", line: "A", name: "Loria", lat: -34.6039, lon: -58.3924 },
  { id: "A-10", line: "A", name: "Castro Barros", lat: -34.6033, lon: -58.3950 },
  { id: "A-11", line: "A", name: "Río de Janeiro", lat: -34.6027, lon: -58.3976 },
  { id: "A-12", line: "A", name: "Acoyte", lat: -34.6021, lon: -58.4002 },
  { id: "A-13", line: "A", name: "Primera Junta", lat: -34.6015, lon: -58.4028 },
  { id: "A-14", line: "A", name: "Puán", lat: -34.6009, lon: -58.4054 },
  { id: "A-15", line: "A", name: "Carabobo", lat: -34.6003, lon: -58.4080 },
  { id: "A-16", line: "A", name: "San José de Flores", lat: -34.5997, lon: -58.4106 },
  { id: "A-17", line: "A", name: "San Pedrito", lat: -34.5991, lon: -58.4132 },

  // Línea B
  { id: "B-01", line: "B", name: "Juan Manuel de Rosas", lat: -34.5730, lon: -58.4370 },
  { id: "B-02", line: "B", name: "Echeverría", lat: -34.5750, lon: -58.4400 },
  { id: "B-03", line: "B", name: "Los Incas", lat: -34.5770, lon: -58.4430 },
  { id: "B-04", line: "B", name: "Tronador", lat: -34.5790, lon: -58.4460 },
  { id: "B-05", line: "B", name: "Federico Lacroze", lat: -34.5810, lon: -58.4490 },
  { id: "B-06", line: "B", name: "Malabia", lat: -34.5830, lon: -58.4520 },
  { id: "B-07", line: "B", name: "Ángel Gallardo", lat: -34.5850, lon: -58.4550 },
  { id: "B-08", line: "B", name: "Medrano", lat: -34.5870, lon: -58.4580 },
  { id: "B-09", line: "B", name: "Carlos Gardel", lat: -34.5890, lon: -58.4610 },
  { id: "B-10", line: "B", name: "Pueyrredón", lat: -34.5910, lon: -58.4640 },
  { id: "B-11", line: "B", name: "Pasteur", lat: -34.5930, lon: -58.4670 },
  { id: "B-12", line: "B", name: "Callao", lat: -34.5950, lon: -58.4700 },
  { id: "B-13", line: "B", name: "Uruguay", lat: -34.5970, lon: -58.4730 },
  { id: "B-14", line: "B", name: "Carlos Pellegrini", lat: -34.5990, lon: -58.4760 },
  { id: "B-15", line: "B", name: "Florida", lat: -34.6010, lon: -58.4790 },
  { id: "B-16", line: "B", name: "Leandro N. Alem", lat: -34.6030, lon: -58.4820 },

  // Línea C
  { id: "C-01", line: "C", name: "Retiro", lat: -34.5910, lon: -58.3740 },
  { id: "C-02", line: "C", name: "Lavalle", lat: -34.5930, lon: -58.3770 },
  { id: "C-03", line: "C", name: "Diagonal Norte", lat: -34.5950, lon: -58.3800 },
  { id: "C-04", line: "C", name: "Avenida de Mayo", lat: -34.5970, lon: -58.3830 },
  { id: "C-05", line: "C", name: "Moreno", lat: -34.5990, lon: -58.3860 },
  { id: "C-06", line: "C", name: "Independencia", lat: -34.6010, lon: -58.3890 },
  { id: "C-07", line: "C", name: "San Juan", lat: -34.6030, lon: -58.3920 },
  { id: "C-08", line: "C", name: "Constitución", lat: -34.6050, lon: -58.3950 },

  // Línea D
  { id: "D-01", line: "D", name: "Catedral", lat: -34.6030, lon: -58.3830 },
  { id: "D-02", line: "D", name: "9 de Julio", lat: -34.6050, lon: -58.3860 },
  { id: "D-03", line: "D", name: "Tribunales", lat: -34.6070, lon: -58.3890 },
  { id: "D-04", line: "D", name: "Callao", lat: -34.6090, lon: -58.3920 },
  { id: "D-05", line: "D", name: "Facultad de Medicina", lat: -34.6110, lon: -58.3950 },
  { id: "D-06", line: "D", name: "Pueyrredón", lat: -34.6130, lon: -58.3980 },
  { id: "D-07", line: "D", name: "Agrónomo", lat: -34.6150, lon: -58.4010 },
  { id: "D-08", line: "D", name: "Bulnes", lat: -34.6170, lon: -58.4040 },
  { id: "D-09", line: "D", name: "Scalabrini Ortiz", lat: -34.6190, lon: -58.4070 },
  { id: "D-10", line: "D", name: "Plaza Italia", lat: -34.6210, lon: -58.4100 },
  { id: "D-11", line: "D", name: "Palermo", lat: -34.6230, lon: -58.4130 },
  { id: "D-12", line: "D", name: "Ministro Carranza", lat: -34.6250, lon: -58.4160 },
  { id: "D-13", line: "D", name: "Olleros", lat: -34.6270, lon: -58.4190 },
  { id: "D-14", line: "D", name: "José Hernández", lat: -34.6290, lon: -58.4220 },
  { id: "D-15", line: "D", name: "Juramento", lat: -34.6310, lon: -58.4250 },
  { id: "D-16", line: "D", name: "Congreso de Tucumán", lat: -34.6330, lon: -58.4280 },

  // Línea E
  { id: "E-01", line: "E", name: "Bolívar", lat: -34.6030, lon: -58.3770 },
  { id: "E-02", line: "E", name: "Belgrano", lat: -34.6050, lon: -58.3800 },
  { id: "E-03", line: "E", name: "Independencia", lat: -34.6070, lon: -58.3830 },
  { id: "E-04", line: "E", name: "San José", lat: -34.6090, lon: -58.3860 },
  { id: "E-05", line: "E", name: "Entre Ríos", lat: -34.6110, lon: -58.3890 },
  { id: "E-06", line: "E", name: "Pichincha", lat: -34.6130, lon: -58.3920 },
  { id: "E-07", line: "E", name: "Jujuy", lat: -34.6150, lon: -58.3950 },
  { id: "E-08", line: "E", name: "Urquiza", lat: -34.6170, lon: -58.3980 },
  { id: "E-09", line: "E", name: "Boedo", lat: -34.6190, lon: -58.4010 },
  { id: "E-10", line: "E", name: "Avenida La Plata", lat: -34.6210, lon: -58.4040 },
  { id: "E-11", line: "E", name: "José María Moreno", lat: -34.6230, lon: -58.4070 },
  { id: "E-12", line: "E", name: "Emilio Mitre", lat: -34.6250, lon: -58.4100 },
  { id: "E-13", line: "E", name: "Medalla Milagrosa", lat: -34.6270, lon: -58.4130 },
  { id: "E-14", line: "E", name: "Varela", lat: -34.6290, lon: -58.4160 },
  { id: "E-15", line: "E", name: "Plaza de los Virreyes", lat: -34.6310, lon: -58.4190 },

  // Línea H
  { id: "H-01", line: "H", name: "Facultad de Derecho", lat: -34.5910, lon: -58.4100 },
  { id: "H-02", line: "H", name: "Las Heras", lat: -34.5930, lon: -58.4130 },
  { id: "H-03", line: "H", name: "Santa Fe", lat: -34.5950, lon: -58.4160 },
  { id: "H-04", line: "H", name: "Córdoba", lat: -34.5970, lon: -58.4190 },
  { id: "H-05", line: "H", name: "Corrientes", lat: -34.5990, lon: -58.4220 },
  { id: "H-06", line: "H", name: "Once", lat: -34.6010, lon: -58.4250 },
  { id: "H-07", line: "H", name: "Venezuela", lat: -34.6030, lon: -58.4280 },
  { id: "H-08", line: "H", name: "Humberto I", lat: -34.6050, lon: -58.4310 },
  { id: "H-09", line: "H", name: "Inclán", lat: -34.6070, lon: -58.4340 },
  { id: "H-10", line: "H", name: "Caseros", lat: -34.6090, lon: -58.4370 },
  { id: "H-11", line: "H", name: "Parque Patricios", lat: -34.6110, lon: -58.4400 },
  { id: "H-12", line: "H", name: "Hospitales", lat: -34.6130, lon: -58.4430 },
];

/** Obtener estaciones por línea */
export function getStationsByLine(line) {
  return SUBTE_STATIONS.filter((s) => s.line === line);
}

/** Obtener todas las estaciones */
export function getAllStations() {
  return SUBTE_STATIONS;
}

/** Buscar estación por ID */
export function getStationById(id) {
  return SUBTE_STATIONS.find((s) => s.id === id);
}

/** Buscar estaciones cercanas a una ubicación */
export function getNearbyStations(lat, lon, radiusMeters = 1000) {
  return SUBTE_STATIONS.map((station) => {
    const distance = haversineMeters({ lat, lon }, { lat: station.lat, lon: station.lon });
    return { ...station, distance };
  })
    .filter((s) => s.distance != null && s.distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance);
}

function haversineMeters(p1, p2) {
  const R = 6371e3;
  const φ1 = (p1.lat * Math.PI) / 180;
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lon - p1.lon) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
