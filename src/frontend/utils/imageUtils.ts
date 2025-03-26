
/**
 * Normalizza un URL di immagine per assicurare che sia completo
 * Se l'URL è già assoluto (inizia con http:// o https://) lo restituisce invariato
 * Altrimenti, assume che sia un percorso relativo e lo converte in un URL completo
 * 
 * @param imagePath Il percorso dell'immagine da normalizzare
 * @returns L'URL normalizzato dell'immagine
 */
export const normalizeImageUrl = (imagePath: string): string => {
  if (!imagePath) return "/placeholder.svg";
  
  // Se inizia con http:// o https://, è già un URL completo
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  // Se inizia con /, è già un percorso relativo alla root
  if (imagePath.startsWith("/")) {
    return imagePath;
  }
  
  // Altrimenti, aggiungi / davanti
  return `/${imagePath}`;
};
