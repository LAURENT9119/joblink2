import { Link } from "wouter";
import { useTranslation } from "@/hooks/use-translation";
import { 
  Facebook, Instagram, Twitter, Phone, 
  Mail, MapPin, Link as LinkIcon,
} from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <LinkIcon className="text-primary-300 h-5 w-5 mr-1" />
              JobLink
            </h3>
            <p className="text-primary-100 text-sm">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition">
                  {t("navigation.home")}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  {t("navigation.howItWorks")}
                </Link>
              </li>
              <li>
                <Link href="/job-seeker/search" className="hover:text-white transition">
                  {t("navigation.searchJobs")}
                </Link>
              </li>
              <li>
                <Link href="/employer/create-job" className="hover:text-white transition">
                  {t("navigation.postJob")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/help" className="hover:text-white transition">
                  {t("footer.help")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  {t("navigation.contact")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  {t("navigation.about")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.followUs")}</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://wa.me/1234567890" className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.967-.94 1.164-.173.197-.347.148-.647-.05-.3-.2-1.267-.465-2.414-1.485-.893-.795-1.494-1.777-1.668-2.078-.174-.3-.019-.462.13-.612.134-.13.3-.345.45-.52.149-.174.199-.3.3-.498.099-.2.05-.374-.025-.524-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                  <path d="M13.507 21.5h.001c3.142 0 6.142-1.236 8.37-3.473a11.948 11.948 0 003.468-8.413c0-6.633-5.4-12.023-12.046-12.023-2.324 0-4.563.675-6.48 1.95C2.764 2.371 1.107 7.127 1.112 12.24c.002 2.1.577 4.154 1.67 5.942a11.96 11.96 0 10.738 11.773l-7.9-.001L4.5 21.5h9.007z" />
                </svg>
              </a>
            </div>

            <div className="mt-4 space-y-2 text-sm text-neutral-light">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+221 78 123 45 67</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@joblink.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Dakar, Sénégal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-dark mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-light text-sm mb-4 md:mb-0">
            &copy; {currentYear} JobLink. {t("footer.allRightsReserved")}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-neutral-light text-sm hover:text-white transition">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="text-neutral-light text-sm hover:text-white transition">
              {t("footer.terms")}
            </Link>
            <Link href="/cookies" className="text-neutral-light text-sm hover:text-white transition">
              {t("footer.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}