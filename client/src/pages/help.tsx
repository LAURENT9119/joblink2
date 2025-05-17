
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useTranslation } from "@/hooks/use-translation";

export default function HelpPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">{t("footer.help")}</h1>
        <div className="prose max-w-none">
          <h2>Comment ça marche ?</h2>
          <p>Guide d'utilisation et FAQ...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
