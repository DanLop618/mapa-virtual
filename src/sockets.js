const SchemaCoordenadas = require( "./schemas/Coordenadas.js" );
const SchemaUbicacion = require( "./schemas/Ubicacion.js" );
const uuid = require( "uuid" );

// Clientes conectados.
const clients = new Map();

module.exports = ( socket ) => {

  // Conexión de WebSocket
  socket.on("connection", async ( connection ) => {

    // Registramos la conexión.
    const id = uuid.v4();
    clients.set( id, connection );

    // Recepción de mensaje (coordenadas actualizadas).
    connection.on("message", async ( buffer ) => {

      // Creamos un objeto a partir del buffer recibido.
      const msg = JSON.parse( buffer.toString() );
      const { latitude, longitude } = msg;

      // Enviamos la actualización a todos los clientes.
      for ( const [ key, client ] of clients ) {
        if ( connection === client ) continue;
        const args = [ id, latitude, longitude ];
        const data = { event: "updatePosition", args: args };
        client.send( JSON.stringify( data, null, 2 ) );
      }
    });

    // Desconexión del cliente.
    connection.on("close", () => {
      const args = [ id ];
      const data = { event: "clientDisconnected", args: args };
      for ( const [ key, client ] of clients ) {
        if ( id === key ) continue;
        client.send( JSON.stringify( data, null, 2 ) );
      }
      delete clients[ id ];
    });

    // Coordenadas y Ubicaciones.
    const Coordenadas = await SchemaCoordenadas.find({}, { _id: false, __v: false });
    const Ubicaciones = await SchemaUbicacion.find({}, { _id: false, __v: false });

    // Enviamos los datos iniciales.
    const args = [ Coordenadas, Ubicaciones ];
    const data = { event: "initData", args: args };
    connection.send( JSON.stringify( data, null, 2 ) );
  });
}
