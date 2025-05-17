import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, User, Briefcase, Search, 
  LogOut, Menu, X, Link as LinkIcon
} from "lucide-react";
import { useState } from "react";

export function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center">
          <LinkIcon className="h-6 w-6 mr-1" />
          JobLink
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-10 h-10 rounded-full p-0">
                  <span className="sr-only">{t("common.openUserMenu")}</span>
                  <div className="relative w-8 h-8 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                    {user.profilePhotoUrl ? (
                      <img 
                        src={user.profilePhotoUrl} 
                        alt={t("profile.profilePhoto")}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.firstName} {user.lastName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {user.role === "job_seeker" ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/job-seeker/dashboard">{t("navigation.dashboard")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/job-seeker/profile">{t("navigation.profile")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/job-seeker/search">{t("navigation.searchJobs")}</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/employer/dashboard">{t("navigation.dashboard")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/employer/create-job">{t("navigation.postJob")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/employer/candidates">{t("navigation.candidates")}</Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => auth.logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("auth.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        {!user && (
          <nav className="hidden lg:flex items-center gap-4">
            <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition">
              {t("navigation.howItWorks")}
            </Link>
            <Link href="/#about" className="text-muted-foreground hover:text-foreground transition">
              {t("navigation.about")}
            </Link>
            <Link href="/#contact" className="text-muted-foreground hover:text-foreground transition">
              {t("navigation.contact")}
            </Link>
            <Link href="/auth" className="bg-muted text-foreground px-4 py-2 rounded-full border border-border font-medium hover:bg-muted/80 transition">
              {t("auth.register")}
            </Link>
            <Link href="/auth?tab=login" className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition">
              {t("auth.login")}
            </Link>
          </nav>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && !user && (
        <div className="lg:hidden bg-white border-t border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link href="/#how-it-works" 
              className="text-muted-foreground hover:text-foreground transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("navigation.howItWorks")}
            </Link>
            <Link href="/#about" 
              className="text-muted-foreground hover:text-foreground transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("navigation.about")}
            </Link>
            <Link href="/#contact" 
              className="text-muted-foreground hover:text-foreground transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("navigation.contact")}
            </Link>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/auth" 
                className="bg-muted text-foreground px-4 py-2 rounded-full border border-border font-medium hover:bg-muted/80 transition text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("auth.register")}
              </Link>
              <Link href="/auth?tab=login" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("auth.login")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
