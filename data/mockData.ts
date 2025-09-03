import { Student, Trainer, Plan, Payment, CheckIn, Gym } from '../types';

export const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Plano Básico',
    price: 120.00,
    duration: 30,
    description: '2x por semana - Muay Thai ou Jiu-Jitsu'
  },
  {
    id: '2',
    name: 'Plano Premium',
    price: 180.00,
    duration: 30,
    description: 'Ilimitado - Todas as modalidades'
  },
  {
    id: '3',
    name: 'Plano VIP',
    price: 250.00,
    duration: 30,
    description: 'Ilimitado + Personal Training'
  }
];

export const mockTrainer: Trainer = {
  id: 'trainer1',
  name: 'Carlos Silva',
  email: 'carlos@centralfight.com',
  phone: '(11) 99999-9999',
  photo: 'https://via.placeholder.com/150',
  type: 'trainer',
  createdAt: new Date('2023-01-01'),
  gymName: 'Central Fight Academy',
  specialties: ['Muay Thai', 'Jiu-Jitsu', 'MMA'],
  students: ['student1', 'student2', 'student3', 'student4']
};

export const mockStudents: Student[] = [
  {
    id: 'student1',
    name: 'João Santos',
    email: 'joao@email.com',
    phone: '(11) 98888-8888',
    photo: 'https://via.placeholder.com/150',
    type: 'student',
    createdAt: new Date('2023-06-01'),
    plan: mockPlans[1],
    paymentStatus: 'active',
    dueDate: new Date('2024-02-15'),
    points: 850,
    level: 'intermediate',
    fightStyle: 'Muay Thai',
    weight: 75,
    category: 'Meio-Médio',
    trainerId: 'trainer1'
  },
  {
    id: 'student2',
    name: 'Maria Oliveira',
    email: 'maria@email.com',
    phone: '(11) 97777-7777',
    photo: 'https://via.placeholder.com/150',
    type: 'student',
    createdAt: new Date('2023-08-15'),
    plan: mockPlans[0],
    paymentStatus: 'active',
    dueDate: new Date('2024-02-20'),
    points: 620,
    level: 'beginner',
    fightStyle: 'Jiu-Jitsu',
    weight: 60,
    category: 'Leve',
    trainerId: 'trainer1'
  },
  {
    id: 'student3',
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    phone: '(11) 96666-6666',
    photo: 'https://via.placeholder.com/150',
    type: 'student',
    createdAt: new Date('2023-03-10'),
    plan: mockPlans[2],
    paymentStatus: 'overdue',
    dueDate: new Date('2024-01-10'),
    points: 1200,
    level: 'advanced',
    fightStyle: 'MMA',
    weight: 85,
    category: 'Médio',
    trainerId: 'trainer1'
  },
  {
    id: 'student4',
    name: 'Ana Silva',
    email: 'ana@email.com',
    phone: '(11) 95555-5555',
    photo: 'https://via.placeholder.com/150',
    type: 'student',
    createdAt: new Date('2023-09-01'),
    plan: mockPlans[1],
    paymentStatus: 'active',
    dueDate: new Date('2024-02-25'),
    points: 450,
    level: 'beginner',
    fightStyle: 'Muay Thai',
    weight: 55,
    category: 'Mosca',
    trainerId: 'trainer1'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'pay1',
    studentId: 'student1',
    amount: 180.00,
    method: 'pix',
    status: 'paid',
    dueDate: new Date('2024-01-15'),
    paidDate: new Date('2024-01-14'),
    planId: '2'
  },
  {
    id: 'pay2',
    studentId: 'student2',
    amount: 120.00,
    method: 'credit_card',
    status: 'paid',
    dueDate: new Date('2024-01-20'),
    paidDate: new Date('2024-01-18'),
    planId: '1'
  },
  {
    id: 'pay3',
    studentId: 'student3',
    amount: 250.00,
    method: 'boleto',
    status: 'pending',
    dueDate: new Date('2024-01-10'),
    planId: '3'
  },
  {
    id: 'pay4',
    studentId: 'student4',
    amount: 180.00,
    method: 'pix',
    status: 'paid',
    dueDate: new Date('2024-01-25'),
    paidDate: new Date('2024-01-23'),
    planId: '2'
  }
];

export const mockCheckIns: CheckIn[] = [
  {
    id: 'checkin1',
    studentId: 'student1',
    date: new Date('2024-01-20'),
    points: 10,
    type: 'training'
  },
  {
    id: 'checkin2',
    studentId: 'student1',
    date: new Date('2024-01-18'),
    points: 10,
    type: 'training'
  },
  {
    id: 'checkin3',
    studentId: 'student2',
    date: new Date('2024-01-19'),
    points: 10,
    type: 'training'
  },
  {
    id: 'checkin4',
    studentId: 'student3',
    date: new Date('2024-01-17'),
    points: 15,
    type: 'event'
  },
  {
    id: 'checkin5',
    studentId: 'student4',
    date: new Date('2024-01-21'),
    points: 10,
    type: 'training'
  }
];

export const mockGym: Gym = {
  id: 'gym1',
  name: 'Central Fight Academy',
  address: 'Rua das Lutas, 123 - São Paulo, SP',
  phone: '(11) 3333-3333',
  email: 'contato@centralfight.com',
  trainerId: 'trainer1'
};

// Funções auxiliares para buscar dados
export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find(student => student.id === id);
};

export const getTrainerById = (id: string): Trainer | undefined => {
  return id === mockTrainer.id ? mockTrainer : undefined;
};

export const getPaymentsByStudentId = (studentId: string): Payment[] => {
  return mockPayments.filter(payment => payment.studentId === studentId);
};

export const getCheckInsByStudentId = (studentId: string): CheckIn[] => {
  return mockCheckIns.filter(checkIn => checkIn.studentId === studentId);
};

export const getStudentsByTrainerId = (trainerId: string): Student[] => {
  return mockStudents.filter(student => student.trainerId === trainerId);
};
