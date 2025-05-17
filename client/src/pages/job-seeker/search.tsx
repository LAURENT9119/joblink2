import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { JobCard } from "@/components/ui/job-card";
import { AudioButton } from "@/components/ui/audio-button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Job } from "@shared/schema";
import { Search, MapPin, BriefcaseIcon, Languages, SlidersHorizontal } from "lucide-react";

export default function JobSearch() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    sector: "",
    location: "",
    type: "",
    language: ""
  });

  // Get jobs with filters
  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs", filters],
    enabled: true,
  });

  // Audio description
  const pageAudioDescription = t("jobSeeker.search.audioDescription");
    const [, navigate] = useLocation();


  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />

      <main className="container mx-auto px-4 py-6 flex-grow pb-20 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {t("jobSeeker.search.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("jobSeeker.search.subtitle")}
            </p>
          </div>
          <AudioButton text={pageAudioDescription} />
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("jobSeeker.search.sector")}</label>
                <Select value={filters.sector} onValueChange={(value) => setFilters(f => ({ ...f, sector: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("jobSeeker.search.selectSector")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agriculture">{t("sectors.agriculture")}</SelectItem>
                    <SelectItem value="artisan">{t("sectors.artisan")}</SelectItem>
                    <SelectItem value="service">{t("sectors.service")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("jobSeeker.search.location")}</label>
                <Input 
                  type="text"
                  placeholder={t("jobSeeker.search.locationPlaceholder")}
                  value={filters.location}
                  onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
                  icon={<MapPin className="h-4 w-4" />}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("jobSeeker.search.type")}</label>
                <Select value={filters.type} onValueChange={(value) => setFilters(f => ({ ...f, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("jobSeeker.search.selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mission">{t("jobTypes.mission")}</SelectItem>
                    <SelectItem value="cdd">{t("jobTypes.cdd")}</SelectItem>
                    <SelectItem value="service">{t("jobTypes.service")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("jobSeeker.search.language")}</label>
                <Select value={filters.language} onValueChange={(value) => setFilters(f => ({ ...f, language: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("jobSeeker.search.selectLanguage")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">{t("languages.french")}</SelectItem>
                    <SelectItem value="wo">{t("languages.wolof")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">{t("common.loading")}</p>
            </div>
          ) : jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">
                {t("jobSeeker.search.noJobs")}
              </h2>
              <p className="text-muted-foreground">
                {t("jobSeeker.search.tryAdjusting")}
              </p>
            </div>
          )}
        </div>
      </main>

      <MobileNavbar />
      <Footer />
    </div>
  );
}