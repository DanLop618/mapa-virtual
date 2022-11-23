/**
 * Estructura de ubicación.
 */
class Ubicacion {

  /**
   * Inicializa una nueva estructura <Ubicacion>
   * @param { string } id_coordenadas El identificador de las coordenadas
   * @param { string } id_lugar El identificador del lugar
   * @param { string } nombre_lugar El nombre del lugar
   */
  constructor( id_coordenadas, id_lugar, nombre_lugar ) {
    this.id_coordenadas = id_coordenadas;
    this.nombre_lugar   = nombre_lugar;
    this.id_lugar       = id_lugar;
  }
}

/**
 * Exportación de la clase.
 */
module.exports = Ubicacion;
