/**
 * Estructura de coordenadas de una ubicación.
 */
class Coordenadas {

  /**
   * Inicializa una nueva estructura <Coordenadas>
   * @param { string } id_coordenadas El identificador de las coordenadas
   * @param { number } latitud La latitud de las coordenadas
   * @param { number } longitud La longitud de las coordenadas
   */
  constructor( id_coordenadas, latitud, longitud ) {
    this.id_coordenadas = id_coordenadas;
    this.longitud       = longitud;
    this.latitud        = latitud;
  }
}

/**
 * Exportación de la clase.
 */
module.exports = Coordenadas;
