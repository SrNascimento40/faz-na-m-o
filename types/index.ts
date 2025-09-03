export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  type: 'student' | 'trainer';
  createdAt: Date;
}

export interface Student extends User {
  type: 'student';
  plan: Plan;
  paymentStatus: 'active' | 'overdue' | 'suspended';
  dueDate: Date;
  points: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  fightStyle: string;
  weight: number;
  category: string;
  trainerId: string;
}

export interface Trainer extends User {
  type: 'trainer';
  gymName: string;
  specialties: string[];
  students: string[]; // student IDs
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number; // days
  description: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  method: 'pix' | 'credit_card' | 'boleto';
  status: 'pending' | 'paid' | 'failed';
  dueDate: Date;
  paidDate?: Date;
  planId: string;
}

export interface CheckIn {
  id: string;
  studentId: string;
  date: Date;
  points: number;
  type: 'training' | 'event' | 'exam';
}

export interface Gym {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  trainerId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: 'student' | 'trainer') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
