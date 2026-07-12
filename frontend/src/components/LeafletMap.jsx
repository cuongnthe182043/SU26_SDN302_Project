import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const buildAvatarIcon = (avatarUrl) => {
  const wrapper = document.createElement('div');
  wrapper.className =
    'h-10 w-10 overflow-hidden rounded-full border-2 border-emerald-400 bg-slate-800 shadow-lg';
  const img = document.createElement('img');
  img.src = avatarUrl;
  img.alt = '';
  img.className = 'h-full w-full object-cover';
  img.onerror = () => {
    img.style.display = 'none';
  };
  wrapper.appendChild(img);
  return L.divIcon({
    html: wrapper,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  });
};

export default function LeafletMap({
  center,
  zoom = 14,
  markers = [],
  className = 'h-72 w-full',
  scrollWheelZoom = false,
  fitToMarkers = false,
}) {
  const containerRef = useRef(null);
  const markersKey = JSON.stringify(markers);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    if (!center && markers.length === 0) return undefined;

    const map = L.map(containerRef.current, {
      center: center || markers[0].position,
      zoom,
      scrollWheelZoom,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const leafletMarkers = markers.map(({ position, label, avatarUrl }) => {
      const marker = L.marker(position, avatarUrl ? { icon: buildAvatarIcon(avatarUrl) } : undefined).addTo(map);
      if (label) marker.bindPopup(label);
      return marker;
    });

    if (fitToMarkers && leafletMarkers.length > 1) {
      map.fitBounds(L.featureGroup(leafletMarkers).getBounds(), { padding: [32, 32], maxZoom: 15 });
    } else if (fitToMarkers && leafletMarkers.length === 1) {
      map.setView(markers[0].position, zoom);
    }

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.[0], center?.[1], zoom, markersKey, scrollWheelZoom, fitToMarkers]);

  return <div ref={containerRef} className={`${className} rounded-2xl`} />;
}
