const socket = new WebSocketInterface( "wss://geolocalizacion.danlop618.repl.co" );
// const socket = new WebSocketInterface( "ws://localhost:8000" );

// Ubicaciones y coordenadas.
const Ubicaciones = [];
const Coordenadas = [];

// Conexión exitosa y carga de datos inicial.
socket.once("open", async () => {
  console.log( "¡Conexión exitosa!" );
});

// Inicialización de datos.
socket.once("initData", ( coordenadas, ubicaciones ) => {
  Ubicaciones.push( ...ubicaciones );
  Coordenadas.push( ...coordenadas );
});

// Actualización de posición.
socket.on("updatePosition", ( id, latitude, longitude ) => {
  const filas   = document.getElementById( "filas" );
  const element = getElementByAttribute( "from", id, filas );
  if ( !element ) { // Si no existen datos en la tabla para el usuario

    // Fila.
    const fila = document.createElement( 'tr' );
    fila.setAttribute( "from", id );

    // Columnas.
    const column1 = document.createElement( 'th' );
    const column2 = document.createElement( 'th' );
    const column3 = document.createElement( 'th' );
    const column4 = document.createElement( 'th' );

    // Clase de las columnas.
    column1.className = "tg-baqh";
    column2.className = "tg-baqh";
    column3.className = "tg-baqh";
    column4.className = "tg-c3ow";

    // Valores de las columnas.
    column1.textContent = id;
    column2.textContent = latitude;
    column3.textContent = longitude;
    column4.textContent = "";

    // Añadimos los valores.
    fila.appendChild( column1 );
    fila.appendChild( column2 );
    fila.appendChild( column3 );
    fila.appendChild( column4 );
    filas.appendChild( fila );

  } else { // Si hay datos existentes.
    let index = -1;
    const cercanias = obtenerCercanias( latitude, longitude );
    for ( const child of element.children ) {
      index++;
      if ( index === 0 ) continue;
      if ( index === 1 ) child.textContent = latitude;
      if ( index === 2 ) child.textContent = latitude;
      if ( index === 3 ) child.textContent = cercanias.map( ub => ub.nombre_lugar ).join( ',' );
    }
  }
});

// Obtenemos las cercanías de las ubicaciones.
function obtenerCercanias( latitude, longitude ) {
  const cercanias = [];
  latitude  = Math.abs( latitude  );
  longitude = Math.abs( longitude );
  for ( const coordenada of Coordenadas ) {
    const lat = Math.abs( coordenada.latitud  );
    const lng = Math.abs( coordenada.longitud );
    if ( Math.abs( latitude - lat ) > 0.000025 && Math.abs( longitude - lng ) > 0.000025 ) continue;
    const [ ubicacion ] = Ubicaciones.filter( ub => ub.id_coordenadas === coordenada.id_coordenadas );
    cercanias.push( ubicacion );
  }
  return cercanias;
}

// Obtenemos los elementos por el atributo y valor indicados. (Recursivo)
function getElementByAttribute( attribute, value, root ) {
  if ( root.hasAttribute( attribute ) && root.getAttribute( attribute ) === value ) return root;
  for ( const element of root.children ) {
    if ( !element.hasAttribute( attribute ) ) continue;
    if ( !element.getAttribute( attribute ) === value ) continue;
    return element;
  }
  return null;
}

// Desconexión de cliente externo.
socket.on("clientDisconnected", ( id ) => {
  const filas   = document.getElementById( "filas" );
  const element = getElementByAttribute( "from", id, filas );
  if ( !element ) return;
  for ( const child of element.children ) child.remove();
  element.remove();
});
