import { useState, useEffect } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { LoginData, InsertUser } from "@shared/schema";
import { AudioButton } from "@/components/ui/audio-button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  role: z.enum(["job_seeker", "employer"], {
    required_error: "Please select a role",
  }),
  preferredLanguage: z.enum(["fr", "en"], {
    required_error: "Please select a language",
  }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const [location, setLocation] = useLocation();
  
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => login(data.username, data.password),
    onSuccess: () => {
      toast({
        title: t("auth.loginSuccess"),
        description: t("auth.welcomeBack"),
      });
    },
    onError: (error) => {
      toast({
        title: t("auth.loginError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const search = useSearch();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "job_seeker") {
        setLocation("/job-seeker/dashboard");
      } else if (user.role === "employer") {
        setLocation("/employer/dashboard");
      }
    }
  }, [user, setLocation]);

  // Set active tab based on URL parameter
  useEffect(() => {
    const params = new URLSearchParams(search);
    const tab = params.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    } else if (tab === "login") {
      setActiveTab("login");
    }
  }, [search]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      role: "job_seeker",
      preferredLanguage: "fr",
      terms: false,
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove terms field as it's not needed in the API
    const { terms, ...userData } = data;
    registerMutation.mutate(userData as InsertUser);
  };

  // Audio descriptions
  const loginAudioDescription = t("auth.loginAudioDescription");
  const registerAudioDescription = t("auth.registerAudioDescription");

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />

      <div className="container mx-auto px-4 py-10 flex-grow">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              JobLink
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "login"
                ? t("auth.loginHeading")
                : t("auth.registerHeading")}
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
              <TabsTrigger value="register">{t("auth.register")}</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("auth.emailOrPhone")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("auth.emailOrPhonePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.password")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("auth.passwordPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <FormField
                      control={loginForm.control}
                      name="remember"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              {t("auth.rememberMe")}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Link
                      href="/reset-password"
                      className="text-sm text-primary hover:text-primary/90 transition"
                    >
                      {t("auth.forgotPassword")}
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {t("auth.login")}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {t("auth.noAccount")}{" "}
                  <button
                    className="text-primary hover:text-primary/90 transition"
                    onClick={() => setActiveTab("register")}
                  >
                    {t("auth.register")}
                  </button>
                </p>
              </div>

              {/* Audio Help */}
              <div className="mt-8 bg-muted p-4 rounded-lg flex items-center gap-3">
                <AudioButton text={loginAudioDescription} withLabel={true} />
              </div>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  className="space-y-4"
                >
                  {/* Role Selection */}
                  <FormField
                    control={registerForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel>{t("auth.iAm")}</FormLabel>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            className={`border rounded-lg p-4 cursor-pointer ${
                              field.value === "job_seeker"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary hover:bg-primary/5 transition"
                            }`}
                            onClick={() => field.onChange("job_seeker")}
                          >
                            <div className="flex flex-col items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-6 w-6 mb-2 ${
                                  field.value === "job_seeker"
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="7" r="4" />
                                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                              </svg>
                              <span className="font-medium text-foreground">
                                {t("auth.jobSeeker")}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`border rounded-lg p-4 cursor-pointer ${
                              field.value === "employer"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary hover:bg-primary/5 transition"
                            }`}
                            onClick={() => field.onChange("employer")}
                          >
                            <div className="flex flex-col items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-6 w-6 mb-2 ${
                                  field.value === "employer"
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="2"
                                  y="7"
                                  width="20"
                                  height="14"
                                  rx="2"
                                  ry="2"
                                />
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                              </svg>
                              <span className="font-medium text-foreground">
                                {t("auth.employer")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.firstName")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("auth.firstNamePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.lastName")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("auth.lastNamePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.username")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("auth.usernamePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.phone")}</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder={t("auth.phonePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.emailOptional")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("auth.emailPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.password")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("auth.passwordPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="preferredLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.preferredLanguage")}</FormLabel>
                        <div className="flex border border-border rounded-lg overflow-hidden">
                          <button
                            type="button"
                            className={`flex-1 py-3 font-medium ${
                              field.value === "fr"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground bg-white hover:bg-muted transition"
                            }`}
                            onClick={() => field.onChange("fr")}
                          >
                            <span className="mr-1">🇫🇷</span> {t("language.fr")}
                          </button>
                          <button
                            type="button"
                            className={`flex-1 py-3 font-medium ${
                              field.value === "en"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground bg-white hover:bg-muted transition"
                            }`}
                            onClick={() => field.onChange("en")}
                          >
                            <span className="mr-1">🇬🇧</span> {t("language.en")}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            {t("auth.termsAgreement")}{" "}
                            <a
                              href="#"
                              className="text-primary hover:text-primary/90 transition"
                            >
                              {t("auth.termsLink")}
                            </a>{" "}
                            {t("auth.and")}{" "}
                            <a
                              href="#"
                              className="text-primary hover:text-primary/90 transition"
                            >
                              {t("auth.privacyLink")}
                            </a>
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {t("auth.createAccount")}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {t("auth.alreadyHaveAccount")}{" "}
                  <button
                    className="text-primary hover:text-primary/90 transition"
                    onClick={() => setActiveTab("login")}
                  >
                    {t("auth.login")}
                  </button>
                </p>
              </div>

              {/* Audio Help */}
              <div className="mt-8 bg-muted p-4 rounded-lg flex items-center gap-3">
                <AudioButton text={registerAudioDescription} withLabel={true} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
