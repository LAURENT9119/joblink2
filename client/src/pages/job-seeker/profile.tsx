import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { InsertJobSeekerProfile } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { AudioButton } from "@/components/ui/audio-button";
import { useAudioRecorder } from "@/hooks/use-audio";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mic, MicOff, X, Plus, User, MapPin, Phone, Mail, Calendar } from "lucide-react";

// Sectors array
const sectors = [
  "agriculture",
  "construction",
  "education",
  "food",
  "healthcare",
  "hospitality",
  "manufacturing",
  "retail",
  "services",
  "technology",
  "transportation",
  "other",
];

// Skills array
const commonSkills = [
  "communication",
  "customer_service",
  "cleaning",
  "cooking",
  "driving",
  "languages",
  "administration",
  "sales",
  "technical",
  "care",
  "security",
  "manual_labor",
];

// Profile form schema
const profileSchema = z.object({
  location: z.string().min(1, "Location is required"),
  age: z.coerce.number().min(18, "Must be at least 18 years old").optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  desiredSectors: z.array(z.string()).min(1, "At least one sector is required"),
  audioPresentationUrl: z.string().optional(),
  profilePhotoUrl: z.string().optional(),
  experience: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function JobSeekerProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  
  const { 
    isRecording: isRecordingAudio, 
    audioBlob, 
    audioUrl, 
    startRecording, 
    stopRecording, 
    resetRecording 
  } = useAudioRecorder();
  
  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      location: user?.jobSeekerProfile?.location || "",
      age: user?.jobSeekerProfile?.age || undefined,
      skills: user?.jobSeekerProfile?.skills || [],
      desiredSectors: user?.jobSeekerProfile?.desiredSectors || [],
      audioPresentationUrl: user?.jobSeekerProfile?.audioPresentationUrl || "",
      profilePhotoUrl: user?.jobSeekerProfile?.profilePhotoUrl || "",
      experience: user?.jobSeekerProfile?.experience ? JSON.stringify(user.jobSeekerProfile.experience) : "",
    },
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      // If we have a new audio recording, handle that first
      if (audioBlob) {
        // Create a FormData object to upload the audio file
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio_presentation.webm");
        
        // In a real implementation, you would:
        // 1. Upload the audio file to a server endpoint
        // 2. Get back the URL of the stored file
        // 3. Update the data.audioPresentationUrl with this URL
        
        // For now, we'll use a fake URL since we don't have a file upload endpoint
        data.audioPresentationUrl = audioUrl || "";
      }
      
      // Convert experience from string to object if provided
      let profileData: InsertJobSeekerProfile = {
        ...data,
        userId: user!.id,
      };
      
      // Send the profile update
      const res = await apiRequest("POST", "/api/job-seeker/profile", profileData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });
  
  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };
  
  // Audio descriptions
  const profileAudioDescription = t("jobSeeker.profile.audioDescription");
  
  // Handle adding a new skill
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    
    const currentSkills = form.getValues().skills || [];
    if (!currentSkills.includes(skillInput)) {
      form.setValue("skills", [...currentSkills, skillInput]);
    }
    setSkillInput("");
  };
  
  // Handle removing a skill
  const handleRemoveSkill = (skill: string) => {
    const currentSkills = form.getValues().skills || [];
    form.setValue("skills", currentSkills.filter(s => s !== skill));
  };
  
  // Handle audio recording
  const handleRecordToggle = () => {
    if (isRecordingAudio) {
      stopRecording();
    } else {
      resetRecording();
      startRecording();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow pb-20 md:pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">{t("jobSeeker.profile.title")}</h1>
            <AudioButton 
              text={profileAudioDescription}
              withLabel={false}
            />
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("jobSeeker.profile.personalInfo")}</CardTitle>
                  <CardDescription>{t("jobSeeker.profile.personalInfoDesc")}</CardDescription>
                </div>
                <Avatar className="h-14 w-14">
                  {user?.jobSeekerProfile?.profilePhotoUrl ? (
                    <AvatarImage src={user.jobSeekerProfile.profilePhotoUrl} alt={user.firstName} />
                  ) : (
                    <AvatarFallback className="bg-primary text-white">
                      {user?.firstName[0]}{user?.lastName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user?.firstName} {user?.lastName}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{user?.phone}</span>
                </div>
                
                {user?.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("jobSeeker.profile.locationInfo")}</CardTitle>
                  <CardDescription>{t("jobSeeker.profile.locationInfoDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("jobSeeker.profile.location")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("jobSeeker.profile.locationPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("jobSeeker.profile.age")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t("jobSeeker.profile.agePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("jobSeeker.profile.professionalInfo")}</CardTitle>
                  <CardDescription>{t("jobSeeker.profile.professionalInfoDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="desiredSectors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("jobSeeker.profile.desiredSectors")}</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              const currentSectors = field.value || [];
                              if (!currentSectors.includes(value)) {
                                field.onChange([...currentSectors, value]);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("jobSeeker.profile.selectSector")} />
                            </SelectTrigger>
                            <SelectContent>
                              {sectors.map((sector) => (
                                <SelectItem key={sector} value={sector}>
                                  {t(`sectors.${sector}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((sector) => (
                            <Badge key={sector} variant="secondary" className="gap-1">
                              {t(`sectors.${sector}`)}
                              <button 
                                type="button" 
                                onClick={() => field.onChange(field.value?.filter(s => s !== sector))}
                                className="ml-1 rounded-full hover:bg-muted p-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("jobSeeker.profile.skills")}</FormLabel>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder={t("jobSeeker.profile.skillsPlaceholder")}
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSkill();
                              }
                            }}
                          />
                          <Button type="button" size="sm" onClick={handleAddSkill}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm text-muted-foreground mb-2">{t("jobSeeker.profile.commonSkills")}</p>
                          <div className="flex flex-wrap gap-2">
                            {commonSkills.map((skill) => (
                              <Badge 
                                key={skill} 
                                variant="outline" 
                                className="cursor-pointer"
                                onClick={() => {
                                  const currentSkills = field.value || [];
                                  if (!currentSkills.includes(skill)) {
                                    field.onChange([...currentSkills, skill]);
                                  }
                                }}
                              >
                                {t(`skills.${skill}`)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((skill) => (
                            <Badge key={skill} variant="secondary" className="gap-1">
                              {t(`skills.${skill}`, { defaultValue: skill })}
                              <button 
                                type="button" 
                                onClick={() => handleRemoveSkill(skill)}
                                className="ml-1 rounded-full hover:bg-muted p-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("jobSeeker.profile.experience")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("jobSeeker.profile.experiencePlaceholder")}
                            {...field}
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("jobSeeker.profile.audioPresentation")}</CardTitle>
                  <CardDescription>{t("jobSeeker.profile.audioPresentationDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Button 
                        type="button" 
                        variant={isRecordingAudio ? "destructive" : "outline"}
                        onClick={handleRecordToggle}
                        className="gap-2"
                      >
                        {isRecordingAudio ? (
                          <>
                            <MicOff className="h-4 w-4" />
                            {t("jobSeeker.profile.stopRecording")}
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4" />
                            {t("jobSeeker.profile.startRecording")}
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {isRecordingAudio && (
                      <div className="flex justify-center">
                        <div className="audio-wave">
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    )}
                    
                    {audioUrl && (
                      <div className="flex justify-center">
                        <audio controls className="w-full">
                          <source src={audioUrl} type="audio/webm" />
                          {t("jobSeeker.profile.audioNotSupported")}
                        </audio>
                      </div>
                    )}
                    
                    {(form.getValues().audioPresentationUrl && !audioUrl) && (
                      <div className="flex justify-center">
                        <audio controls className="w-full">
                          <source src={form.getValues().audioPresentationUrl} type="audio/mpeg" />
                          {t("jobSeeker.profile.audioNotSupported")}
                        </audio>
                      </div>
                    )}
                    
                    <div className="text-center text-sm text-muted-foreground">
                      {t("jobSeeker.profile.audioPresentationTip")}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {t("common.saveChanges")}
              </Button>
            </form>
          </Form>
        </div>
      </main>
      
      <MobileNavbar />
      
      <Footer />
    </div>
  );
}
