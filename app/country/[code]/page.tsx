import { getCountryByCode } from "@/lib/restCountriesApi";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

// Lucide React Icons
import {
  ArrowLeft,
  Landmark,
  Globe,
  MapPin,
  Ruler,
  Users,
  Languages,
  CircleDollarSign,
  Download,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

// A versatile helper component for displaying labeled information with an icon.
// This approach keeps our main JSX clean and consistent.
const InfoItem = ({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) => (
  <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
    <div className="mt-1 text-muted-foreground">{icon}</div>
    <div className="flex-1">
      <p className="font-semibold text-card-foreground">{label}</p>
      <div className="text-muted-foreground">{children || "N/A"}</div>
    </div>
  </div>
);

export default async function CountryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const countryData = await getCountryByCode(code);

  // If no country is found, render the 404 page for a better user experience.
  if (!countryData.length) {
    notFound();
  }

  const country = countryData[0];

  // Fetch full names for border countries to display instead of just codes.
  const borderCountries = country.borders
    ? await Promise.all(
        country.borders.map(async (borderCode) => {
          const borderCountryData = await getCountryByCode(borderCode);
          return {
            code: borderCode,
            name: borderCountryData[0]?.name.common || borderCode,
          };
        })
      )
    : [];

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-7xl">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Countries
        </Link>
      </Button>

      {/* --- HERO SECTION --- */}
      <div className="relative">
        {/* Flag as a background banner */}
        <div className="relative w-full h-48 md:h-64 rounded-t-xl overflow-hidden">
          <Image
            src={country.flags.svg || country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* --- MAIN INFO CARD (OVERLAY) --- */}
        <div className="relative px-1 md:px-8 -mt-16">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {country.name.common}
              </CardTitle>
              <CardDescription className="text-lg">
                {country.name.official}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoItem icon={<Landmark size={20} />} label="Capital">
                {country.capital?.join(", ")}
              </InfoItem>
              <InfoItem icon={<Globe size={20} />} label="Region">
                {country.region} {country.subregion && `• ${country.subregion}`}
              </InfoItem>
              <InfoItem icon={<Users size={20} />} label="Population">
                {country.population?.toLocaleString()}
              </InfoItem>
              <InfoItem icon={<Ruler size={20} />} label="Area">
                {country.area?.toLocaleString()} km²
              </InfoItem>
              <InfoItem icon={<Languages size={20} />} label="Languages">
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {country.languages &&
                    Object.values(country.languages).map((lang) => (
                      <span key={lang}>{lang}</span>
                    ))}
                </div>
              </InfoItem>
              <InfoItem
                icon={<CircleDollarSign size={20} />}
                label="Currencies"
              >
                {country.currencies &&
                  Object.values(country.currencies)
                    .map((c) => `${c.name} (${c.symbol})`)
                    .join(", ")}
              </InfoItem>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- ADDITIONAL DETAILS CARD --- */}
      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Border Countries */}
            {borderCountries.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MapPin className="text-muted-foreground" /> Border Countries
                </h3>
                <div className="flex flex-wrap gap-3">
                  {borderCountries.map((border) => (
                    <Button asChild variant="secondary" key={border.code}>
                      <Link href={`/country/${border.code}`}>
                        {border.name}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Coat of Arms */}
            {country.coatOfArms?.svg && (
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <ShieldCheck className="text-muted-foreground" /> Coat of Arms
                </h3>
                <div className="p-4 bg-muted rounded-lg inline-block">
                  <Image
                    src={country.coatOfArms.svg}
                    alt={`Coat of arms of ${country.name.common}`}
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </CardContent>

          {/* Actions Footer */}
          <CardFooter className="flex-wrap gap-4 pt-6 border-t">
            <Button asChild variant="outline">
              <a
                href={country?.maps?.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink size={16} /> View on Google Maps
              </a>
            </Button>
            <div className="flex gap-2">
              <Button asChild>
                <a href={country.flags.png} download>
                  <Download size={16} className="mr-2" /> Download PNG
                </a>
              </Button>
              <Button asChild>
                <a href={country.flags.svg} download>
                  <Download size={16} className="mr-2" /> Download SVG
                </a>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
