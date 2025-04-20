// Utility to fetch lat/lon and timezone offset from a city name using Nominatim and AI fallback
import fetch from 'node-fetch';

// Use a simple AI-based mapping for common cities/countries as fallback for timezone
const simpleTimezones: {[country: string]: number} = {
  "zambia": 2,
  "kenya": 3,
  "nigeria": 1,
  "south africa": 2,
  "india": 5.5,
  "usa": -5, // default EST
  "canada": -5,
  "uk": 0,
  "germany": 1,
  "france": 1,
  // Add more as needed
};

export async function geocodeCity(city: string): Promise<{lat: number, lon: number, timezone: number} | null> {
  // 1. Get lat/lon from Nominatim
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
  const geoRes = await fetch(nominatimUrl, { headers: { 'User-Agent': 'astroclock-app' } });
  const geoData = await geoRes.json();
  if (!geoData || !geoData[0]) return null;
  const lat = parseFloat(geoData[0].lat);
  const lon = parseFloat(geoData[0].lon);

  // 2. Try to extract country from result and map to timezone
  let country = geoData[0].display_name?.split(',').pop()?.trim().toLowerCase() || '';
  let timezone = simpleTimezones[country] ?? 0;
  // If not found, try to guess from city string
  if (!timezone) {
    for (const key in simpleTimezones) {
      if (city.toLowerCase().includes(key)) {
        timezone = simpleTimezones[key];
        break;
      }
    }
  }
  return { lat, lon, timezone };
}
