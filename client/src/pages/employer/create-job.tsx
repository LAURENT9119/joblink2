import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { InsertJob } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { AudioButton } from "@/components/ui/audio-button";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft } from "lucide-react";

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

// Job types
const jobTypes = ["full_time", "part_time", "temporary", "service"];

// Job form schema
const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Job type is required"),
  sector: z.string().min(1, "Sector is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().optional(),
  duration: z.string().optional(),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPreferences: z.array(z.string()).min(1, "At least one contact method is required"),
  useProfileInfo: z.boolean().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function CreateJob() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Prefill form with user profile data if available
  const defaultValues: Partial<JobFormValues> = {
    contactName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
    contactPhone: user?.phone || "",
    contactEmail: user?.email || "",
    contactPreferences: ["phone", "whatsapp"],
    useProfileInfo: false,
  };

  // Setup form
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues,
  });
  
  // Handle profile info checkbox
  const handleUseProfileInfo = (checked: boolean) => {
    if (checked) {
      form.setValue("contactName", `${user?.firstName || ""} ${user?.lastName || ""}`);
      form.setValue("contactPhone", user?.phone || "");
      form.setValue("contactEmail", user?.email || "");
    } else {
      form.setValue("contactName", "");
      form.setValue("contactPhone", "");
      form.setValue("contactEmail", "");
    }
  };
  
  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (data: JobFormValues) => {
      const jobData: InsertJob = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      };
      
      const res = await apiRequest("POST", "/api/jobs", jobData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] });
      setLocation("/employer/dashboard");
    },
  });
  
  const onSubmit = (data: JobFormValues) => {
    createJobMutation.mutate(data);
  };
  
  // Audio description
  const createJobAudio = t("employer.createJob.audioDescription");
  
  // Generate job preview
  const formValues = form.getValues();
  const hasFormValues = formValues.title && formValues.description;
  
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow pb-20 md:pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <a href="/employer/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{t("employer.createJob.title")}</h1>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <SectionHeading 
                      title={t("employer.createJob.jobInfo")}
                      description={t("employer.createJob.jobInfoDesc")}
                    />
                    <AudioButton 
                      text={createJobAudio}
                      size="sm"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("employer.createJob.jobTitle")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("employer.createJob.jobTitlePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("employer.createJob.description")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("employer.createJob.descriptionPlaceholder")}
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("employer.createJob.jobType")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("employer.createJob.selectType")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {jobTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {t(`jobTypes.${type}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("employer.createJob.sector")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("employer.createJob.selectSector")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sectors.map((sector) => (
                                  <SelectItem key={sector} value={sector}>
                                    {t(`sectors.${sector}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("employer.createJob.location")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("employer.createJob.locationPlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("employer.createJob.startDate")}</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("employer.createJob.duration")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("employer.createJob.durationPlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <SectionHeading 
                    title={t("employer.createJob.contactInfo")}
                    description={t("employer.createJob.contactInfoDesc")}
                  />
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="useProfileInfo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                handleUseProfileInfo(checked as boolean);
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {t("employer.createJob.useProfileInfo")}
                            </FormLabel>
                            <FormDescription>
                              {t("employer.createJob.useProfileInfoDesc")}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("employer.createJob.contactName")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("employer.createJob.contactNamePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("employer.createJob.contactPhone")}</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder={t("employer.createJob.contactPhonePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("employer.createJob.contactEmail")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("employer.createJob.contactEmailPlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactPreferences"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">
                              {t("employer.createJob.contactPreferences")}
                            </FormLabel>
                            <FormDescription>
                              {t("employer.createJob.contactPreferencesDesc")}
                            </FormDescription>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <FormField
                              control={form.control}
                              name="contactPreferences"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("phone")}
                                      onCheckedChange={(checked) => {
                                        const currentValues = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentValues, "phone"]);
                                        } else {
                                          field.onChange(currentValues.filter(value => value !== "phone"));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {t("contact.phone")}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="contactPreferences"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("whatsapp")}
                                      onCheckedChange={(checked) => {
                                        const currentValues = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentValues, "whatsapp"]);
                                        } else {
                                          field.onChange(currentValues.filter(value => value !== "whatsapp"));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {t("contact.whatsapp")}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="contactPreferences"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("email")}
                                      onCheckedChange={(checked) => {
                                        const currentValues = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentValues, "email"]);
                                        } else {
                                          field.onChange(currentValues.filter(value => value !== "email"));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {t("contact.email")}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <SectionHeading 
                    title={t("employer.createJob.preview")}
                    description={t("employer.createJob.previewDesc")}
                  />
                  
                  {hasFormValues ? (
                    <div className="border border-border rounded-lg p-4 hover:border-primary hover:shadow-sm transition mb-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-foreground">{formValues.title || t("employer.createJob.jobTitlePlaceholder")}</h3>
                        <span className="text-primary text-sm">{t("employer.createJob.draft")}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{formValues.description || t("employer.createJob.descriptionPlaceholder")}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-muted px-2.5 py-1 rounded-full text-xs text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {formValues.location || t("employer.createJob.locationPlaceholder")}
                        </span>
                        <span className="bg-muted px-2.5 py-1 rounded-full text-xs text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2"></path>
                          </svg>
                          {formValues.type ? t(`jobTypes.${formValues.type}`) : t("employer.createJob.selectType")}
                        </span>
                        <span className="bg-muted px-2.5 py-1 rounded-full text-xs text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {formValues.startDate ? new Date(formValues.startDate).toLocaleDateString() : t("employer.createJob.startDatePlaceholder")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="default" className="gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          {t("jobs.viewDetails")}
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.967-.94 1.164-.173.197-.347.148-.647-.05-.3-.2-1.267-.465-2.414-1.485-.893-.795-1.494-1.777-1.668-2.078-.174-.3-.019-.462.13-.612.134-.13.3-.345.45-.52.149-.174.199-.3.3-.498.099-.2.05-.374-.025-.524-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                            <path d="M13.507 21.5h.001c3.142 0 6.142-1.236 8.37-3.473a11.948 11.948 0 003.468-8.413c0-6.633-5.4-12.023-12.046-12.023-2.324 0-4.563.675-6.48 1.95C2.764 2.371 1.107 7.127 1.112 12.24c.002 2.1.577 4.154 1.67 5.942a11.96 11.96 0 10.738 11.773l-7.9-.001L4.5 21.5h9.007z" />
                          </svg>
                          {t("contact.contact")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted rounded-lg mb-6">
                      <p className="text-muted-foreground">
                        {t("employer.createJob.fillFormToPreview")}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Button type="button" variant="outline">
                      {t("employer.createJob.saveDraft")}
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createJobMutation.isPending}
                    >
                      {createJobMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {t("employer.createJob.publishJob")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </main>
      
      <MobileNavbar />
      
      <Footer />
    </div>
  );
}
