
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import React, { useState } from 'react';

interface AuthState {
  user: any | null;
  token: string | null;
  isPending: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isPending: false,
      error: null,
      
      login: async (email, password) => {
        try {
          set({ isPending: true, error: null });
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) {
            throw new Error('Login failed');
          }
          
          const data = await response.json();
          set({ user: data.user, token: data.token, isPending: false });
        } catch (error) {
          set({ error: (error as Error).message, isPending: false });
        }
      },

      register: async (data) => {
        try {
          set({ isPending: true, error: null });
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error('Registration failed');
          }

          const result = await response.json();
          set({ user: result.user, token: result.token, isPending: false });
        } catch (error) {
          set({ error: (error as Error).message, isPending: false });
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    // Implement login logic
    return { success: true };
  };

  const register = async (data: any) => {
    // Implement register logic
    return { success: true };
  };

  const value = {
    user,
    login,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
