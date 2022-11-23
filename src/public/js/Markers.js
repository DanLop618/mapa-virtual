// Ícono de clientes externos.
const ClientMarker = L.icon({
  iconUrl:      "https://i.imgur.com/RkUV1wy.png",
  shadowUrl:    "https://i.imgur.com/qrfC41h.png",
  iconSize:     [  40,  40 ],
  iconAnchor:   [  40,  40 ],
  popupAnchor:  [ -20, -40 ],
  shadowSize:   [  40,  40 ],
  shadowAnchor: [  37,  40 ]
});

// Ícono propio del cliente.
const SelfMarker = L.icon({
  iconUrl:      "https://i.imgur.com/nMfZHwl.png",
  shadowUrl:    "https://i.imgur.com/qrfC41h.png",
  iconSize:     [  40,  40 ],
  iconAnchor:   [  40,  40 ],
  popupAnchor:  [ -20, -40 ],
  shadowSize:   [  40,  40 ],
  shadowAnchor: [  37,  40 ]
});

// Exportación de íconoS.
exports = SelfMarker;
exports = ClientMarker;
