const { Schema, model } = require( "mongoose" );

// Esquema de Ubicacion.
const Ubicacion = new Schema({
  id_lugar:       { type: String, require: true, unique: true },
  id_coordenadas: { type: String, require: true },
  nombre_lugar:   { type: String, require: true }
});

module.exports = model( "ubicaciones", Ubicacion );
