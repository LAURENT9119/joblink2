import { useTranslation } from "@/hooks/use-translation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AudioButton } from "@/components/ui/audio-button";
import { Link } from "wouter";

export default function About() {
  const { t } = useTranslation();
  
  // Audio descriptions for accessibility
  const missionAudio = "Notre mission est de créer une plateforme de recrutement inclusive qui met en relation les chercheurs d'emploi et les entreprises, en surmontant les barrières liées au niveau d'alphabétisation et aux compétences numériques.";
  const visionAudio = "Notre vision est de transformer le marché du travail en le rendant accessible à tous, indépendamment de leur niveau d'éducation ou de leurs compétences technologiques.";
  const valuesAudio = "Nos valeurs fondamentales sont l'inclusion, l'accessibilité, et l'innovation. Nous croyons que tout le monde mérite un accès égal aux opportunités d'emploi.";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t("about.title")}
            </h1>
            <p className="text-xl max-w-2xl">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
        
        <div className="container px-4 py-12">
          <div className="grid gap-12 md:gap-16">
            {/* Our Story */}
            <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">{t("about.ourStory")}</h2>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <p className="mb-4">
                    {t("about.storyPara1")}
                  </p>
                  <p className="mb-4">
                    {t("about.storyPara2")}
                  </p>
                  <p>
                    {t("about.storyPara3")}
                  </p>
                </div>
                
                <div className="bg-muted rounded-xl overflow-hidden flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">JobLink</h3>
                    <p className="text-muted-foreground">
                      {t("about.foundedYear")}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Mission, Vision, Values */}
            <section className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
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
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold">{t("about.mission")}</h2>
                  <AudioButton text={missionAudio} />
                </div>
                
                <p className="text-muted-foreground">
                  {t("about.missionText")}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
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
                      <circle cx="12" cy="12" r="2"></circle>
                      <path d="M12 2v4"></path>
                      <path d="M12 18v4"></path>
                      <path d="m4.93 4.93 2.83 2.83"></path>
                      <path d="m16.24 16.24 2.83 2.83"></path>
                      <path d="M2 12h4"></path>
                      <path d="M18 12h4"></path>
                      <path d="m4.93 19.07 2.83-2.83"></path>
                      <path d="m16.24 7.76 2.83-2.83"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold">{t("about.vision")}</h2>
                  <AudioButton text={visionAudio} />
                </div>
                
                <p className="text-muted-foreground">
                  {t("about.visionText")}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
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
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold">{t("about.values")}</h2>
                  <AudioButton text={valuesAudio} />
                </div>
                
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{t("about.value1")}</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{t("about.value2")}</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{t("about.value3")}</span>
                  </li>
                </ul>
              </div>
            </section>
            
            {/* Our Team */}
            <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">{t("about.ourTeam")}</h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold">{t("about.teamMember1Name")}</h3>
                  <p className="text-sm text-muted-foreground">{t("about.teamMember1Role")}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold">{t("about.teamMember2Name")}</h3>
                  <p className="text-sm text-muted-foreground">{t("about.teamMember2Role")}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold">{t("about.teamMember3Name")}</h3>
                  <p className="text-sm text-muted-foreground">{t("about.teamMember3Role")}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold">{t("about.teamMember4Name")}</h3>
                  <p className="text-sm text-muted-foreground">{t("about.teamMember4Role")}</p>
                </div>
              </div>
            </section>
            
            {/* CTA */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("about.joinUs")}</h2>
              <p className="max-w-2xl mx-auto mb-6">{t("about.joinUsText")}</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/auth?tab=register" className="bg-white text-primary hover:bg-primary-foreground/90 transition px-6 py-2 rounded-md font-medium">
                  {t("about.getStarted")}
                </Link>
                <Link href="/contact" className="bg-transparent hover:bg-primary-foreground/10 border border-primary-foreground transition px-6 py-2 rounded-md font-medium">
                  {t("about.contactUs")}
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}