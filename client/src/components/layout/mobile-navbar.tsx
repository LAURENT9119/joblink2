import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Link, useLocation } from "wouter";
import { Home, Search, Bookmark, User, Briefcase, Building, UserSearch, Plus } from "lucide-react";

export function MobileNavbar() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [location] = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location === path;
  
  // For job seekers
  if (user.role === "job_seeker") {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex items-center justify-around py-2 md:hidden z-40">
        <Link href="/job-seeker/dashboard" 
          className={`flex flex-col items-center py-1 px-3 ${isActive("/job-seeker/dashboard") ? "text-primary" : "text-muted-foreground hover:text-primary transition"}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">{t("navigation.home")}</span>
        </Link>
        
        <Link href="/job-seeker/search" 
          className={`flex flex-col items-center py-1 px-3 ${isActive("/job-seeker/search") ? "text-primary" : "text-muted-foreground hover:text-primary transition"}`}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">{t("navigation.search")}</span>
        </Link>
        
        <Link href="/job-seeker/saved-jobs" 
          className={`flex flex-col items-center py-1 px-3 ${isActive("/job-seeker/saved-jobs") ? "text-primary" : "text-muted-foreground hover:text-primary transition"}`}
        >
          <Bookmark className="h-5 w-5" />
          <span className="text-xs mt-1">{t("navigation.saved")}</span>
        </Link>
        
        <Link href="/job-seeker/profile" 
          className={`flex flex-col items-center py-1 px-3 ${isActive("/job-seeker/profile") ? "text-primary" : "text-muted-foreground hover:text-primary transition"}`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">{t("navigation.profile")}</span>
        </Link>
      </nav>
    );
  }
  
  // For employers
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex items-center justify-around py-2 md:hidden z-40">
      <Link href="/employer/dashboard" 
        className={`flex flex-col items-center py-1 px-3 ${isActive("/employer/dashboard") ? "text-primary" : "text-muted-foreground hover:text-primary transition"}`}
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">{t("navigation.home")}</span>
      </Link>
      
      <Link href="/employer/jobs" 
        className={`flex flex-col items-center py-1 px-3 ${isActive("/employer/jobs") ? "text-primary" : "text-muted-foreground hover:text-primary transition"}`}
      >
        <Briefcase className="h-5 w-5" />
        <span className="text-xs mt-1">{t("navigation.jobs")}</span>
      </Link>
      
      <Link href="/employer/create-job" 
        className={`flex flex-col items-center py-1 px-3 ${isActive("/employer/create-job") ? "text-primary" : "text-muted-foreground hover:text-primary transition"}`}
      >
        <Plus className="h-5 w-5" />
        <span className="text-xs mt-1">{t("navigation.post")}</span>
      </Link>
      
      <Link href="/employer/candidates" 
        className={`flex flex-col items-center py-1 px-3 ${isActive("/employer/candidates") ? "text-primary" : "text-muted-foreground hover:text-primary transition"}`}
      >
        <UserSearch className="h-5 w-5" />
        <span className="text-xs mt-1">{t("navigation.candidates")}</span>
      </Link>
    </nav>
  );
}
