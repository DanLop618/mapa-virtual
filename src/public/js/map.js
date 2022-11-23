const socket = new WebSocketInterface( "wss://geolocalizacion.danlop618.repl.co" );
// const socket = new WebSocketInterface( "ws://localhost:8000" );
const mapa   = L.map( "map-container" );

// Botón de ubicación.
let current    = mapa.locate({ enableHighAccuracy: true, watch: true });
let findButton = document.getElementById( "find-location" );

// Ubicaciones y coordenadas.
const Ubicaciones = [];
const Coordenadas = [];

// Marcadores
const markers = new Map(); // <- Marcadores de conexiones.
let self = null;           // <- Marcador personal.

// Conexión exitosa y carga de datos inicial.
socket.once("open", async () => {
  console.log( "¡Conexión exitosa!" );
});

// Inicialización de datos.
socket.once("initData", ( coordenadas, ubicaciones ) => {
  Ubicaciones.push( ...ubicaciones );
  Coordenadas.push( ...coordenadas );
  for ( const coordenada of Coordenadas ) {
    const circle = L.circleMarker( [ coordenada.latitud, coordenada.longitud ] );
    const [ ubicacion ] = Ubicaciones.filter( ub => ub.id_coordenadas === coordenada.id_coordenadas );
    circle.bindPopup( ubicacion.nombre_lugar );
    mapa.addLayer( circle );
  }
});

// Actualización de posición.
socket.on("updatePosition", ( id, latitude, longitude ) => {
  if ( !markers.has( id ) ) { // Si no existe un marcador para la id recibida, se creará uno nuevo.
    let marker = L.marker( [ latitude, longitude ], { icon: ClientMarker } );
    mapa.addLayer( marker );
    markers.set( id, marker );
  } else { // Si ya hay un marcador existente, se actualizará su posición.
    let marker = markers.get( id );
    marker.removeFrom( mapa );
    marker = L.marker( [ latitude, longitude ], { icon: ClientMarker } );
    marker.addTo( mapa );
    markers.set( id, marker );
  }
});

// Desconexión de cliente externo.
socket.on("clientDisconnected", ( id ) => {
  const marker = markers.get( id );
  marker.removeFrom( mapa );
  delete markers[ id ];
});

// Localización encontrada.
mapa.on("locationfound", async ( e ) => {

  // Nuevas coordenadas
  current = e.latlng;
  updateView();

  // Marcador actualizado.
  if ( self ) self.removeFrom( mapa );
  self = L.marker( [ current.lat, current.lng ], { icon: SelfMarker } );
  self.bindPopup( "Tu Ubicación Actual" );
  self.addTo( mapa );

  // Actualización de coordenadas en el servidor.
  const data = { latitude: current.lat, longitude: current.lng };
  if ( socket.readyState ) socket.send( JSON.stringify( data, null, 2 ) );

  // Iteramos las coordenadas en busca de cercanías.
  for ( const coordenada of Coordenadas ) {

    // Valores absolutos de las longitudes y latitudes.
    const oldLat = Math.abs( coordenada.latitud  );
    const newLat = Math.abs( current.lat  );
    const oldLng = Math.abs( coordenada.longitud );
    const newLng = Math.abs( current.lng  );

    // Verificamos si la ubicación es cercana mediante una diferencia.
    if ( Math.abs( oldLat - newLat ) > 0.000025 && Math.abs( oldLng - newLng ) > 0.000025 ) return;
    const [ ubicacion ] = Ubicaciones.filter( ub => ub.id_coordenadas === coordenada.id_coordenadas );
    alert( `Estás cerca de ${ ubicacion.nombre_lugar }` );
  }
});

// Actualización de vista del mapa.
function updateView( force = false ) {
  if ( !mapa.initialized || force ) mapa.setView( [ current.lat, current.lng ], 13 );
  mapa.initialized = true;
}

// Click de botón.
findButton.onclick = ( e ) => { updateView( true ) };

// Renderización del mapa.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom:     19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo( mapa );
