// Íconos de Leaflet para web. Los íconos default de Leaflet no se empaquetan
// bien en Expo web (sus imágenes quedan en 404), así que usamos divIcon.
import { divIcon } from 'leaflet';

function uriDeAsset(foto) {
  if (!foto) return null;
  return typeof foto === 'string' ? foto : foto.uri || String(foto);
}

function iconoEmoji(emoji) {
  return divIcon({
    className: '',
    html: `<div style="font-size:26px;line-height:30px;text-align:center">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export function iconoPin(p) {
  const uri = uriDeAsset(p && p.foto);
  if (!uri) return iconoEmoji((p && p.e) || '📍');
  const borde = (p && p.color) || '#FFFFFF';
  return divIcon({
    className: '',
    html: `<div style="width:42px;height:42px;border-radius:21px;background:#fff;border:3px solid ${borde};display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.25)"><img src="${encodeURI(uri)}" alt="" style="width:36px;height:36px;border-radius:18px;object-fit:cover;display:block"/></div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

export const ICONO_YO = divIcon({
  className: '',
  html: '<div style="width:18px;height:18px;border-radius:9px;background:#4285F4;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
