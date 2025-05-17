
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, Job, Application } from "@shared/schema";
import { Users, Briefcase, FileText, Settings } from "lucide-react";

export default function AdminDashboard() {
  const { t } = useTranslation();
  
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: jobs } = useQuery<Job[]>({
    queryKey: ["/api/admin/jobs"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">{t("admin.dashboard")}</h1>
        
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              {t("admin.users")}
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="w-4 h-4 mr-2" />
              {t("admin.jobs")}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              {t("admin.settings")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.userManagement")}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* User management table */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.jobManagement")}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Job management table */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
