const { Schema, model } = require( "mongoose" );

// Esquema de Ubicacion.
const Coordenadas = new Schema({
  id_coordenadas: { type: String, require: true, unique: true },
  longitud:       { type: Number, require: true },
  latitud:        { type: Number, require: true }
});

module.exports = model( "coordenadas", Coordenadas );
