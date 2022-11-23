const { WebSocketServer } = require( "ws" );
const { createServer } = require( "http" );
const { join } = require( "path" );
const mongoose = require( "mongoose" );
const express  = require( "express" );
const engine   = require( "ejs-mate" );
const http     = require( "http" );

// Conexión a MongoDB
require( "dotenv" ).config();
mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
}).then(() => {
  console.log( `¡Conexión a MongoDB realizada con éxito!` );
}).catch(err => {
  console.error( `Conexión a MongoDB fallida: ${ err }` );
});

// Inicialización de WebSocket
const app    = express();
const server = createServer( app );
const socket = new WebSocketServer({ server });

// Configuración del servidor.
app.engine( "ejs", engine );
app.set( "view engine", "ejs" );
app.set( "views", join( __dirname, "views" ) );
app.use( express.static( join( __dirname, "public" ) ) );

// Rutas de solicitudes
const routes = require( "./routes" );
require( "./sockets" )( socket );
app.use( routes );

// Inicialización del servidor (no WebSocket).
server.listen(8000, () => {
  console.log( `Servidor Inicializado en puerto 8000` );
});
