"use client";

import { getAllCountries, CountryType } from "@/lib/restCountriesApi";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

// Shadcn UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// Lucide React Icons
import {
  Search,
  Frown,
  Gamepad2,
  Globe,
  SortAsc,
  SortDesc,
} from "lucide-react";

import GuessFlag from "@/components/GuessFlag";
import { ProjectInfo } from "@/components/ProjectInfo";
import { DOTS, usePagination } from "@/hook/usePagination";

// ... (CountryCard and SkeletonCard components remain the same)
const CountryCard = ({ country }: { country: CountryType }) => (
  <Link href={`/country/${country.cca2.toLowerCase()}`} className="group">
    <Card className="h-full overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
      <div className="relative w-full aspect-video">
        <Image
          src={country.flags.svg || country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle className="truncate">{country.name.common}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>
          <strong>Population:</strong> {country.population?.toLocaleString()}
        </p>
        <p>
          <strong>Region:</strong> {country.region}
        </p>
      </CardContent>
    </Card>
  </Link>
);

const SkeletonCard = () => (
  <div className="space-y-4">
    <Skeleton className="h-40 w-full" />
    <div className="space-y-2 p-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  </div>
);

// Main Home Component
export default function Home() {
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // --- NEW: State for filtering and sorting ---
  const [regionFilter, setRegionFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "population" | "area";
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  useEffect(() => {
    setLoading(true);
    getAllCountries()
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching countries:", error))
      .finally(() => setLoading(false));
  }, []);

  const filteredAndSortedCountries = useMemo(() => {
    let result = countries
      .filter((country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (country) => regionFilter === "all" || country.region === regionFilter
      );

    result.sort((a, b) => {
      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc"
          ? a.name.common.localeCompare(b.name.common)
          : b.name.common.localeCompare(a.name.common);
      }
      // Ensure population and area exist for sorting
      const valA = a[sortConfig.key] || 0;
      const valB = b[sortConfig.key] || 0;
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [countries, searchTerm, regionFilter, sortConfig]);

  const totalPages = Math.ceil(
    filteredAndSortedCountries.length / itemsPerPage
  );
  const paginationRange = usePagination({
    currentPage,
    totalCount: filteredAndSortedCountries.length,
    pageSize: itemsPerPage,
    siblingCount: 1,
  });
  const currentCountries = filteredAndSortedCountries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onNext = () => handlePageChange(currentPage + 1);
  const onPrevious = () => handlePageChange(currentPage - 1);

  const uniqueRegions = useMemo(() => {
    const regions = new Set(countries.map((c) => c.region).filter(Boolean));
    return ["all", ...Array.from(regions).sort()];
  }, [countries]);

  return (
    <main className="container mx-auto p-4 sm:p-6 md:p-8 space-y-12">
      {/* --- Glassmorphism Header --- */}
      <section className="relative text-center mt-10 p-8 rounded-xl overflow-hidden backdrop-blur-sm bg-background/50 border">
        <div className="absolute inset-0 w-full h-full bg-grid-slate-100 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <h1 className="relative text-4xl md:text-5xl font-extrabold tracking-tight">
          Countries of the World
        </h1>
        <p className="relative text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          An interactive application to explore nations, test your flag
          knowledge, and more.
        </p>
      </section>

      <ProjectInfo />

      {/* --- Enhanced Separator --- */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-primary">
            <Gamepad2 size={24} />
          </span>
        </div>
      </div>

      <Card className="shadow-lg bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            Fun Zone: Guess the Flag!
          </CardTitle>
          <CardDescription>
            Test your geography knowledge with this fun little game.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GuessFlag />
        </CardContent>
      </Card>

      {/* --- Enhanced Separator --- */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-primary">
            <Globe size={24} />
          </span>
        </div>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Country Browser
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            Browse, search, and learn more about each nation.
          </p>
        </div>

        {/* --- Filter and Sort Controls --- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for a country..."
              className="pl-10 h-12"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={regionFilter}
              onValueChange={(value) => {
                setRegionFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] h-12!">
                <SelectValue placeholder="Filter by Region" />
              </SelectTrigger>
              <SelectContent>
                {uniqueRegions.map((region) => (
                  <SelectItem
                    key={region ?? ""}
                    value={region ?? ""}
                    className="capitalize "
                  >
                    {region === "all" ? "All Regions" : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12">
                  Sort By
                  {sortConfig.direction === "asc" ? (
                    <SortAsc className="ml-2 h-4 w-4" />
                  ) : (
                    <SortDesc className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "name", direction: "asc" })
                  }
                >
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "name", direction: "desc" })
                  }
                >
                  Name (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "population", direction: "desc" })
                  }
                >
                  Population (High-Low)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "population", direction: "asc" })
                  }
                >
                  Population (Low-High)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "area", direction: "desc" })
                  }
                >
                  Area (High-Low)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "area", direction: "asc" })
                  }
                >
                  Area (Low-High)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : currentCountries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCountries.map((country) => (
                <CountryCard key={country.cca2} country={country} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Frown className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Countries Found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
        {!loading && totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPrevious();
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Page Numbers and Ellipses */}
              {paginationRange.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                  return (
                    <PaginationItem key={`dots-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === pageNumber}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNumber as number);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNext();
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </section>

      {/* --- Footer --- */}
      <footer className="mt-24">
        <Separator />
        <div className="py-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Countries of the World. All rights
            reserved.
          </p>
          <p className="mt-2 sm:mt-0">A portfolio project by Leo Khani.</p>
        </div>
      </footer>
    </main>
  );
}
