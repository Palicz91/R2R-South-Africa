export async function getUserCountry(): Promise<string | null> {
  const cacheKey = 'userCountry';
  const cacheTimestampKey = 'userCountry_timestamp';
  const cacheTTL = 30 * 24 * 60 * 60 * 1000; // 30 nap

  try {
    const cachedCountry = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

    if (cachedCountry && cachedTimestamp) {
      const age = Date.now() - parseInt(cachedTimestamp, 10);
      if (age < cacheTTL) {
        return cachedCountry;
      }
    }

    const response = await fetch('https://ipinfo.io/json?token=53cd9f60a714e6');
    const data = await response.json();
    const country = data.country || null;

    if (country) {
      localStorage.setItem(cacheKey, country);
      localStorage.setItem(cacheTimestampKey, Date.now().toString());
    }

    return country;
  } catch (error) {
    console.error('Failed to fetch IP location:', error);
    return null;
  }
}

export function getLanguageFromCountryCode(countryCode: string): string {
  const mapping: Record<string, string> = {
    HU: 'hu',  // Magyarország
    DE: 'de',  // Németország (ha szükséges)
  };

  // Ha nem találjuk a countryCode-ot a mapping-ben, akkor 'en' (angol) lesz az alapértelmezett
  return mapping[countryCode.toUpperCase()] || 'en'; // Default: 'en'
}
