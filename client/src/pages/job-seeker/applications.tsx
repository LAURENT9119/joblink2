
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { JobCard } from "@/components/ui/job-card";
import { AudioButton } from "@/components/ui/audio-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Job, Application } from "@shared/schema";
import { Loader2, ClipboardList } from "lucide-react";

export default function Applications() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Get applications
  const { 
    data: applications, 
    isLoading 
  } = useQuery<(Application & { job: Job })[]>({
    queryKey: ["/api/job-seeker/applications"],
    enabled: !!user,
  });
  
  // Audio description
  const pageAudioDescription = t("jobSeeker.applications.audioDescription");
  
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow pb-20 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {t("jobSeeker.applications.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("jobSeeker.applications.subtitle")}
            </p>
          </div>
          <AudioButton text={pageAudioDescription} />
        </div>
        
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : applications && applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application) => (
                  <JobCard 
                    key={application.id} 
                    job={application.job}
                    status={application.status}
                    appliedAt={application.createdAt}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h2 className="text-lg font-medium text-foreground mb-2">
                  {t("jobSeeker.applications.noApplications")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("jobSeeker.applications.startApplying")}
                </p>
                <Button asChild>
                  <Link href="/job-seeker/search">
                    {t("jobSeeker.applications.browseJobs")}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <MobileNavbar />
      
      <Footer />
    </div>
  );
}
