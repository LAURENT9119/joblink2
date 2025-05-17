import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { Header } from "@/components/layout/header";
import { JobCard } from "@/components/ui/job-card";
import { Card } from "@/components/ui/card";
import { AudioButton } from "@/components/ui/audio-button";
import { Loader2 } from "lucide-react";

export default function SavedJobs() {
  const { t } = useTranslation();

  const { data: savedJobs, isLoading } = useQuery({
    queryKey: ['/api/job-seeker/saved-jobs'],
  });

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />

      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {t("jobSeeker.dashboard.savedJobs")}
          </h1>
          <AudioButton text={t("jobSeeker.savedJobs.audioDescription")} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : savedJobs?.length > 0 ? (
          <div className="grid gap-4">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-muted-foreground">
            {t("jobSeeker.savedJobs.noSavedJobs")}
          </Card>
        )}
      </main>
    </div>
  );
}