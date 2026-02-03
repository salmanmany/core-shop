import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  username: string;
  password: string;
  accountType: string;
  skinUrl: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, accountType: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getUsers = (): User[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const login = (username: string, password: string, accountType: string): { success: boolean; error?: string } => {
    const users = getUsers();
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (existingUser) {
      if (existingUser.password === password) {
        setUser(existingUser);
        localStorage.setItem('currentUser', JSON.stringify(existingUser));
        return { success: true };
      } else {
        return { success: false, error: 'wrongPassword' };
      }
    } else {
      const newUser: User = {
        username,
        password,
        accountType,
        skinUrl: `https://mc-heads.net/avatar/${username}/100`,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      saveUsers(users);
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
