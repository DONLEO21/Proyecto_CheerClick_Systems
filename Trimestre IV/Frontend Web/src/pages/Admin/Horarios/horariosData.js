// src/pages/Admin/horariosData.js
// Constantes y funciones auxiliares (formato de fechas, días, moneda...).
// Los datos en sí (niveles y torneos) ahora vienen de src/services/horariosApi.js

export const etiquetaDias = {
  lun: "Lunes",
  mar: "Martes",
  mie: "Miércoles",
  jue: "Jueves",
  vie: "Viernes",
  sab: "Sábados",
  dom: "Domingos",
};

export const diasSemana = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];

export const nivelesCompetencia = [
  { valor: "queen", etiqueta: "Blood Tigers Queen (Nivel 1 Youth)" },
  { valor: "princess", etiqueta: "Blood Tigers Princess (Nivel 1 Youth)" },
  { valor: "magic", etiqueta: "Blood Tiger Magic (Nivel 3 Open)" },
  { valor: "blood", etiqueta: "Blood Tigers Cheer (Nivel 4 Open Large)" },
];

// Convierte ['mar','jue','sab'] -> "Martes, Jueves y Sábados"
export function formatearDias(dias) {
  if (!dias || !dias.length) return "";
  const et = dias.map((d) => etiquetaDias[d] || d);
  if (et.length === 1) return et[0];
  const ultimo = et[et.length - 1];
  return et.slice(0, -1).join(", ") + " y " + ultimo;
}

// Formatea una fecha ISO (yyyy-mm-dd) a "17 de mayo"
export function formatearFechaCorta(iso) {
  if (!iso) return "";
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} de ${meses[m - 1]}`;
}

export function formatearMoneda(valor) {
  const num = Number(valor) || 0;
  return "$" + num.toLocaleString("es-CO");
}

// Conteo de competencias activas por nivel (para las sub-pestañas)
export function contarPorNivel(torneos, nivel) {
  return torneos.filter((t) => t.nivel === nivel && !t.inhabilitada).length;
}

/**
 * Redimensiona y comprime una imagen en el navegador antes de guardarla.
 * json-server rechaza peticiones mayores a ~100 KB, y una foto sin procesar
 * convertida a base64 las supera fácilmente. Devuelve un data URL liviano.
 *
 * @param {File} file        archivo del input
 * @param {number} maxAncho  ancho máximo en píxeles
 * @param {number} calidad   0 a 1 (0.7 es buen balance)
 */
export function comprimirImagen(file, maxAncho = 600, calidad = 0.7) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();

    lector.onerror = () => reject(new Error("No se pudo leer el archivo."));
    lector.onload = (ev) => {
      const img = new Image();

      img.onerror = () => reject(new Error("El archivo no es una imagen válida."));
      img.onload = () => {
        // Calcula el nuevo tamaño manteniendo la proporción
        const escala = Math.min(1, maxAncho / img.width);
        const ancho = Math.round(img.width * escala);
        const alto = Math.round(img.height * escala);

        const canvas = document.createElement("canvas");
        canvas.width = ancho;
        canvas.height = alto;
        canvas.getContext("2d").drawImage(img, 0, 0, ancho, alto);

        // JPEG comprimido: mucho más liviano que PNG para fotos
        resolve(canvas.toDataURL("image/jpeg", calidad));
      };

      img.src = ev.target.result;
    };

    lector.readAsDataURL(file);
  });
}
