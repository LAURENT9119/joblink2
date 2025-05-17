` tags. I will also ensure that the indentation and structure of the code are preserved.

```
<replit_final_file>
import { createContext, ReactNode, useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const loginMutation = {
    mutate: async (credentials: any) => {
      // Simulate login
      setUser({ id: 1, role: 'job_seeker', ...credentials });
      setLocation('/job-seeker/dashboard');
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    }
  };

  const registerMutation = {
    mutate: async (userData: any) => {
      // Simulate registration
      setUser({ id: 1, ...userData });
      setLocation('/job-seeker/profile');
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
    }
  };

  const logoutMutation = {
    mutate: async () => {
      setUser(null);
      setLocation('/');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: false,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}