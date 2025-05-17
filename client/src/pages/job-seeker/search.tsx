import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { JobCard } from "@/components/ui/job-card";
import { AudioButton } from "@/components/ui/audio-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Job } from "@shared/schema";
import { Search, Filter, MapPin, Clock, Briefcase, Building, Calendar, ArrowDownUp, ChevronDown } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";

// Job types
const jobTypes = ["all", "full_time", "part_time", "temporary", "service"];

// Sectors
const sectors = ["all", "agriculture", "construction", "education", "food", "retail", "services", "other"];

export default function JobSeekerSearch() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    sector: "all",
    location: "",
  });
  const [sortBy, setSortBy] = useState<"newest" | "closest">("newest");
  
  // Get jobs
  const { 
    data: jobs, 
    isLoading,
    refetch
  } = useQuery<Job[]>({
    queryKey: ["/api/jobs", filters],
    enabled: true,
  });
  
  // Filter jobs based on search term
  const filteredJobs = jobs?.filter(job => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.description.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term) ||
      job.sector.toLowerCase().includes(term)
    );
  });
  
  // Sort jobs
  const sortedJobs = filteredJobs ? [...filteredJobs].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // In a real app, you would use geolocation to sort by distance
    return 0;
  }) : [];
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };
  
  // Update filters
  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Audio description for the search page
  const searchAudioDescription = t("jobSeeker.search.audioDescription");
  
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      
      {/* Search Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={handleSearch} className="flex items-center bg-muted rounded-lg px-4 py-2">
            <Search className="h-5 w-5 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder={t("jobSeeker.search.searchPlaceholder")} 
              className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="button"
              className="ml-2 bg-primary/20 text-primary p-1.5 rounded-lg flex items-center hover:bg-primary/30 transition"
              onClick={() => {
                // Open filters modal or expand filters in a real implementation
              }}
            >
              <Filter className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            <Button 
              variant={filters.type === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => updateFilter("type", "all")}
            >
              {t("jobSeeker.search.allJobs")}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => setSortBy("closest")}
            >
              <MapPin className="h-4 w-4" />
              {t("jobSeeker.search.proximity")}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Clock className="h-4 w-4" />
                  {t(`jobTypes.${filters.type}`)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {jobTypes.map((type) => (
                  <DropdownMenuItem 
                    key={type} 
                    onClick={() => updateFilter("type", type)}
                    className="cursor-pointer"
                  >
                    {t(`jobTypes.${type}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Briefcase className="h-4 w-4" />
                  {t(`sectors.${filters.sector}`)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {sectors.map((sector) => (
                  <DropdownMenuItem 
                    key={sector} 
                    onClick={() => updateFilter("sector", sector)}
                    className="cursor-pointer"
                  >
                    {t(`sectors.${sector}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <main className="container mx-auto px-4 py-6 flex-grow pb-20 md:pb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {t("jobSeeker.search.results", { count: sortedJobs.length })}
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                {t("jobSeeker.search.sort")}: {t(`jobSeeker.search.sortOptions.${sortBy}`)} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setSortBy("newest")}
                className="cursor-pointer"
              >
                {t("jobSeeker.search.sortOptions.newest")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("closest")}
                className="cursor-pointer"
              >
                {t("jobSeeker.search.sortOptions.closest")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedJobs.length > 0 ? (
            <>
              {sortedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              
              {sortedJobs.length > 10 && (
                <div className="text-center mt-6">
                  <Button variant="outline">
                    {t("jobSeeker.search.loadMore")}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="mb-4">
                <Search className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t("jobSeeker.search.noResults")}</h3>
              <p>{t("jobSeeker.search.tryDifferentSearch")}</p>
            </div>
          )}
        </div>
      </main>
      
      <MobileNavbar />
      
      <Footer />
    </div>
  );
}
