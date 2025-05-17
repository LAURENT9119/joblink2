import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import JobSeekerDashboard from "./pages/job-seeker/dashboard";
import JobSeekerProfile from "./pages/job-seeker/profile";
import JobSeekerSearch from "./pages/job-seeker/search";
import JobDetail from "./pages/job-seeker/job-detail";
import EmployerDashboard from "./pages/employer/dashboard";
import CreateJob from "./pages/employer/create-job";
import Candidates from "./pages/employer/candidates";
import { AuthProvider } from "./hooks/use-auth";
import { TranslationProvider } from "./hooks/use-translation";
import HowItWorks from "./pages/how-it-works";
import About from "./pages/about";
import Contact from "./pages/contact";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import ResetPassword from "./pages/reset-password";

function Router() {
  const { user } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth">
        {user ? (
          <Redirect to={user.role === "job_seeker" ? "/job-seeker/dashboard" : "/employer/dashboard"} />
        ) : (
          <AuthPage />
        )}
      </Route>
      
      {/* Job Seeker Routes */}
      <ProtectedRoute path="/job-seeker/dashboard" component={JobSeekerDashboard} />
      <ProtectedRoute path="/job-seeker/profile" component={JobSeekerProfile} />
      <ProtectedRoute path="/job-seeker/search" component={JobSeekerSearch} />
      <ProtectedRoute path="/job-seeker/job/:id" component={JobDetail} />
      
      {/* Employer Routes */}
      <ProtectedRoute path="/employer/dashboard" component={EmployerDashboard} />
      <ProtectedRoute path="/employer/create-job" component={CreateJob} />
      <ProtectedRoute path="/employer/candidates" component={Candidates} />
      
      {/* Information Pages */}
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/reset-password" component={ResetPassword} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </TranslationProvider>
  );
}

export default App;
