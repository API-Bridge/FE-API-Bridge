"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  checkAdminStatus: (userId: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isAdmin: false,
  setUser: () => {},
  checkAdminStatus: async () => false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // DB에서 사용자 관리자 권한 조회 함수 (실제 API 호출)
  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      // TODO: 실제 API 엔드포인트로 교체
      const response = await fetch(`/api/users/${userId}/admin-status`);
      const data = await response.json();
      return data.isAdmin || false;
    } catch (error) {
      console.error('Failed to check admin status:', error);
      return false;
    }
  };

  // 사용자 로그인 시 관리자 권한 확인
  useEffect(() => {
    const initializeUser = async () => {
      // TODO: 실제 사용자 정보를 가져오는 로직 구현
      // 현재는 임시로 하드코딩된 사용자 정보 사용
      const mockUser = {
        id: "user_123",
        email: "admin@example.com", 
        name: "관리자 테스트"
      };

      // 임시로 관리자 권한을 true로 설정 (백엔드 연동 전)
      const isAdmin = true;
      
      setUser({
        ...mockUser,
        isAdmin
      });
    };

    initializeUser();
  }, []);

  const isAdmin = user?.isAdmin || false;

  return (
    <UserContext.Provider value={{
      user,
      isAdmin,
      setUser,
      checkAdminStatus
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};