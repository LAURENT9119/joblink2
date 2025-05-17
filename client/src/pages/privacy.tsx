import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useTranslation } from "@/hooks/use-translation";
import { AudioButton } from "@/components/ui/audio-button";

export default function PrivacyPage() {
  const { t } = useTranslation();
  
  // Audio text for the page
  const privacyAudioIntro = "Bienvenue sur la page de politique de confidentialité de JobLink. Cette page explique comment nous collectons, utilisons et protégeons vos données personnelles. Votre vie privée est importante pour nous.";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-primary-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("footer.privacy")}
              </h1>
              <div className="flex mb-6">
                <AudioButton text={privacyAudioIntro} withLabel={true} />
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
              
              <h2>1. Introduction</h2>
              <p>
                Chez JobLink, nous nous engageons à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre plateforme.
              </p>
              
              <h2>2. Informations que nous collectons</h2>
              <p>
                Nous collectons les types d'informations suivants :
              </p>
              <ul>
                <li><strong>Informations d'identification</strong> : nom, prénom, adresse e-mail, numéro de téléphone, mot de passe.</li>
                <li><strong>Informations de profil</strong> : photo, âge, localisation, compétences, expériences professionnelles, secteurs d'intérêt, présentations audio.</li>
                <li><strong>Informations d'utilisation</strong> : interactions avec la plateforme, recherches effectuées, offres consultées, candidatures envoyées.</li>
                <li><strong>Informations techniques</strong> : adresse IP, type d'appareil, navigateur, pages visitées, durée des visites.</li>
              </ul>
              
              <h2>3. Comment nous utilisons vos informations</h2>
              <p>
                Nous utilisons vos informations pour :
              </p>
              <ul>
                <li>Fournir, maintenir et améliorer notre plateforme</li>
                <li>Créer et gérer votre compte</li>
                <li>Faciliter la mise en relation entre chercheurs d'emploi et employeurs</li>
                <li>Vous envoyer des notifications sur les nouvelles opportunités ou candidatures</li>
                <li>Personnaliser votre expérience sur la plateforme</li>
                <li>Analyser l'utilisation de notre plateforme pour l'améliorer</li>
                <li>Prévenir les activités frauduleuses et assurer la sécurité</li>
              </ul>
              
              <h2>4. Partage de vos informations</h2>
              <p>
                Nous pouvons partager vos informations dans les circonstances suivantes :
              </p>
              <ul>
                <li><strong>Avec les autres utilisateurs</strong> : Lorsque vous postulez à une offre ou publiez une offre, certaines de vos informations seront visibles par l'autre partie.</li>
                <li><strong>Prestataires de services</strong> : Nous travaillons avec des tiers qui nous aident à fournir et à améliorer notre service (hébergement, analyse, etc.).</li>
                <li><strong>Obligations légales</strong> : Si nous sommes tenus de divulguer vos informations pour nous conformer à la loi ou pour protéger nos droits.</li>
              </ul>
              
              <h2>5. Vos droits</h2>
              <p>
                Vous disposez des droits suivants concernant vos données personnelles :
              </p>
              <ul>
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
              <p>
                Pour exercer ces droits, veuillez nous contacter à privacy@joblink.com.
              </p>
              
              <h2>6. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre l'accès, la divulgation, la modification ou la destruction non autorisés.
              </p>
              
              <h2>7. Conservation des données</h2>
              <p>
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. Si vous supprimez votre compte, nous supprimerons ou anonymiserons vos informations dans un délai raisonnable.
              </p>
              
              <h2>8. Transferts internationaux</h2>
              <p>
                Vos informations peuvent être transférées et traitées dans des pays autres que celui où vous résidez. Ces pays peuvent avoir des lois différentes sur la protection des données.
              </p>
              
              <h2>9. Modifications de la politique de confidentialité</h2>
              <p>
                Nous pouvons modifier cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement significatif par e-mail ou par une notification sur notre plateforme.
              </p>
              
              <h2>10. Contact</h2>
              <p>
                Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à privacy@joblink.com.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}