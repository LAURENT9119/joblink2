import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { JobCard } from "@/components/ui/job-card";
import { AudioButton } from "@/components/ui/audio-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Job, JobWithEmployer } from "@shared/schema";
import { 
  ArrowLeft, MapPin, Clock, Calendar, Bookmark, 
  BookmarkCheck, Building, Users, Phone, 
  MessageSquare, SendHorizontal, Eye, Loader2, Check
} from "lucide-react";

export default function JobDetail() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [, params] = useRoute<{ id: string }>("/job-seeker/job/:id");

  if (!params) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-muted">
        <h1 className="text-2xl font-bold mb-4">{t("common.error")}</h1>
        <p className="text-muted-foreground mb-6">{t("jobSeeker.jobDetail.invalidJob")}</p>
        <Button asChild>
          <Link href="/job-seeker/search">{t("common.backToSearch")}</Link>
        </Button>
      </div>
    );
  }

  const jobId = parseInt(params.id);

  // Get job details
  const { 
    data: job, 
    isLoading, 
    error 
  } = useQuery<JobWithEmployer>({
    queryKey: [`/api/jobs/${jobId}`],
  });

  // Check if job is saved
  const { 
    data: savedJobs, 
    isLoading: isSavedJobsLoading 
  } = useQuery<any[]>({
    queryKey: ["/api/job-seeker/saved-jobs"],
    enabled: !!user,
  });

  const isSaved = !isSavedJobsLoading && savedJobs?.some(saved => saved.jobId === jobId);

  // Get similar jobs
  const { 
    data: similarJobs, 
    isLoading: isSimilarJobsLoading 
  } = useQuery<Job[]>({
    queryKey: ["/api/jobs", job?.sector],
    enabled: !!job,
  });

  // Filter out current job and limit to 2
  const filteredSimilarJobs = similarJobs?.filter(j => j.id !== jobId).slice(0, 2);

  // Apply to job mutation
  const applyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/applications", { 
        jobId: jobId 
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-seeker/applications"] });
    },
  });

  // Save job mutation
  const saveJobMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        // Unsave job
        await apiRequest("DELETE", `/api/saved-jobs/${jobId}`);
        return false;
      } else {
        // Save job
        await apiRequest("POST", "/api/saved-jobs", { jobId });
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-seeker/saved-jobs"] });
    },
  });

  // Audio description for the job details
  const generateAudioDescription = (job: JobWithEmployer) => {
    return `${t("jobSeeker.jobDetail.audioIntro")}: ${job.title}. ${t("jobSeeker.jobDetail.company")}: ${job.employer.employerProfile?.companyName || job.employer.firstName + ' ' + job.employer.lastName}. ${t("jobSeeker.jobDetail.location")}: ${job.location}. ${t("jobSeeker.jobDetail.type")}: ${t(`jobTypes.${job.type}`)}. ${t("jobSeeker.jobDetail.descriptionLabel")}: ${job.description}`;
  };

  // WhatsApp deep link
  const generateWhatsAppLink = (job: JobWithEmployer) => {
    const phone = job.contactPhone.replace(/\D/g, '');
    const message = t("jobSeeker.jobDetail.whatsappMessage", { jobTitle: job.title });
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Phone call link
  const generatePhoneLink = (job: JobWithEmployer) => {
    const phone = job.contactPhone.replace(/\D/g, '');
    return `tel:${phone}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-muted">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-muted">
        <h1 className="text-2xl font-bold mb-4">{t("common.error")}</h1>
        <p className="text-muted-foreground mb-6">{t("jobSeeker.jobDetail.jobNotFound")}</p>
        <Button asChild>
          <Link href="/job-seeker/search">{t("common.backToSearch")}</Link>
        </Button>
      </div>
    );
  }

  const jobAudioDescription = generateAudioDescription(job);
  const whatsappLink = generateWhatsAppLink(job);
  const phoneLink = generatePhoneLink(job);

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-3">
        <Link href="/job-seeker/search" className="inline-flex items-center text-muted-foreground hover:text-primary transition">
          <ArrowLeft className="h-4 w-4 mr-1" /> {t("common.backToResults")}
        </Link>
      </div>

      {/* Job Detail */}
      <main className="container mx-auto px-4 pb-24 flex-grow">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">{job.title}</h1>
                <p className="text-muted-foreground">
                  {t("jobSeeker.jobDetail.postedDate", { 
                    date: new Date(job.createdAt).toLocaleDateString() 
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <AudioButton 
                  text={jobAudioDescription}
                  size="sm"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="border border-border p-2 rounded-lg hover:border-primary hover:text-primary transition"
                  onClick={() => saveJobMutation.mutate()}
                  disabled={saveJobMutation.isPending}
                >
                  {saveJobMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isSaved ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("jobSeeker.jobDetail.location")}</p>
                  <p className="font-medium text-foreground">{job.location}</p>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("jobSeeker.jobDetail.jobType")}</p>
                  <p className="font-medium text-foreground">{t(`jobTypes.${job.type}`)}</p>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("jobSeeker.jobDetail.availability")}</p>
                  <p className="font-medium text-foreground">
                    {job.startDate ? new Date(job.startDate).toLocaleDateString() : t("jobSeeker.jobDetail.immediate")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">{t("jobSeeker.jobDetail.description")}</h2>
              <p className="text-muted-foreground mb-3">
                {job.description}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                {job.description.split(".").filter(Boolean).map((point, index) => (
                  <li key={index}>{point.trim()}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">{t("jobSeeker.jobDetail.aboutEmployer")}</h2>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {job.employer.employerProfile?.companyName || `${job.employer.firstName} ${job.employer.lastName}`}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {job.employer.employerProfile?.sector ? t(`sectors.${job.employer.employerProfile.sector}`) : ""}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {job.employer.employerProfile?.companySize && (
                      <Badge variant="outline" className="gap-1">
                        <Users className="h-3 w-3" />
                        {job.employer.employerProfile.companySize}
                      </Badge>
                    )}
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.employer.employerProfile?.location || job.location}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">{t("jobSeeker.jobDetail.interestedCta")}</h2>
              <div className="flex flex-wrap gap-3">
                
                <Button asChild className="gap-2" size="lg">
                  <a href={phoneLink}>
                    <Phone className="h-5 w-5" />
                    {t("jobSeeker.jobDetail.call")}
                  </a>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="gap-2" 
                  size="lg"
                  onClick={() => applyMutation.mutate()}
                  disabled={applyMutation.isPending}
                >
                  {applyMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : applyMutation.isSuccess ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <SendHorizontal className="h-5 w-5" />
                  )}
                  {applyMutation.isSuccess 
                    ? t("jobSeeker.jobDetail.applied") 
                    : t("jobSeeker.jobDetail.apply")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Similar Jobs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">{t("jobSeeker.jobDetail.similarJobs")}</h2>
              <Link href="/job-seeker/search" className="text-primary hover:text-primary/90 transition flex items-center gap-1 text-sm">
                {t("common.viewMore")} <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>

            <div className="space-y-4">
              {isSimilarJobsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredSimilarJobs && filteredSimilarJobs.length > 0 ? (
                filteredSimilarJobs.map((similarJob) => (
                  <JobCard key={similarJob.id} job={similarJob} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t("jobSeeker.jobDetail.noSimilarJobs")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNavbar />

      <Footer />
    </div>
  );
}