
import { useTranslation } from "@/hooks/use-translation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AudioButton } from "@/components/ui/audio-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const { t } = useTranslation();
  
  const faqAudioIntro = "Bienvenue sur la page des questions fréquentes. Ici, vous trouverez des réponses aux questions les plus courantes sur l'utilisation de JobLink.";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-primary-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("footer.faq")}
              </h1>
              <div className="flex mb-6">
                <AudioButton text={faqAudioIntro} withLabel={true} />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Comment créer un compte sur JobLink ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Pour créer un compte, cliquez sur "S'inscrire" en haut de la page. Choisissez votre rôle (chercheur d'emploi ou employeur), remplissez vos informations et suivez les instructions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Comment postuler à une offre d'emploi ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Connectez-vous à votre compte, trouvez l'offre qui vous intéresse et cliquez sur "Postuler". Vous pouvez ensuite contacter directement l'employeur via WhatsApp ou téléphone.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Comment publier une offre d'emploi ?
                  </AccordionTrigger>
                  <AccordionContent>
                    En tant qu'employeur, connectez-vous et cliquez sur "Publier une offre". Remplissez les détails du poste, ajoutez une description et vos coordonnées de contact.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Comment utiliser les fonctionnalités audio ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Cherchez les icônes audio sur la plateforme. Cliquez dessus pour écouter les descriptions, instructions et contenus en format audio.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    Comment changer la langue de l'application ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Utilisez le sélecteur de langue en haut de la page pour choisir entre français et wolof.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    Comment contacter le support ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Visitez notre page Contact pour nous joindre par email, téléphone ou via nos réseaux sociaux.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
