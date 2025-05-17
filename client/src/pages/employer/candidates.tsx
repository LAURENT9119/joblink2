import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { useLocation, useSearch } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { ProfileCard } from "@/components/ui/profile-card";
import { AudioButton } from "@/components/ui/audio-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Job, Application, User } from "@shared/schema";
import { 
  ArrowLeft, Search, Briefcase, Check, X, 
  Filter, Clock, Loader2, Check as CheckIcon,
  XCircle, Clock as ClockIcon, FolderOpen
} from "lucide-react";

export default function Candidates() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [location] = useLocation();
  const search = useSearch();

  // Parsing URL parameters
  const params = new URLSearchParams(search);
  const jobIdParam = params.get("job");
  const applicationIdParam = params.get("application");

  // States for filtering and searching
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJob, setFilterJob] = useState<number | null>(jobIdParam ? parseInt(jobIdParam) : null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    applicationIdParam ? parseInt(applicationIdParam) : null
  );

  // Get employer jobs
  const { 
    data: jobs, 
    isLoading: isJobsLoading 
  } = useQuery<Job[]>({
    queryKey: ["/api/employer/jobs"],
    enabled: !!user,
  });

  // Get applications
  const { 
    data: applications, 
    isLoading: isApplicationsLoading 
  } = useQuery<(Application & { job: Job, jobSeeker: User })[]>({
    queryKey: ["/api/employer/applications"],
    enabled: !!user,
  });

  // Audio description
  const candidatesAudio = t("employer.candidates.audioDescription");

  // Filter applications based on search term and filters
  const filteredApplications = applications?.filter(app => {
    // Filter by job if selected
    if (filterJob && app.job.id !== filterJob) return false;

    // Filter by status if selected
    if (filterStatus !== "all" && app.status !== filterStatus) return false;

    // Search term filtering
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const candidateName = `${app.jobSeeker.firstName} ${app.jobSeeker.lastName}`.toLowerCase();
      const jobTitle = app.job.title.toLowerCase();

      return candidateName.includes(term) || jobTitle.includes(term);
    }

    return true;
  });

  // Get selected application details
  const selectedApplication = selectedCandidate
    ? applications?.find(app => app.id === selectedCandidate)
    : null;

  // Format application date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />

      <main className="container mx-auto px-4 py-6 flex-grow pb-20 md:pb-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <a href="/employer/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{t("employer.candidates.title")}</h1>
          <div className="ml-auto">
            <AudioButton 
              text={candidatesAudio}
              size="sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - List of Candidates */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-4">
                {/* Search and filter */}
                <div className="mb-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("employer.candidates.searchPlaceholder")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={filterJob ? String(filterJob) : "all"}
                      onValueChange={(value) => setFilterJob(value === "all" ? null : parseInt(value))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={t("employer.candidates.filterByJob")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("employer.candidates.allJobs")}</SelectItem>
                        {jobs?.map((job) => (
                          <SelectItem key={job.id} value={String(job.id)}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={filterStatus}
                      onValueChange={(value) => setFilterStatus(value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder={t("employer.candidates.status")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("employer.candidates.allStatuses")}</SelectItem>
                        <SelectItem value="pending">{t("employer.candidates.pending")}</SelectItem>
                        <SelectItem value="accepted">{t("employer.candidates.accepted")}</SelectItem>
                        <SelectItem value="rejected">{t("employer.candidates.rejected")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* List of candidates */}
                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
                  {isApplicationsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredApplications && filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => (
                      <div 
                        key={application.id}
                        className={`border rounded-lg p-3 cursor-pointer transition ${
                          selectedCandidate === application.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary'
                        }`}
                        onClick={() => setSelectedCandidate(application.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            {application.jobSeeker.firstName[0]}{application.jobSeeker.lastName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">
                              {application.jobSeeker.firstName} {application.jobSeeker.lastName}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {t("employer.candidates.appliedFor")}: <span className="font-medium">{application.job.title}</span>
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge
                              variant={
                                application.status === "accepted" ? "default" : 
                                application.status === "rejected" ? "destructive" : 
                                "secondary"
                              }
                              className="text-xs"
                            >
                              {t(`employer.candidates.${application.status}`)}
                            </Badge>
                            <span className="text-xs text-muted-foreground mt-1">
                              {formatDate(new Date(application.createdAt))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FolderOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium mb-1">{t("employer.candidates.noApplications")}</h3>
                      <p className="text-sm">{t("employer.candidates.checkFilters")}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Candidate Details */}
          <div className="lg:col-span-2">
            {selectedApplication ? (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-foreground mb-1">
                          {selectedApplication.jobSeeker.firstName} {selectedApplication.jobSeeker.lastName}
                        </h2>
                        <p className="text-muted-foreground">
                          {t("employer.candidates.appliedFor")}: <span className="font-medium">{selectedApplication.job.title}</span>
                        </p>
                      </div>
                      <Badge
                        variant={
                          selectedApplication.status === "accepted" ? "default" : 
                          selectedApplication.status === "rejected" ? "destructive" : 
                          "secondary"
                        }
                        className="text-sm"
                      >
                        {t(`employer.candidates.${selectedApplication.status}`)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      <span>
                        {t("employer.candidates.appliedOn")}: {formatDate(new Date(selectedApplication.createdAt))}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <SectionHeading 
                      title={t("employer.candidates.candidateProfile")}
                      description={t("employer.candidates.candidateProfileDesc")}
                    />

                    <ProfileCard
                      user={selectedApplication.jobSeeker as any}
                      isDetailed={true}
                    />
                  </div>

                  <div className="mb-6">
                    <SectionHeading 
                      title={t("employer.candidates.jobDetails")}
                      description={t("employer.candidates.jobDetailsDesc")}
                    />

                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-medium text-foreground mb-2">{selectedApplication.job.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{selectedApplication.job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {selectedApplication.job.location}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2"></path>
                          </svg>
                          {t(`jobTypes.${selectedApplication.job.type}`)}
                        </Badge>
                        {selectedApplication.job.startDate && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            {formatDate(new Date(selectedApplication.job.startDate))}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <div className="flex flex-wrap gap-3">
                      {selectedApplication.status === "pending" && (
                        <>
                          <Button variant="default" className="gap-2">
                            <CheckIcon className="h-4 w-4" />
                            {t("employer.candidates.acceptCandidate")}
                          </Button>
                          <Button variant="destructive" className="gap-2">
                            <XCircle className="h-4 w-4" />
                            {t("employer.candidates.rejectCandidate")}
                          </Button>
                        </>
                      )}

                      <Button asChild variant="outline" className="gap-2">
                        <a href={`https://wa.me/${selectedApplication.jobSeeker.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.967-.94 1.164-.173.197-.347.148-.647-.05-.3-.2-1.267-.465-2.414-1.485-.893-.795-1.494-1.777-1.668-2.078-.174-.3-.019-.462.13-.612.134-.13.3-.345.45-.52.149-.174.199-.3.3-.498.099-.2.05-.374-.025-.524-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                            <path d="M13.507 21.5h.001c3.142 0 6.142-1.236 8.37-3.473a11.948 11.948 0 003.468-8.413c0-6.633-5.4-12.023-12.046-12.023-2.324 0-4.563.675-6.48 1.95C2.764 2.371 1.107 7.127 1.112 12.24c.002 2.1.577 4.154 1.67 5.942a11.96 11.96 0 10.738 11.773l-7.9-.001L4.5 21.5h9.007z" />
                          </svg>
                          {t("contact.contactWhatsapp")}
                        </a>
                      </Button>

                      <Button asChild variant="outline" className="gap-2">
                        <a href={`tel:${selectedApplication.jobSeeker.phone.replace(/\D/g, '')}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          {t("contact.call")}
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
                  <Briefcase className="h-16 w-16 text-muted-foreground/20 mb-4" />
                  <h3 className="text-xl font-medium mb-2">{t("employer.candidates.selectCandidate")}</h3>
                  <p className="text-muted-foreground max-w-md">
                    {t("employer.candidates.selectCandidateDesc")}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <MobileNavbar />

      <Footer />
    </div>
  );
}