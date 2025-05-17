import { createContext, ReactNode, useContext } from "react";

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState({ 
    id: 1, 
    role: 'job_seeker',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+221777777777',
    preferredLanguage: 'fr'
  });

  const logout = () => {
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: false,
        logout
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