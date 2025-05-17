import { Switch, Route, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { TranslationProvider } from "@/hooks/use-translation"; 
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import JobSeekerDashboard from "@/pages/job-seeker/dashboard";
import JobSeekerProfile from "@/pages/job-seeker/profile";
import JobSeekerSearch from "@/pages/job-seeker/search";
import JobDetail from "@/pages/job-seeker/job-detail";
import EmployerDashboard from "@/pages/employer/dashboard";
import CreateJob from "@/pages/employer/create-job";
import Candidates from "@/pages/employer/candidates";
import HowItWorks from "@/pages/how-it-works";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import ResetPassword from "@/pages/reset-password";
import HelpPage from "@/pages/help-page";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/auth" component={AuthPage} />
              <ProtectedRoute path="/job-seeker/dashboard" component={JobSeekerDashboard} />
              <ProtectedRoute path="/job-seeker/profile" component={JobSeekerProfile} />
              <ProtectedRoute path="/job-seeker/search" component={JobSeekerSearch} />
              <ProtectedRoute path="/job-seeker/job/:id" component={JobDetail} />
              <ProtectedRoute path="/employer/dashboard" component={EmployerDashboard} />
              <ProtectedRoute path="/employer/create-job" component={CreateJob} />
              <ProtectedRoute path="/employer/candidates" component={Candidates} />
              <Route path="/how-it-works" component={HowItWorks} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/terms" component={Terms} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/help" component={HelpPage} />
              <Route component={NotFound} />
            </Switch>
          </TooltipProvider>
        </AuthProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

export default App;