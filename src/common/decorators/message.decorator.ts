export class Message {

    static MAX_LENGTH = (field, len) =>
      `La longitud de ${field} debe ser menor o igual a ${len} caracteres`;
  
    static MIN_LENGTH = (field, len) =>
      `La longitud de ${field} debe ser mayor a ${len} caracteres`;
  
    static LENGTH = (field, len) =>
      `La longitud de ${field} debe ser entre ${len.split(' ')[0]} y ${
        len.split(' ')[1]
      } caracteres`;
  
    static MIN = (field, val) =>
      `El valor mínimo permitido para ${field} es ${val}`;
  
    static MAX = (field, val) =>
      `El valor máximo permitido para ${field} es ${val}`;
  
    static POSITIVE = (field) => `${field} debe ser un número positivo`;
  
    static MAX_NUMBER = (field, val) =>
      `El valor máximo permitido para ${field} es ${val}`;
  
    static STRING = (field) => `${field} debe ser una cadena`;
  
    static NUMBER = (field) => `${field} debe ser un número`;
    
    static BOOLEAN = (field) => `${field} debe ser un booleano`;

    static INT = (field) => `${field} debe ser un valor entero`;

    static ARRAY = (field) => `${field} debe ser un array [{....}]`;

    static EMAIL = (field) => `${field} debe ser un email`;

    static REQUIRED = (field) => `${field} es un campo requerido`;
  
    static ALREADY_EXISTS = () => `Este objeto ya existe`;
  
    static IsDate = (field) => `El valor para ${field} debe ser una instancia de fecha.`;
  
}