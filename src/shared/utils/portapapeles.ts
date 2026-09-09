/**
 * Copia texto al portapapeles con respaldo.
 *
 * `navigator.clipboard` no está siempre disponible: falla en contextos que no
 * son seguros (http salvo localhost) y si el navegador tiene denegado el
 * permiso de escritura. Sin este envoltorio la promesa quedaba rechazada sin
 * capturar y el botón se quedaba mudo, sin avisarle nada al usuario.
 *
 * Devuelve true sólo si el texto quedó realmente copiado.
 */
export const copiarAlPortapapeles = async (texto: string): Promise<boolean> => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // Se sigue con el método viejo en lugar de cortar acá.
  }

  try {
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    // Fuera de la vista pero seleccionable: si estuviera en display:none o con
    // visibility:hidden, execCommand no copia nada.
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const copiado = document.execCommand("copy");
    document.body.removeChild(area);
    return copiado;
  } catch {
    return false;
  }
};
