import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AudioButton } from "@/components/ui/audio-button";
import { AudioRecorder } from "@/components/ui/audio-recorder";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import type { JobSeekerProfile } from "@shared/schema";

export default function JobSeekerProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  // Get profile data
  const { data: profile, isLoading } = useQuery<JobSeekerProfile>({
    queryKey: ["/api/job-seeker/profile"],
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<JobSeekerProfile>) => {
      const res = await apiRequest("PATCH", "/api/job-seeker/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-seeker/profile"] });
    },
  });

  // Handle skill addition
  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  // Handle skill removal
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Handle sector selection
  const toggleSector = (sector: string) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter(s => s !== sector));
    } else {
      setSelectedSectors([...selectedSectors, sector]);
    }
  };

  // Common skills for quick selection
  const commonSkills = Object.keys(t("skills", { returnObjects: true }));

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />

      <main className="container mx-auto px-4 py-6 flex-grow pb-20 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {t("jobSeeker.profile.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("jobSeeker.profile.subtitle")}
            </p>
          </div>
          <AudioButton text={t("jobSeeker.profile.audioDescription")} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardContent className="p-6">
                <SectionHeading 
                  title={t("jobSeeker.profile.personalInfo")}
                  description={t("jobSeeker.profile.personalInfoDesc")}
                />

                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.photoUrl} />
                      <AvatarFallback>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline">
                      {t("profile.profilePhoto")}
                    </Button>
                  </div>

                  <div className="grid gap-2">
                    <Label>{t("jobSeeker.profile.location")}</Label>
                    <Input 
                      placeholder={t("jobSeeker.profile.locationPlaceholder")}
                      value={profile?.location || ""}
                      onChange={(e) => updateProfileMutation.mutate({ location: e.target.value })}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>{t("jobSeeker.profile.age")}</Label>
                      <Input 
                        type="number"
                        placeholder={t("jobSeeker.profile.agePlaceholder")}
                        value={profile?.age || ""}
                        onChange={(e) => updateProfileMutation.mutate({ age: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>{t("auth.phone")}</Label>
                      <Input 
                        type="tel"
                        placeholder={t("auth.phonePlaceholder")}
                        value={profile?.phone || ""}
                        onChange={(e) => updateProfileMutation.mutate({ phone: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>{t("auth.email")}</Label>
                      <Input 
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        value={profile?.email || ""}
                        onChange={(e) => updateProfileMutation.mutate({ email: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>{t("jobSeeker.profile.education")}</Label>
                      <Textarea 
                        placeholder={t("jobSeeker.profile.educationPlaceholder")}
                        value={profile?.education || ""}
                        onChange={(e) => updateProfileMutation.mutate({ education: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardContent className="p-6">
                <SectionHeading 
                  title={t("jobSeeker.profile.professionalInfo")}
                  description={t("jobSeeker.profile.professionalInfoDesc")}
                />

                <div className="space-y-6">
                  {/* Desired Sectors */}
                  <div className="grid gap-2">
                    <Label>{t("jobSeeker.profile.desiredSectors")}</Label>
                    <Select
                      value={selectedSectors[0]}
                      onValueChange={(value) => toggleSector(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("jobSeeker.profile.selectSector")} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(t("sectors", { returnObjects: true })).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value as string}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSectors.map((sector) => (
                        <Badge 
                          key={sector} 
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => toggleSector(sector)}
                        >
                          {t(`sectors.${sector}`)}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="grid gap-2">
                    <Label>{t("jobSeeker.profile.skills")}</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder={t("jobSeeker.profile.skillsPlaceholder")}
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      />
                      <Button onClick={addSkill} type="button">
                        {t("common.add")}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeSkill(skill)}
                        >
                          {skill}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("jobSeeker.profile.commonSkills")}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {commonSkills.map((skill) => (
                          <Badge 
                            key={skill}
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                            onClick={() => !skills.includes(skill) && setSkills([...skills, skill])}
                          >
                            {t(`skills.${skill}`)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="grid gap-2">
                    <Label>{t("jobSeeker.profile.experience")}</Label>
                    <Textarea 
                      placeholder={t("jobSeeker.profile.experiencePlaceholder")}
                      value={profile?.experience || ""}
                      onChange={(e) => updateProfileMutation.mutate({ experience: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audio Presentation */}
            <Card>
              <CardContent className="p-6">
                <SectionHeading 
                  title={t("jobSeeker.profile.audioPresentation")}
                  description={t("jobSeeker.profile.audioPresentationDesc")}
                />

                <p className="text-sm text-muted-foreground mb-4">
                  {t("jobSeeker.profile.audioPresentationTip")}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <AudioRecorder
                      onRecordingComplete={(blob) => {
                        // Handle audio blob upload
                      }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {t("profile.recordAudioPresentation")}
                    </span>
                  </div>
                  <Button type="submit" className="w-full">
                    {t("common.save")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <MobileNavbar />
      <Footer />
    </div>
  );
}