import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User } from '../types';
import { mockStudents, mockTrainer, getStudentById, getTrainerById } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, userType: 'student' | 'trainer'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));

      let authenticatedUser: User | null = null;

      if (userType === 'trainer') {
        // Login do treinador
        if (email === mockTrainer.email && password === '123456') {
          authenticatedUser = mockTrainer;
        }
      } else {
        // Login do aluno
        const student = mockStudents.find(s => s.email === email);
        if (student && password === '123456') {
          authenticatedUser = student;
        }
      }

      if (authenticatedUser) {
        setUser(authenticatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(authenticatedUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
