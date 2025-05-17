import { useTranslation } from "@/hooks/use-translation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AudioButton } from "@/components/ui/audio-button";
import { Link } from "wouter";

export default function HowItWorksPage() {
  const { t } = useTranslation();

  // Audio descriptions for accessibility
  const jobSeekersAudio = "En tant que chercheur d'emploi, vous pouvez créer un profil, rechercher des emplois, postuler et suivre vos candidatures. L'interface est conçue pour être simple et accessible.";
  const employersAudio = "En tant qu'employeur, vous pouvez créer votre profil d'entreprise, publier des offres d'emploi, et examiner les candidatures reçues. Vous pouvez également contacter directement les candidats qui vous intéressent.";
  const accessibilityAudio = "JobLink est conçu pour être accessible à tous. Vous pouvez utiliser les fonctionnalités audio pour écouter le contenu, choisir votre langue préférée, et naviguer facilement dans l'application.";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t("howItWorks.title")}
            </h1>
            <p className="text-xl max-w-2xl">
              {t("howItWorks.subtitle")}
            </p>
          </div>
        </div>
        
        <div className="container px-4 py-12">
          <div className="grid gap-12 md:gap-16">
            {/* For Job Seekers */}
            <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="7" r="4" />
                    <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">{t("howItWorks.forJobSeekers")}</h2>
                <AudioButton text={jobSeekersAudio} />
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">{t("howItWorks.createProfile")}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("howItWorks.createProfileDesc")}
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">{t("howItWorks.searchJobs")}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("howItWorks.searchJobsDesc")}
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">{t("howItWorks.applyJobs")}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("howItWorks.applyJobsDesc")}
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">{t("howItWorks.trackApplications")}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("howItWorks.trackApplicationsDesc")}
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/auth?tab=register" className="text-primary hover:underline font-medium">
                  {t("howItWorks.getStartedAsJobSeeker")} →
                </Link>
              </div>
            </section>
            
            {/* For Employers */}
            <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">{t("howItWorks.forEmployers")}</h2>
                <AudioButton text={employersAudio} />
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">{t("howItWorks.createCompanyProfile")}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("howItWorks.createCompanyProfileDesc")}
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">{t("howItWorks.postJobs")}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("howItWorks.postJobsDesc")}
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">{t("howItWorks.reviewApplications")}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("howItWorks.reviewApplicationsDesc")}
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">{t("howItWorks.contactCandidates")}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("howItWorks.contactCandidatesDesc")}
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/auth?tab=register" className="text-primary hover:underline font-medium">
                  {t("howItWorks.getStartedAsEmployer")} →
                </Link>
              </div>
            </section>
            
            {/* Accessibility */}
            <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2Z"></path>
                    <path d="M6 11V7"></path>
                    <path d="M10 11V7"></path>
                    <path d="M14 11V7"></path>
                    <path d="M18 11V7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">{t("howItWorks.accessibility")}</h2>
                <AudioButton text={accessibilityAudio} />
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">{t("howItWorks.audioFeatures")}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("howItWorks.audioFeaturesDesc")}
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 8 6 6"></path>
                      <path d="m4 14 6-6 2-3"></path>
                      <path d="M2 5h12"></path>
                      <path d="M7 2h1"></path>
                      <path d="m22 22-5-5"></path>
                      <path d="M17 22v-5h-5"></path>
                      <path d="M22 17h-5"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">{t("howItWorks.multilingualSupport")}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("howItWorks.multilingualSupportDesc")}
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">{t("howItWorks.simpleInterface")}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t("howItWorks.simpleInterfaceDesc")}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}