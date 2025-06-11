export type CountryType = {
  name: { common: string; official: string };
  cca2: string;
  flags: { png: string; svg: string; alt?: string };
  capital?: string[];
  region?: string;
  subregion?: string;
  area?: number;
  population?: number;
  timezones?: string[];
  borders?: string[];
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  maps?: { googleMaps: string; openStreetMaps: string };
  coatOfArms?: { png?: string; svg?: string };
};

const BASE_URL = "https://restcountries.com/v3.1";

// Simple cache object
const cache: { [key: string]: CountryType[] | null } = {
  allCountries: null,
};

async function fetchCountries(endpoint: string): Promise<CountryType[]> {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`Failed to fetch: ${endpoint}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [data]; // sometimes returns single object
}

// All countries with cache
export const getAllCountries = async (): Promise<CountryType[]> => {
  if (cache.allCountries) {
    return cache.allCountries;
  }

  const countries = await fetchCountries(
    "/all?fields=name,flags,cca2,population,region"
  );
  cache.allCountries = countries;
  return countries;
};

// Other endpoints — no cache
export const getCountriesByName = (name: string) =>
  fetchCountries(`/name/${encodeURIComponent(name)}`);

export const getCountriesByFullName = (name: string) =>
  fetchCountries(`/name/${encodeURIComponent(name)}?fullText=true`);

export const getCountryByCode = (code: string) =>
  fetchCountries(`/alpha/${encodeURIComponent(code)}`);

export const getCountriesByCodes = (codes: string[]) =>
  fetchCountries(`/alpha?codes=${codes.map(encodeURIComponent).join(",")}`);

export const getCountriesByCurrency = (currency: string) =>
  fetchCountries(`/currency/${encodeURIComponent(currency)}`);

export const getCountriesByDemonym = (demonym: string) =>
  fetchCountries(`/demonym/${encodeURIComponent(demonym)}`);

export const getCountriesByLanguage = (language: string) =>
  fetchCountries(`/lang/${encodeURIComponent(language)}`);

export const getCountriesByCapital = (capital: string) =>
  fetchCountries(`/capital/${encodeURIComponent(capital)}`);

export const getCountriesByRegion = (region: string) =>
  fetchCountries(`/region/${encodeURIComponent(region)}`);

export const getCountriesBySubregion = (subregion: string) =>
  fetchCountries(`/subregion/${encodeURIComponent(subregion)}`);

export const getCountriesByTranslation = (translation: string) =>
  fetchCountries(`/translation/${encodeURIComponent(translation)}`);

export const getIndependentCountries = (status = true) =>
  fetchCountries(`/independent?status=${status}`);

// Return one correct + 4 random incorrect countries
export async function getGuessOptions(): Promise<{
  correct: CountryType;
  options: CountryType[];
}> {
  const allCountries = await getAllCountries();

  // Pick random correct country
  const correct = allCountries[Math.floor(Math.random() * allCountries.length)];

  // Filter out the correct country
  const incorrectCountries = allCountries.filter(
    (c) => c.cca2 !== correct.cca2
  );

  // Shuffle incorrect countries
  const shuffledIncorrect = incorrectCountries
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Combine correct + incorrect and shuffle again
  const options = [...shuffledIncorrect, correct].sort(
    () => 0.5 - Math.random()
  );

  return { correct, options };
}
