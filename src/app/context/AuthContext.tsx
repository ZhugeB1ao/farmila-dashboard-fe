import { supabase } from "../../lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  email: string;
}

interface AuthContextType {
    user: User | null;
    logOut: () => Promise<void>;
    logIn: (email: string, password: string) => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if(session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ""
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    const logOut = async () => {
      try {
        await supabase.auth.signOut();
        setUser(null);
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }

    const logIn = async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
      });

      if(error) throw error;

      if(data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || ""
          });
      }
    }

    return (
        <AuthContext.Provider value={{user, logOut, logIn, isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

