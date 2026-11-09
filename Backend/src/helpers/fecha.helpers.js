export const esFechaISO = (f) =>
    typeof f === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(f) && !Number.isNaN(Date.parse(f));

// Fecha de hoy en Colombia (evita que un servidor en UTC cambie el día)
export const hoyISO = () =>
    new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());

// 'YYYY-MM-DD' -> Date a mediodía de Colombia (no se corre de día)
export const fechaADate = (iso) => new Date(`${iso}T12:00:00-05:00`);

export const tamanoLegible = (bytes) =>
    bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;