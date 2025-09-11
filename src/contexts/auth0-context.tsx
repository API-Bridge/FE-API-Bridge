'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Auth0Client, createAuth0Client, User } from '@auth0/auth0-spa-js';
import { logoutUser } from '@/lib/api';

interface Auth0ContextType {
  auth0Client: Auth0Client | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string>;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

interface Auth0ProviderProps {
  children: ReactNode;
}

export const Auth0Provider: React.FC<Auth0ProviderProps> = ({ children }) => {
  const [auth0Client, setAuth0Client] = useState<Auth0Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const initAuth0 = async () => {
      try {
        console.log('Starting Auth0 initialization...');
        console.log('Window location origin:', window.location.origin);
        console.log('Environment variables:', {
          domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
          clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE
        });
        
        const client = await createAuth0Client({
          domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'dev-q64r0n0blzhir6y0.us.auth0.com',
          clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || 'fzwFru3aG5pUJWsofqjxXxbYmWfzrnFX',
          authorizationParams: {
            redirect_uri: window.location.origin + '/callback',
            audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || 'https://ApiBridge/'
          }
        });

        console.log('Auth0 client created successfully:', !!client);
        setAuth0Client(client);

        // Check if user is authenticated
        const authenticated = await client.isAuthenticated();
        console.log('Initial authentication check:', authenticated);
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const userData = await client.getUser();
          setUser(userData);
        }

        // Handle redirect callback
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
          try {
            console.log('Handling Auth0 redirect callback...');
            const result = await client.handleRedirectCallback();
            console.log('Callback result:', result);
            
            const authenticated = await client.isAuthenticated();
            console.log('Authenticated after callback:', authenticated);
            setIsAuthenticated(authenticated);
            
            if (authenticated) {
              const userData = await client.getUser();
              console.log('User data:', userData);
              setUser(userData);
            }
            
            // Clean up URL - but don't do it immediately on callback page
            if (window.location.pathname !== '/callback') {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } catch (error) {
            console.error('Error handling redirect callback:', error);
            // 에러가 발생해도 loading을 false로 설정하여 무한 로딩 방지
            setIsLoading(false);
          }
        } else if (window.location.search.includes('error=')) {
          // Auth0 에러 처리
          const urlParams = new URLSearchParams(window.location.search);
          const error = urlParams.get('error');
          const errorDescription = urlParams.get('error_description');
          console.error('Auth0 login error:', { error, errorDescription });
        }
      } catch (error) {
        console.error('Error initializing Auth0:', error);
        console.error('Auth0 initialization failed completely');
      } finally {
        console.log('Auth0 initialization finished, setting loading to false');
        setIsLoading(false);
      }
    };

    initAuth0();
  }, []);

  const login = async () => {
    console.log('login function called', { auth0Client: !!auth0Client });
    if (!auth0Client) {
      console.log('Auth0 client not available');
      return;
    }
    
    try {
      console.log('Calling loginWithRedirect...');
      console.log('Redirect URI:', window.location.origin + '/callback');
      await auth0Client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.origin + '/callback'
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    if (!auth0Client) return;
    
    try {
      // 1. 먼저 백엔드 로그아웃 API 호출
      try {
        const accessToken = await auth0Client.getTokenSilently();
        await logoutUser(accessToken);
      } catch (apiError) {
        console.error('Backend logout API error:', apiError);
        // 백엔드 로그아웃이 실패해도 Auth0 로그아웃은 진행
      }
      
      // 2. Auth0 로그아웃 처리
      await auth0Client.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getAccessToken = async (): Promise<string> => {
    if (!auth0Client) {
      throw new Error('Auth0 client not initialized');
    }
    
    try {
      return await auth0Client.getTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  const value: Auth0ContextType = {
    auth0Client,
    isLoading,
    isAuthenticated,
    user,
    login,
    logout,
    getAccessToken,
  };

  return (
    <Auth0Context.Provider value={value}>
      {children}
    </Auth0Context.Provider>
  );
};

export const useAuth0 = (): Auth0ContextType => {
  const context = useContext(Auth0Context);
  if (context === undefined) {
    throw new Error('useAuth0 must be used within an Auth0Provider');
  }
  return context;
};