import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Progress } from "@/components/ui/progress";
import { Job, Application } from "@shared/schema";
import { Loader2, User, Forward, Bookmark, Mic, Briefcase, GraduationCap, Search, Bell } from "lucide-react";
import { useEffect } from "react";

export default function JobSeekerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Static test data
  const testData = {
    recentJobs: [
      {
        id: 1,
        title: "Test Job 1",
        company: "Test Company",
        location: "Test Location",
        type: "FULL_TIME",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Test Job 2",
        company: "Another Company",
        location: "Another Location",
        type: "PART_TIME",
        createdAt: new Date().toISOString(),
      },
    ],
    applications: [
      {
        id: 1,
        jobId: 1,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      }
    ]
  };

  // Get recommended jobs
  const {
    data: recommendedJobs,
    isLoading: isJobsLoading
  } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    enabled: !!user,
  });

  // Get user applications
  const {
    data: applications,
    isLoading: isApplicationsLoading
  } = useQuery<(Application & { job: Job })[]>({
    queryKey: ["/api/job-seeker/applications"],
    enabled: !!user,
  });

  // Get saved jobs count
  const {
    data: savedJobs,
    isLoading: isSavedJobsLoading
  } = useQuery<(Application & { job: Job })[]>({
    queryKey: ["/api/job-seeker/saved-jobs"],
    enabled: !!user,
  });

  // Audio description for the dashboard
  const welcomeAudio = t("jobSeeker.dashboard.welcomeAudio", {
    name: user?.firstName || ""
  });

  // Get profile completion percentage
  const getProfileCompletion = () => {
    if (!user || !user.jobSeekerProfile) return 0;

    const profile = user.jobSeekerProfile;
    let completed = 0;
    let total = 0;

    // Basic info
    if (user.firstName) completed++;
    if (user.lastName) completed++;
    if (user.phone) completed++;
    total += 3;

    // Profile info
    if (profile.location) completed++;
    if (profile.skills && profile.skills.length > 0) completed++;
    if (profile.desiredSectors && profile.desiredSectors.length > 0) completed++;
    if (profile.audioPresentationUrl) completed++;
    if (profile.profilePhotoUrl) completed++;
    if (profile.experience) completed++;
    total += 6;

    return Math.round((completed / total) * 100);
  };

  const profileCompletionPercentage = getProfileCompletion();

  // Check if there are required fields to complete
  const missingProfileItems = () => {
    if (!user || !user.jobSeekerProfile) return [];

    const profile = user.jobSeekerProfile;
    const missing = [];

    if (!profile.audioPresentationUrl) missing.push({
      id: "audio",
      icon: <Mic className="h-4 w-4" />,
      name: t("jobSeeker.profile.audioPresentation")
    });

    if (!profile.experience) missing.push({
      id: "experience",
      icon: <Briefcase className="h-4 w-4" />,
      name: t("jobSeeker.profile.experience")
    });

    if (!profile.skills || profile.skills.length === 0) missing.push({
      id: "skills",
      icon: <GraduationCap className="h-4 w-4" />,
      name: t("jobSeeker.profile.skills")
    });

    return missing;
  };

  const missing = missingProfileItems();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />

      <main className="container mx-auto px-4 py-6 flex-grow pb-20 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {t("jobSeeker.dashboard.welcome", { name: user?.firstName })}
            </h1>
            <p className="text-muted-foreground">
              {t("jobSeeker.dashboard.subtitle")}
            </p>
          </div>
          <AudioButton text={t("jobSeeker.dashboard.audioDescription")} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Jobs */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {t("jobSeeker.dashboard.recentJobs")}
              </h2>
              <div className="space-y-4">
                {testData.recentJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/job-seeker/search">
                  <Search className="w-4 h-4 mr-2" />
                  {t("jobSeeker.dashboard.findMoreJobs")}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {t("jobSeeker.dashboard.recentApplications")}
              </h2>
              <div className="space-y-4">
                {testData.applications.map((application) => (
                  <JobCard
                    key={application.id}
                    job={testData.recentJobs.find(j => j.id === application.jobId)!}
                    status={application.status}
                    appliedAt={application.createdAt}
                  />
                ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/job-seeker/applications">
                  <Bell className="w-4 h-4 mr-2" />
                  {t("jobSeeker.dashboard.viewAllApplications")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">{t("jobSeeker.dashboard.profileCompleted")}</p>
                  <h3 className="text-2xl font-bold text-foreground">{profileCompletionPercentage}%</h3>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <Progress value={profileCompletionPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">{t("jobSeeker.dashboard.applications")}</p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {isApplicationsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      applications?.length || 0
                    )}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                  <Forward className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-muted-foreground text-sm">
                {isApplicationsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : applications && applications.length > 0 ? (
                  t("jobSeeker.dashboard.lastApplication", { date: "2 days ago" })
                ) : (
                  t("jobSeeker.dashboard.noApplications")
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">{t("jobSeeker.dashboard.savedJobs")}</p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {isSavedJobsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      savedJobs?.length || 0
                    )}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-[#FFC107]/20 rounded-full flex items-center justify-center text-[#FFC107]">
                  <Bookmark className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-muted-foreground text-sm">
                {t("jobSeeker.dashboard.matchingJobs", { count: 5 })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">{t("jobSeeker.dashboard.recommendedJobs")}</h2>
              <Link href="/job-seeker/search" className="text-primary hover:text-primary/90 transition flex items-center gap-1 text-sm">
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
              ) : recommendedJobs && recommendedJobs.length > 0 ? (
                recommendedJobs.slice(0, 2).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t("jobSeeker.dashboard.noRecommendedJobs")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Complete Your Profile */}
        {missing.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{t("jobSeeker.dashboard.completeProfile")}</h2>
                  <p className="text-muted-foreground text-sm">{t("jobSeeker.dashboard.completeProfileDesc")}</p>
                </div>
                <AudioButton
                  text={t("jobSeeker.dashboard.completeProfileAudio")}
                  size="sm"
                />
              </div>

              <div className="space-y-3">
                {missing.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                        {item.icon}
                      </div>
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <Button variant="link" asChild>
                      <Link href="/job-seeker/profile">
                        {t("common.add")}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNavbar />
      <Footer />
    </div>
  );
}