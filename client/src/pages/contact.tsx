import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "@/hooks/use-translation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AudioButton } from "@/components/ui/audio-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please enter a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Audio descriptions for accessibility
  const formAudio = "Utilisez ce formulaire pour nous contacter. Veuillez remplir tous les champs obligatoires: votre nom, votre adresse e-mail, le sujet et votre message. Nous vous répondrons dans les plus brefs délais.";
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  
  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    
    // In a real application, this would send the form data to a server
    console.log("Form data:", data);
    
    // Simulate API request
    setTimeout(() => {
      toast({
        title: t("contact.messageSent"),
        description: t("contact.messageSentDesc"),
      });
      
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t("contact.title")}
            </h1>
            <p className="text-xl max-w-2xl">
              {t("contact.subtitle")}
            </p>
          </div>
        </div>
        
        <div className="container px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border h-full">
                <h2 className="text-2xl font-bold mb-6">{t("contact.getInTouch")}</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.email")}</h3>
                      <p className="text-muted-foreground">contact@joblink.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.phone")}</h3>
                      <p className="text-muted-foreground">+221 33 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.address")}</h3>
                      <p className="text-muted-foreground">
                        JobLink Inc.<br />
                        123 Rue Principale<br />
                        Dakar, Sénégal
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="font-semibold mb-3">{t("contact.followUs")}</h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-muted w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted/80 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="bg-muted w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted/80 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="bg-muted w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted/80 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="bg-muted w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted/80 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold">{t("contact.sendMessage")}</h2>
                  <AudioButton text={formAudio} />
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.yourName")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("contact.yourNamePlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.yourEmail")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("contact.yourEmailPlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.subject")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("contact.subjectPlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.message")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t("contact.messagePlaceholder")}
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t("contact.sending")}
                        </>
                      ) : (
                        t("contact.sendMessage")
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2">{t("contact.faqTitle")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("contact.faqSubtitle")}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold mb-2">{t("contact.faq1")}</h3>
                <p className="text-muted-foreground">{t("contact.faq1Answer")}</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold mb-2">{t("contact.faq2")}</h3>
                <p className="text-muted-foreground">{t("contact.faq2Answer")}</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold mb-2">{t("contact.faq3")}</h3>
                <p className="text-muted-foreground">{t("contact.faq3Answer")}</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold mb-2">{t("contact.faq4")}</h3>
                <p className="text-muted-foreground">{t("contact.faq4Answer")}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}