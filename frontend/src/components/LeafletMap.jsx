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

export default function LeafletMap({
  center,
  zoom = 14,
  markers = [],
  className = 'h-72 w-full',
  scrollWheelZoom = false,
}) {
  const containerRef = useRef(null);
  const markersKey = JSON.stringify(markers);

  useEffect(() => {
    if (!containerRef.current || !center) return undefined;

    const map = L.map(containerRef.current, { center, zoom, scrollWheelZoom });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    markers.forEach(({ position, label }) => {
      const marker = L.marker(position).addTo(map);
      if (label) marker.bindPopup(label);
    });

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.[0], center?.[1], zoom, markersKey, scrollWheelZoom]);

  return <div ref={containerRef} className={`${className} rounded-2xl`} />;
}
