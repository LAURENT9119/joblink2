import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { AudioButton } from "@/components/ui/audio-button";
import { ProfileCard } from "@/components/ui/profile-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Job, Application, User } from "@shared/schema";
import { 
  Briefcase, UserRound, Eye, Loader2, 
  Plus, Edit, RefreshCcw, Trash, CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EmployerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
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
  
  // Audio description for the dashboard
  const welcomeAudio = t("employer.dashboard.welcomeAudio", { 
    name: user?.firstName || "" 
  });
  
  // Group applications by job
  const applicationsByJob = applications?.reduce((acc, app) => {
    if (!acc[app.jobId]) {
      acc[app.jobId] = [];
    }
    acc[app.jobId].push(app);
    return acc;
  }, {} as { [key: number]: (Application & { job: Job, jobSeeker: User })[] });
  
  // Count active jobs
  const activeJobs = jobs?.filter(job => job.status === "active").length || 0;
  
  // Count total views
  const totalViews = jobs?.reduce((sum, job) => sum + job.views, 0) || 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow pb-20 md:pb-6">
        {/* Welcome Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-foreground mb-1">
                  {t("employer.dashboard.hello", { name: user?.firstName || "" })}
                </h1>
                <p className="text-muted-foreground">
                  {t("employer.dashboard.welcome")}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center gap-2">
                <AudioButton 
                  text={welcomeAudio}
                  withLabel={true}
                />
                
                <Button asChild className="gap-1">
                  <Link href="/employer/create-job">
                    <Plus className="h-4 w-4" />
                    {t("employer.dashboard.postJob")}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">{t("employer.dashboard.postedJobs")}</p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {isJobsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      jobs?.length || 0
                    )}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-muted-foreground text-sm">
                {t("employer.dashboard.activeJobs", { count: activeJobs })}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">{t("employer.dashboard.applications")}</p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {isApplicationsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      applications?.length || 0
                    )}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                  <UserRound className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-muted-foreground text-sm">
                {isApplicationsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : applications && applications.length > 0 ? (
                  t("employer.dashboard.newApplications", { 
                    count: applications.filter(a => a.status === "pending").length 
                  })
                ) : (
                  t("employer.dashboard.noApplications")
                )}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">{t("employer.dashboard.views")}</p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {isJobsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      totalViews
                    )}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-[#FFC107]/20 rounded-full flex items-center justify-center text-[#FFC107]">
                  <Eye className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-muted-foreground text-sm">
                {t("employer.dashboard.viewsIncrease", { count: 12 })}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Your Jobs */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">{t("employer.dashboard.yourJobs")}</h2>
              <Link href="/employer/jobs" className="text-primary hover:text-primary/90 transition flex items-center gap-1 text-sm">
                {t("common.viewAll")} <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            <div className="space-y-4">
              {isJobsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : jobs && jobs.length > 0 ? (
                jobs.slice(0, 2).map((job) => (
                  <div 
                    key={job.id} 
                    className={`border rounded-lg p-4 hover:shadow-sm transition ${
                      job.status === 'active' ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-foreground">{job.title}</h3>
                      <Badge variant={job.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {t(`jobs.status.${job.status}`)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{job.description.substring(0, 100)}...</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {job.location}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 6v6l4 2"></path>
                        </svg>
                        {t(`jobTypes.${job.type}`)}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {t("employer.dashboard.postedOn", { 
                          date: new Date(job.createdAt).toLocaleDateString() 
                        })}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{applicationsByJob?.[job.id]?.length || 0}</span> {t("employer.dashboard.applicationsReceived")}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="default" size="sm" className="gap-1">
                          <Link href={`/employer/candidates?job=${job.id}`}>
                            <UserRound className="h-4 w-4" />
                            {t("employer.dashboard.viewCandidates")}
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="p-0 w-9 h-9">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="mb-4">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t("employer.dashboard.noJobs")}</h3>
                  <p className="mb-4">{t("employer.dashboard.postYourFirst")}</p>
                  <Button asChild>
                    <Link href="/employer/create-job">
                      <Plus className="h-4 w-4 mr-2" />
                      {t("employer.dashboard.createJob")}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Candidates */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">{t("employer.dashboard.recentCandidates")}</h2>
              <Link href="/employer/candidates" className="text-primary hover:text-primary/90 transition flex items-center gap-1 text-sm">
                {t("common.viewAll")} <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            <div className="space-y-4">
              {isApplicationsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : applications && applications.length > 0 ? (
                applications.slice(0, 2).map((application) => (
                  <div key={application.id}>
                    <ProfileCard 
                      user={application.jobSeeker as any}
                      onContact={() => window.location.href = `/employer/candidates?application=${application.id}`}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="mb-4">
                    <UserRound className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t("employer.dashboard.noApplications")}</h3>
                  <p>{t("employer.dashboard.waitingForCandidates")}</p>
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