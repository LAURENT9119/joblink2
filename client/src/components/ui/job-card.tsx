import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "@/hooks/use-translation";
import { Job, JobWithEmployer } from "@shared/schema";
import { 
  MapPin, Clock, Calendar, Eye, Bookmark, 
  BookmarkCheck, MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioButton } from "@/components/ui/audio-button";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job | JobWithEmployer;
  isSaved?: boolean;
  isDetailed?: boolean;
  showAudio?: boolean;
}

const generateAudioDescription = (job: Job | JobWithEmployer) => {
  return `${job.title}. ${job.description}. Location: ${job.location}. Type: ${job.type}`;
};

export function JobCard({ job, isSaved = false, isDetailed = false }: JobCardProps) {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  
  const dateLocale = language === "fr" ? fr : enUS;
  const formattedDate = formatDistanceToNow(new Date(job.createdAt), { 
    addSuffix: true,
    locale: dateLocale,
  });
  
  const isNew = new Date(job.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  // Save job mutation
  const saveJobMutation = useMutation({
    mutationFn: async () => {
      if (saved) {
        // Unsave job
        await apiRequest("DELETE", `/api/saved-jobs/${job.id}`);
        return false;
      } else {
        // Save job
        await apiRequest("POST", "/api/saved-jobs", { jobId: job.id });
        return true;
      }
    },
    onSuccess: (isSaved) => {
      setSaved(isSaved);
      queryClient.invalidateQueries({ queryKey: ["/api/job-seeker/saved-jobs"] });
    },
  });
  
  // Audio description for the job
  const audioDescription = `${t("jobs.job")}: ${job.title}. ${t("jobs.location")}: ${job.location}. ${t("jobs.type")}: ${job.type}. ${t("jobs.description")}: ${job.description}`;
  
  // WhatsApp deep link
  const whatsappLink = `https://wa.me/${job.contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent(t("contact.whatsappMessage", { jobTitle: job.title }))}`;
  
  // Phone call link
  const phoneLink = `tel:${job.contactPhone.replace(/\D/g, '')}`;
  
  return (
    <div className={`border ${isDetailed ? 'border-primary' : 'border-border'} rounded-lg p-4 hover:border-primary hover:shadow-sm transition`}>
      <div className="flex justify-between mb-2">
        <h3 className="font-medium text-foreground">{job.title}</h3>
        <span className={isNew ? "text-primary text-sm" : "text-muted-foreground text-sm"}>
          {isNew ? t("jobs.new") : formattedDate}
        </span>
      </div>
      
      <p className="text-muted-foreground text-sm mb-3">
        {isDetailed ? job.description : `${job.description.substring(0, 100)}${job.description.length > 100 ? '...' : ''}`}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="outline" className="text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          {job.location}
        </Badge>
        
        <Badge variant="outline" className="text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {job.type}
        </Badge>
        
        {job.startDate && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(job.startDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
          </Badge>
        )}
        
        {job.status && job.status !== "active" && (
          <Badge variant={job.status === 'closed' ? 'destructive' : 'secondary'} className="text-xs">
            {t(`jobs.status.${job.status}`)}
          </Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="default" className="gap-1">
          <Link href={`/job-seeker/job/${job.id}`}>
            <Eye className="h-4 w-4" />
            {t("jobs.viewDetails")}
          </Link>
        </Button>
        
        {isDetailed && (
          <>
            <Button asChild size="sm" variant="outline" className="gap-1">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.967-.94 1.164-.173.197-.347.148-.647-.05-.3-.2-1.267-.465-2.414-1.485-.893-.795-1.494-1.777-1.668-2.078-.174-.3-.019-.462.13-.612.134-.13.3-.345.45-.52.149-.174.199-.3.3-.498.099-.2.05-.374-.025-.524-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                  <path d="M13.507 21.5h.001c3.142 0 6.142-1.236 8.37-3.473a11.948 11.948 0 003.468-8.413c0-6.633-5.4-12.023-12.046-12.023-2.324 0-4.563.675-6.48 1.95C2.764 2.371 1.107 7.127 1.112 12.24c.002 2.1.577 4.154 1.67 5.942a11.96 11.96 0 10.738 11.773l-7.9-.001L4.5 21.5h9.007z" />
                </svg>
                {t("contact.whatsapp")}
              </a>
            </Button>
            
            <Button asChild size="sm" variant="outline" className="gap-1">
              <a href={phoneLink}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                {t("contact.call")}
              </a>
            </Button>
          </>
        )}
        
        {user?.role === "job_seeker" && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="border border-border px-3 py-1.5 rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition"
            onClick={() => saveJobMutation.mutate()}
            disabled={saveJobMutation.isPending}
          >
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        )}
        
        <AudioButton 
          text={audioDescription}
          size="sm"
        />
      </div>
    </div>
  );
}
