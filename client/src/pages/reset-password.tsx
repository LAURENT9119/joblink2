import { useState } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AudioButton } from "@/components/ui/audio-button";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Step 1: Email request schema
const requestResetSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse e-mail valide"),
});

// Step 2: Password reset schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RequestResetValues = z.infer<typeof requestResetSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"request" | "confirmation" | "reset">("request");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  
  // Audio texts
  const requestAudio = "Entrez votre adresse e-mail pour recevoir un lien de réinitialisation de mot de passe. Nous vous enverrons un e-mail avec les instructions pour réinitialiser votre mot de passe.";
  const confirmationAudio = "Un e-mail de réinitialisation a été envoyé à votre adresse e-mail. Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe.";
  const resetAudio = "Entrez votre nouveau mot de passe et confirmez-le. Votre mot de passe doit contenir au moins 8 caractères.";
  
  // Form for email request
  const requestForm = useForm<RequestResetValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });
  
  // Form for password reset
  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  // Handle email request submission
  const onRequestSubmit = (data: RequestResetValues) => {
    // In a real application, this would call an API to send a reset email
    console.log("Reset password requested for:", data.email);
    
    // For demo purposes, we'll simulate sending an email and set a token
    setEmail(data.email);
    setResetToken("mock-token-12345"); // In a real app, this would come from the server
    
    // Show confirmation screen
    setStep("confirmation");
    
    toast({
      title: "Demande envoyée",
      description: "Si cette adresse e-mail est associée à un compte, vous recevrez un e-mail de réinitialisation.",
    });
  };
  
  // Handle password reset submission
  const onResetSubmit = (data: ResetPasswordValues) => {
    // In a real application, this would call an API to reset the password
    console.log("Password reset for:", email, "with token:", resetToken);
    
    toast({
      title: "Mot de passe réinitialisé",
      description: "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
    });
    
    // Redirect to login page
    setTimeout(() => {
      setLocation("/auth");
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container px-4">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                className="mb-4 p-0 hover:bg-transparent" 
                onClick={() => setLocation("/auth")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Button>
              
              <h1 className="text-2xl font-bold mb-2">
                {step === "request" && "Réinitialiser votre mot de passe"}
                {step === "confirmation" && "Vérifiez votre e-mail"}
                {step === "reset" && "Définir un nouveau mot de passe"}
              </h1>
              
              <p className="text-muted-foreground mb-4">
                {step === "request" && "Entrez votre adresse e-mail pour recevoir un lien de réinitialisation"}
                {step === "confirmation" && `Nous avons envoyé un e-mail à ${email} avec les instructions de réinitialisation`}
                {step === "reset" && "Créez un nouveau mot de passe sécurisé pour votre compte"}
              </p>
              
              <div className="mb-6">
                <AudioButton 
                  text={
                    step === "request" 
                      ? requestAudio 
                      : step === "confirmation" 
                        ? confirmationAudio 
                        : resetAudio
                  } 
                  withLabel={true} 
                />
              </div>
            </div>
            
            {step === "request" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Form {...requestForm}>
                  <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-6">
                    <FormField
                      control={requestForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse e-mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute top-2.5 left-3 h-5 w-5 text-muted-foreground" />
                              <Input 
                                placeholder="votre@email.com" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Envoyer les instructions
                    </Button>
                  </form>
                </Form>
              </div>
            )}
            
            {step === "confirmation" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  
                  <p className="mb-6">
                    Vérifiez votre boîte de réception pour les instructions de réinitialisation.
                    Si vous ne trouvez pas l'e-mail, vérifiez votre dossier de spam.
                  </p>
                  
                  {/* For demo purposes only - in a real app this button would not exist */}
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setStep("reset")}
                  >
                    Continuer vers la réinitialisation (démo)
                  </Button>
                  
                  <div className="mt-4">
                    <Button 
                      variant="ghost" 
                      className="text-sm" 
                      onClick={() => setStep("request")}
                    >
                      Retour à la demande
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {step === "reset" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                    <FormField
                      control={resetForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute top-2.5 left-3 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type="password" 
                                placeholder="Votre nouveau mot de passe" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={resetForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute top-2.5 left-3 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type="password" 
                                placeholder="Confirmer votre mot de passe" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Réinitialiser mot de passe
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}