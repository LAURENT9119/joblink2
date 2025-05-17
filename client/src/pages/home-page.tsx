import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/hooks/use-auth";
import { AudioButton } from "@/components/ui/audio-button";
import { Button } from "@/components/ui/button";
import { Search, Plus, CheckCircle, UserPlus, Search as SearchIcon, MessageSquare, Volume2, Smartphone } from "lucide-react";

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Audio description for the landing page
  const introductionAudio = t("home.audioIntroduction");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-10 md:py-16 lg:py-20 bg-gradient-to-br from-white to-muted">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {t("home.hero.title")} <span className="text-primary">{t("home.hero.titleHighlight")}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-lg">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button asChild size="lg" className="gap-2">
                <Link href={user?.role === "job_seeker" ? "/job-seeker/search" : "/auth"}>
                  <Search className="h-5 w-5" />
                  {t("home.hero.findJob")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link href={user?.role === "employer" ? "/employer/create-job" : "/auth"}>
                  <Plus className="h-5 w-5" />
                  {t("home.hero.postJob")}
                </Link>
              </Button>
            </div>
            
            {/* Audio Introduction */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm w-fit">
              <AudioButton text={introductionAudio} withLabel={true} />
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            {/* A diverse group of job seekers looking at mobile phones with the JobLink app */}
            <img 
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt={t("home.hero.imageAlt")}
              className="rounded-xl shadow-xl w-full h-auto object-cover"
            />
            <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xl font-bold">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-foreground">1200+</p>
                  <p className="text-sm text-muted-foreground">{t("home.hero.jobsFound")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats (Mobile only) */}
        <div className="container mx-auto px-4 mt-8 md:hidden">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xl font-bold">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-foreground">1200+</p>
                <p className="text-sm text-muted-foreground">{t("home.hero.jobsFound")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("home.howItWorks.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("home.howItWorks.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <UserPlus className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("home.howItWorks.step1.title")}</h3>
              <p className="text-muted-foreground">{t("home.howItWorks.step1.description")}</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <SearchIcon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("home.howItWorks.step2.title")}</h3>
              <p className="text-muted-foreground">{t("home.howItWorks.step2.description")}</p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("home.howItWorks.step3.title")}</h3>
              <p className="text-muted-foreground">{t("home.howItWorks.step3.description")}</p>
            </div>
            
            {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("home.howItWorks.step4.title")}</h3>
              <p className="text-muted-foreground">{t("home.howItWorks.step4.description")}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("home.features.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("home.features.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 5h7"></path>
                  <path d="M9 5h7"></path>
                  <path d="M16 5h6"></path>
                  <path d="M3 9h7"></path>
                  <path d="M10 9h10"></path>
                  <path d="M20 9h1"></path>
                  <path d="M3 13h2"></path>
                  <path d="M5 13h10"></path>
                  <path d="M15 13h6"></path>
                  <path d="M5 17h2"></path>
                  <path d="M7 17h9"></path>
                  <path d="M16 17h3"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("home.features.feature1.title")}</h3>
              <p className="text-muted-foreground">{t("home.features.feature1.description")}</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary mb-4">
                <Volume2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("home.features.feature2.title")}</h3>
              <p className="text-muted-foreground">{t("home.features.feature2.description")}</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.967-.94 1.164-.173.197-.347.148-.647-.05-.3-.2-1.267-.465-2.414-1.485-.893-.795-1.494-1.777-1.668-2.078-.174-.3-.019-.462.13-.612.134-.13.3-.345.45-.52.149-.174.199-.3.3-.498.099-.2.05-.374-.025-.524-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                  <path d="M13.507 21.5h.001c3.142 0 6.142-1.236 8.37-3.473a11.948 11.948 0 003.468-8.413c0-6.633-5.4-12.023-12.046-12.023-2.324 0-4.563.675-6.48 1.95C2.764 2.371 1.107 7.127 1.112 12.24c.002 2.1.577 4.154 1.67 5.942a11.96 11.96 0 10.738 11.773l-7.9-.001L4.5 21.5h9.007z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("home.features.feature3.title")}</h3>
              <p className="text-muted-foreground">{t("home.features.feature3.description")}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("home.testimonials.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("home.testimonials.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-muted p-6 rounded-xl">
              <div className="flex items-start gap-4">
                {/* A professional-looking woman smiling at the camera */}
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200" alt={t("home.testimonials.testimonial1.name")} className="w-16 h-16 rounded-full object-cover"/>
                <div>
                  <h4 className="font-semibold text-lg">{t("home.testimonials.testimonial1.name")}</h4>
                  <p className="text-muted-foreground text-sm mb-3">{t("home.testimonials.testimonial1.role")}</p>
                  <p className="text-muted-foreground">{t("home.testimonials.testimonial1.quote")}</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-muted p-6 rounded-xl">
              <div className="flex items-start gap-4">
                {/* A professional-looking man in business attire */}
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200" alt={t("home.testimonials.testimonial2.name")} className="w-16 h-16 rounded-full object-cover"/>
                <div>
                  <h4 className="font-semibold text-lg">{t("home.testimonials.testimonial2.name")}</h4>
                  <p className="text-muted-foreground text-sm mb-3">{t("home.testimonials.testimonial2.role")}</p>
                  <p className="text-muted-foreground">{t("home.testimonials.testimonial2.quote")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-12 md:py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{t("home.cta.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("home.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href={user?.role === "job_seeker" ? "/job-seeker/search" : "/auth"}>
                <Search className="h-5 w-5" />
                {t("home.cta.findJob")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link href={user?.role === "employer" ? "/employer/create-job" : "/auth"}>
                <Plus className="h-5 w-5" />
                {t("home.cta.postJob")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
