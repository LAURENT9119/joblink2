import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { AudioButton } from "@/components/ui/audio-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function CreateJob() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate("/employer/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />

      <main className="container mx-auto px-4 py-6 flex-grow pb-20 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {t("employer.createJob.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("employer.createJob.subtitle")}
            </p>
          </div>
          <AudioButton text={t("employer.createJob.audioDescription")} />
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">{t("employer.createJob.jobTitle")}</Label>
                  <Input
                    id="title"
                    {...register("title", { required: true })}
                    placeholder={t("employer.createJob.jobTitlePlaceholder")}
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t("employer.createJob.description")}</Label>
                  <Textarea
                    id="description"
                    {...register("description", { required: true })}
                    placeholder={t("employer.createJob.descriptionPlaceholder")}
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="sector">{t("employer.createJob.sector")}</Label>
                  <Select
                    id="sector"
                    {...register("sector", { required: true })}
                  >
                    <option value="retail">{t("sectors.retail")}</option>
                    <option value="hospitality">{t("sectors.hospitality")}</option>
                    <option value="construction">{t("sectors.construction")}</option>
                    <option value="manufacturing">{t("sectors.manufacturing")}</option>
                    <option value="other">{t("sectors.other")}</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">{t("employer.createJob.location")}</Label>
                  <Input
                    id="location"
                    {...register("location", { required: true })}
                    placeholder={t("employer.createJob.locationPlaceholder")}
                  />
                </div>

                <div>
                  <Label htmlFor="salary">{t("employer.createJob.salary")}</Label>
                  <Input
                    id="salary"
                    type="number"
                    {...register("salary", { required: true })}
                    placeholder={t("employer.createJob.salaryPlaceholder")}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("common.submitting") : t("employer.createJob.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <MobileNavbar />
      <Footer />
    </div>
  );
}