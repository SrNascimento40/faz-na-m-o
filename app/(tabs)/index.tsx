import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { Student, Trainer } from '@/types';
import { mockStudents, mockPayments, mockCheckIns } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();

  if (user?.type === 'trainer') {
    return <TrainerDashboard user={user as Trainer} />;
  } else {
    return <StudentHome user={user as Student} />;
  }
}

function StudentHome({ user }: { user: Student }) {
  if (!user) return null;
  
  const recentCheckIns = mockCheckIns
    .filter(c => c.studentId === user.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const nextPayment = mockPayments.find(p => p.studentId === user.id && p.status === 'pending');

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.welcomeText}>
          Olá, {user.name.split(' ')[0]}! 👋
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Bem-vindo ao Central Fight
        </ThemedText>
      </ThemedView>

      {/* Status Cards */}
      <View style={styles.cardsContainer}>
        <View style={[styles.card, styles.statusCard]}>
          <ThemedText style={styles.cardTitle}>Status da Mensalidade</ThemedText>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: user.paymentStatus === 'active' ? '#27ae60' : '#e74c3c' }
            ]} />
            <ThemedText style={styles.statusText}>
              {user.paymentStatus === 'active' ? 'Em dia' : 'Pendente'}
            </ThemedText>
          </View>
          <ThemedText style={styles.dueDateText}>
            Vencimento: {new Date(user.dueDate).toLocaleDateString('pt-BR')}
          </ThemedText>
        </View>

        <View style={[styles.card, styles.pointsCard]}>
          <ThemedText style={styles.cardTitle}>Pontos</ThemedText>
          <ThemedText style={styles.pointsValue}>{user.points}</ThemedText>
          <ThemedText style={styles.levelText}>
            Nível: {user.level === 'beginner' ? 'Iniciante' : 
                   user.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
          </ThemedText>
        </View>
      </View>

      {/* Quick Actions */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Ações Rápidas</ThemedText>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionIcon}>✅</ThemedText>
            <ThemedText style={styles.actionText}>Check-in</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionIcon}>💳</ThemedText>
            <ThemedText style={styles.actionText}>Pagar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionIcon}>📊</ThemedText>
            <ThemedText style={styles.actionText}>Progresso</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Recent Check-ins */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Últimos Treinos</ThemedText>
        {recentCheckIns.map((checkIn) => (
          <View key={checkIn.id} style={styles.checkInItem}>
            <View style={styles.checkInDate}>
              <ThemedText style={styles.checkInDateText}>
                {new Date(checkIn.date).toLocaleDateString('pt-BR')}
              </ThemedText>
            </View>
            <View style={styles.checkInInfo}>
              <ThemedText style={styles.checkInType}>
                {checkIn.type === 'training' ? 'Treino' : 'Evento'}
              </ThemedText>
              <ThemedText style={styles.checkInPoints}>+{checkIn.points} pts</ThemedText>
            </View>
          </View>
        ))}
      </ThemedView>

      {/* Next Payment */}
      {nextPayment && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Próximo Pagamento</ThemedText>
          <View style={styles.paymentCard}>
            <ThemedText style={styles.paymentAmount}>
              R$ {nextPayment.amount.toFixed(2)}
            </ThemedText>
            <ThemedText style={styles.paymentDue}>
              Vencimento: {new Date(nextPayment.dueDate).toLocaleDateString('pt-BR')}
            </ThemedText>
            <TouchableOpacity style={styles.payButton}>
              <ThemedText style={styles.payButtonText}>Pagar Agora</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      )}
    </ScrollView>
  );
}

function TrainerDashboard({ user }: { user: Trainer }) {
  const students = mockStudents.filter(s => s.trainerId === user.id);
  const activeStudents = students.filter(s => s.paymentStatus === 'active');
  const overdueStudents = students.filter(s => s.paymentStatus === 'overdue');
  
  const monthlyRevenue = mockPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const todayCheckIns = mockCheckIns.filter(c => {
    const today = new Date();
    const checkInDate = new Date(c.date);
    return checkInDate.toDateString() === today.toDateString();
  });

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.welcomeText}>
          Dashboard - {user.gymName}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Olá, {user.name}! 👨‍🏫
        </ThemedText>
      </ThemedView>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{students.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Alunos</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{activeStudents.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Ativos</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{overdueStudents.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Inadimplentes</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>R$ {monthlyRevenue.toFixed(0)}</ThemedText>
          <ThemedText style={styles.statLabel}>Receita Mensal</ThemedText>
        </View>
      </View>

      {/* Today's Activity */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Atividade de Hoje</ThemedText>
        <View style={styles.todayStats}>
          <View style={styles.todayStatItem}>
            <ThemedText style={styles.todayStatNumber}>{todayCheckIns.length}</ThemedText>
            <ThemedText style={styles.todayStatLabel}>Check-ins</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Ações Rápidas</ThemedText>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionIcon}>👥</ThemedText>
            <ThemedText style={styles.actionText}>Alunos</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionIcon}>💰</ThemedText>
            <ThemedText style={styles.actionText}>Financeiro</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionIcon}>📈</ThemedText>
            <ThemedText style={styles.actionText}>Relatórios</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Recent Students */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Alunos Recentes</ThemedText>
        {students.slice(0, 3).map((student) => (
          <View key={student.id} style={styles.studentItem}>
            <View style={styles.studentInfo}>
              <ThemedText style={styles.studentName}>{student.name}</ThemedText>
              <ThemedText style={styles.studentPlan}>{student.plan.name}</ThemedText>
            </View>
            <View style={[
              styles.studentStatus,
              { backgroundColor: student.paymentStatus === 'active' ? '#27ae60' : '#e74c3c' }
            ]}>
              <ThemedText style={styles.studentStatusText}>
                {student.paymentStatus === 'active' ? 'Ativo' : 'Pendente'}
              </ThemedText>
            </View>
          </View>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginBottom: width < 800 ? 100 : 0,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#e74c3c',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
    marginTop: 5,
  },
  cardsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  pointsCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  cardTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e30',
  },
  dueDateText: {
    fontSize: 12,
    color: '#95a5a6',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  levelText: {
    fontSize: 12,
    color: '#95a5a6',
    textTransform: 'capitalize',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    minWidth: width * 0.25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2c3e50',
  },
  checkInItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkInDate: {
    marginRight: 15,
  },
  checkInDateText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  checkInInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkInType: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkInPoints: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  paymentDue: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  payButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: (width - 55) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  todayStats: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayStatItem: {
    alignItems: 'center',
  },
  todayStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#27ae60',
    paddingTop: width < 800 ? 10 : 0,
  },
  todayStatLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  studentPlan: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  studentStatus: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  studentStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
