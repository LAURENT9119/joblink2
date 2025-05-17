import { User, Briefcase, Clock, MapPin, Phone, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { AudioButton } from "@/components/ui/audio-button";
import { JobSeekerProfile, EmployerProfile, UserWithProfile } from "@shared/schema";

interface ProfileCardProps {
  user: UserWithProfile;
  isDetailed?: boolean;
  onContact?: () => void;
}

export function ProfileCard({ user, isDetailed = false, onContact }: ProfileCardProps) {
  const { t } = useTranslation();
  
  const profile = user.role === "job_seeker" 
    ? user.jobSeekerProfile 
    : user.employerProfile;
    
  // Generate audio description
  let audioDescription = "";
  
  if (user.role === "job_seeker" && user.jobSeekerProfile) {
    const jobSeekerProfile = user.jobSeekerProfile;
    audioDescription = `${t("profile.name")}: ${user.firstName} ${user.lastName}. `;
    
    if (jobSeekerProfile.location) {
      audioDescription += `${t("profile.location")}: ${jobSeekerProfile.location}. `;
    }
    
    if (jobSeekerProfile.skills && jobSeekerProfile.skills.length) {
      audioDescription += `${t("profile.skills")}: ${jobSeekerProfile.skills.join(", ")}. `;
    }
    
    if (jobSeekerProfile.desiredSectors && jobSeekerProfile.desiredSectors.length) {
      audioDescription += `${t("profile.sectors")}: ${jobSeekerProfile.desiredSectors.join(", ")}. `;
    }
  } else if (user.role === "employer" && user.employerProfile) {
    const employerProfile = user.employerProfile;
    audioDescription = `${t("profile.companyName")}: ${employerProfile.companyName || user.firstName + " " + user.lastName}. `;
    
    if (employerProfile.location) {
      audioDescription += `${t("profile.location")}: ${employerProfile.location}. `;
    }
    
    if (employerProfile.sector) {
      audioDescription += `${t("profile.sector")}: ${employerProfile.sector}. `;
    }
    
    if (employerProfile.description) {
      audioDescription += `${t("profile.description")}: ${employerProfile.description}. `;
    }
  }
  
  // WhatsApp deep link
  const whatsappLink = `https://wa.me/${user.phone.replace(/\D/g, '')}?text=${encodeURIComponent(t("contact.profileWhatsappMessage", { name: user.firstName }))}`;
  
  // Phone call link
  const phoneLink = `tel:${user.phone.replace(/\D/g, '')}`;
  
  return (
    <div className="border border-border rounded-lg p-4 hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        <Avatar className="w-12 h-12">
          {profile?.profilePhotoUrl ? (
            <AvatarImage src={profile.profilePhotoUrl} alt={user.firstName} />
          ) : (
            <AvatarFallback className="bg-muted text-muted-foreground">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-foreground">
                {user.firstName} {user.lastName}
              </h3>
              {user.role === "job_seeker" ? (
                <p className="text-muted-foreground text-sm">
                  {(user.jobSeekerProfile?.desiredSectors || []).join(", ") || t("profile.jobSeeker")}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {user.employerProfile?.companyName || t("profile.employer")}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <AudioButton text={audioDescription} size="sm" />
            </div>
          </div>
          
          {isDetailed && (
            <>
              {user.role === "job_seeker" && user.jobSeekerProfile && (
                <div className="mt-4">
                  {user.jobSeekerProfile.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{user.jobSeekerProfile.location}</span>
                    </div>
                  )}
                  
                  {user.jobSeekerProfile.skills && user.jobSeekerProfile.skills.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">{t("profile.skills")}</p>
                      <div className="flex flex-wrap gap-1">
                        {user.jobSeekerProfile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {user.jobSeekerProfile.audioPresentationUrl && (
                    <div className="mb-3 mt-4">
                      <p className="text-sm font-medium mb-1">{t("profile.audioPresentation")}</p>
                      <audio controls className="w-full">
                        <source src={user.jobSeekerProfile.audioPresentationUrl} type="audio/mpeg" />
                        {t("profile.audioNotSupported")}
                      </audio>
                    </div>
                  )}
                </div>
              )}
              
              {user.role === "employer" && user.employerProfile && (
                <div className="mt-4">
                  {user.employerProfile.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{user.employerProfile.location}</span>
                    </div>
                  )}
                  
                  {user.employerProfile.sector && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{user.employerProfile.sector}</span>
                    </div>
                  )}
                  
                  {user.employerProfile.companySize && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <User className="h-4 w-4" />
                      <span>{user.employerProfile.companySize}</span>
                    </div>
                  )}
                  
                  {user.employerProfile.description && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">{t("profile.about")}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.employerProfile.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-sm font-medium mb-2">{t("profile.contactInfo")}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
                
                {user.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                
                
                <Button asChild size="sm" variant="outline" className="gap-1">
                  <a href={phoneLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    {t("contact.call")}
                  </a>
                </Button>
              </div>
            </>
          )}
          
          {!isDetailed && onContact && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="default" onClick={onContact}>
                {t("profile.viewProfile")}
              </Button>
              
              <Button asChild size="sm" variant="outline" className="gap-1">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.967-.94 1.164-.173.197-.347.148-.647-.05-.3-.2-1.267-.465-2.414-1.485-.893-.795-1.494-1.777-1.668-2.078-.174-.3-.019-.462.13-.612.134-.13.3-.345.45-.52.149-.174.199-.3.3-.498.099-.2.05-.374-.025-.524-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                    <path d="M13.507 21.5h.001c3.142 0 6.142-1.236 8.37-3.473a11.948 11.948 0 003.468-8.413c0-6.633-5.4-12.023-12.046-12.023-2.324 0-4.563.675-6.48 1.95C2.764 2.371 1.107 7.127 1.112 12.24c.002 2.1.577 4.154 1.67 5.942a11.96 11.96 0 10.738 11.773l-7.9-.001L4.5 21.5h9.007z" />
                  </svg>
                  {t("contact.contact")}
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
