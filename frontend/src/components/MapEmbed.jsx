export default function MapEmbed({ contact }) {
  const [lng, lat] = contact?.location?.coordinates || [];
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY;
  if (lng === undefined || lat === undefined || !apiKey) return null;

  const src = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=14`;
  return (
    <iframe
      title="Contact location"
      src={src}
      className="h-72 w-full rounded-2xl border-0"
      loading="lazy"
    />
  );
}
