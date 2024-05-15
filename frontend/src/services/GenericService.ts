//Probably move to other file 

export function normalizeString(value: string): string {
  return value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}