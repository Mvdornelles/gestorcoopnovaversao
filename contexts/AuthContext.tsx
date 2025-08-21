import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a temporary admin client to create the test user.
// It should not be used anywhere else in the app.
const setupSupabaseAdminClient = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        console.error('Supabase Service Role Key is not defined. Cannot create test user.');
        return null;
    }
    return createClient(supabaseUrl, serviceKey);
}


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupAndLoginTestUser = async () => {
      const testUserEmail = 'test@gestorcoop.com';
      const testUserPassword = 'password123';

      // 1. Ensure test user exists
      const adminClient = setupSupabaseAdminClient();
      if (adminClient) {
          const { data: userData, error: userError } = await adminClient.auth.admin.getUserByEmail(testUserEmail);

          if (userError && userError.message === 'User not found') {
              // User not found, create them
              const { data: newUserData, error: createUserError } = await adminClient.auth.admin.createUser({
                  email: testUserEmail,
                  password: testUserPassword,
                  email_confirm: true, // Auto-confirm email for simplicity
              });

              if (createUserError) {
                  console.error('Error creating test user:', createUserError);
                  setLoading(false);
                  return;
              }
              console.log('Test user created successfully.');
          } else if (userError) {
              console.error('Error checking for test user:', userError);
          }
      }

      // 2. Log in as the test user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testUserEmail,
        password: testUserPassword,
      });

      if (error) {
        console.error('Error logging in test user:', error);
      } else if (data.session) {
        setSession(data.session);
        setUser(data.user);
      }
      setLoading(false);
    };

    // Check for an existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        setLoading(false);
      } else {
        setupAndLoginTestUser();
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading Authentication...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
