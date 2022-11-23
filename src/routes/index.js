const router = require( "express" ).Router();

// Ruta principal.
router.get("/", ( req, res ) => {
  res.render( "index" );
});

// Ruta de administrador.
router.get("/admin", ( req, res ) => {
  res.render( "admin" );
});

// Exportación de las rutas de acceso.
module.exports = router;
