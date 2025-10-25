export function dateReseter(input, format) {
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date)) return input;

  if(format === 'hh:mm'){
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  if(format === 'dd-mm-yyy'){
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: 'UTC',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }
}
