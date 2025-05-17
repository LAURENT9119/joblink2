
import { useTranslation } from "@/hooks/use-translation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AudioButton } from "@/components/ui/audio-button";

export default function TermsPage() {
  const { t } = useTranslation();
  
  const termsAudioIntro = "Bienvenue sur la page des conditions d'utilisation de JobLink. Cette page détaille les termes et conditions qui régissent l'utilisation de notre plateforme.";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-primary-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("footer.terms")}
              </h1>
              <div className="flex mb-6">
                <AudioButton text={termsAudioIntro} withLabel={true} />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose">
              <p className="text-lg font-medium">
                Dernière mise à jour : 17 mai 2025
              </p>
              
              <h2>1. Acceptation des conditions</h2>
              <p>
                En utilisant JobLink, vous acceptez d'être lié par ces conditions d'utilisation.
              </p>
              
              <h2>2. Services proposés</h2>
              <p>
                JobLink est une plateforme de mise en relation entre chercheurs d'emploi et employeurs.
              </p>
              
              <h2>3. Utilisation du service</h2>
              <p>
                Les utilisateurs s'engagent à fournir des informations exactes et à utiliser le service de manière responsable.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
