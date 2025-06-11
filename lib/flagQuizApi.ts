import { getAllCountries, type CountryType } from "./restCountriesApi";

/**
 * Defines the structure for a single flag quiz question.
 */
export type GuessDataType = {
  /** The country that is the correct answer. */
  correct: CountryType;
  /** An array of 4 country options, including the correct one, shuffled randomly. */
  options: CountryType[];
};

/**
 * A utility function to shuffle an array.
 * @param array The array to be shuffled.
 * @returns A new array with the elements shuffled.
 */
function shuffleArray<T>(array: T[]): T[] {
  // Creates a new array to avoid modifying the original
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
}

/**
 * Fetches all countries and prepares a single question for the "Guess the Flag" game.
 *
 * @returns A Promise that resolves to a `GuessDataType` object.
 */
export async function getFlagQuestion(): Promise<GuessDataType> {
  const allCountries = await getAllCountries();
  const numOptions = 4; // Total number of choices (1 correct + 3 incorrect)

  if (allCountries.length < numOptions) {
    throw new Error("Not enough countries to create a quiz question.");
  }

  // 1. Select a random country to be the correct answer.
  const correctCountryIndex = Math.floor(Math.random() * allCountries.length);
  const correctCountry = allCountries[correctCountryIndex];

  // 2. Select unique incorrect options.
  const incorrectOptions: CountryType[] = [];
  const usedIndices = new Set([correctCountryIndex]); // Keep track of used countries

  while (incorrectOptions.length < numOptions - 1) {
    const randomIndex = Math.floor(Math.random() * allCountries.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      incorrectOptions.push(allCountries[randomIndex]);
    }
  }

  // 3. Combine the correct answer with the incorrect options and shuffle them.
  const options = shuffleArray([...incorrectOptions, correctCountry]);

  return {
    correct: correctCountry,
    options: options,
  };
}
