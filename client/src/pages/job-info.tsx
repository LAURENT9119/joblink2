
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AudioButton } from "@/components/ui/audio-button";

export default function JobInfoPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">{t("jobInfo.title")}</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("jobInfo.description")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t("jobInfo.descriptionText")}</p>
            <AudioButton text={t("jobInfo.descriptionText")} />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("jobInfo.skills")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["communication", "ponctualité", "organisation"].map((skill) => (
                <Badge key={skill} variant="secondary">
                  {t(`jobInfo.skills.${skill}`)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("jobInfo.salary")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("jobInfo.salaryRange")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("jobInfo.examples")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>{t("jobInfo.example1")}</li>
              <li>{t("jobInfo.example2")}</li>
              <li>{t("jobInfo.example3")}</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
