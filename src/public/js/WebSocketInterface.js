class WebSocketInterface extends WebSocket {

  /**
   * Inicialización de una nueva interfaz de WebSocket.
   * @param { string } host La dirección hosting del WebSocket.
   */
  constructor( host ) {
    super( host );
    this.listeners = new Map();
    this.addEventListener( "open", ( args ) => { this.emit( "open", args ) } );
    this.addEventListener( "message", this.#manage );
  }

  /**
   * Event manager del WebSocket.
   * @param { object } msg El mensaje recibido.
   */
  #manage( msg ) {
    const data = JSON.parse( msg.data );
    const { event, args } = data;
    this.emit( event, ...args );
  }

  /**
   * Emisión de un evento
   * @param { string } e El evento a emitir.
   * @param { * } args Argumentos recibidos.
   */
  emit( e, ...args ) {
    if ( !this.listeners.has( e ) ) return;
    const listener = this.listeners.get( e );
    listener.callback( ...args );
    if ( listener.once ) delete this.listeners[ e ];
  }

  /**
   * Añadimos un listener de evento.
   * @param { string } e El evento a escuchar indefinidamente.
   * @param { function } callback La función a ejecutar.
   */
  on( e, callback ) {
    const listener = { callback: callback, once: false };
    this.listeners.set( e, listener );
  }

  /**
   * Añadimos un listener de evento que solo se ejecutará una vez.
   * @param { string } e El evento a escuchar indefinidamente.
   * @param { function } callback La función a ejecutar.
   */
  once( e, callback ) {
    const listener = { callback: callback, once: true };
    this.listeners.set( e, listener );
  }

  /**
   * Desvincula unnlistener de evento.
   * @param { string } e El evento a desvincular,
   */
  unbind( e ) {
    if ( !this.listeners.has( e ) ) return;
    delete this.listeners[ e ];
  }
}

// Exportación de módulo
exports = WebSocketInterface;
