import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { Trainer } from '@/types';
import { mockPayments, mockStudents, getStudentsByTrainerId } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function FinancialScreen() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  if (user?.type !== 'trainer') {
    return null;
  }

  const trainer = user as Trainer;
  const students = getStudentsByTrainerId(trainer.id);
  
  // Calcular métricas financeiras
  const paidPayments = mockPayments.filter(p => p.status === 'paid');
  const pendingPayments = mockPayments.filter(p => p.status === 'pending');
  
  const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingRevenue = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  
  const thisMonthRevenue = paidPayments
    .filter(p => {
      const paymentDate = new Date(p.paidDate || p.dueDate);
      const today = new Date();
      return paymentDate.getMonth() === today.getMonth() && 
             paymentDate.getFullYear() === today.getFullYear();
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const averageTicket = students.length > 0 ? totalRevenue / students.length : 0;

  // Dados para o gráfico de receita
  const getRevenueData = () => {
    if (selectedPeriod === 'week') {
      return [
        { label: 'Seg', value: 120, height: 60 },
        { label: 'Ter', value: 180, height: 90 },
        { label: 'Qua', value: 250, height: 125 },
        { label: 'Qui', value: 200, height: 100 },
        { label: 'Sex', value: 300, height: 150 },
        { label: 'Sáb', value: 150, height: 75 },
        { label: 'Dom', value: 100, height: 50 }
      ];
    } else if (selectedPeriod === 'month') {
      return [
        { label: 'Jan', value: 2500, height: 100 },
        { label: 'Fev', value: 2800, height: 112 },
        { label: 'Mar', value: 3200, height: 128 },
        { label: 'Abr', value: 2900, height: 116 },
        { label: 'Mai', value: 3500, height: 140 },
        { label: 'Jun', value: 3100, height: 124 }
      ];
    } else {
      return [
        { label: '2022', value: 28000, height: 80 },
        { label: '2023', value: 35000, height: 100 },
        { label: '2024', value: 42000, height: 120 }
      ];
    }
  };

  const revenueData = getRevenueData();

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Financeiro
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Controle financeiro da academia
        </ThemedText>
      </ThemedView>

      {/* Financial Overview */}
      <View style={styles.overviewContainer}>
        <View style={styles.overviewCard}>
          <ThemedText style={styles.overviewValue}>R$ {totalRevenue.toFixed(0)}</ThemedText>
          <ThemedText style={styles.overviewLabel}>Receita Total</ThemedText>
          <View style={styles.overviewTrend}>
            <ThemedText style={styles.trendIcon}>📈</ThemedText>
            <ThemedText style={styles.trendText}>+12%</ThemedText>
          </View>
        </View>

        <View style={styles.overviewCard}>
          <ThemedText style={styles.overviewValue}>R$ {thisMonthRevenue.toFixed(0)}</ThemedText>
          <ThemedText style={styles.overviewLabel}>Este Mês</ThemedText>
          <View style={styles.overviewTrend}>
            <ThemedText style={styles.trendIcon}>📊</ThemedText>
            <ThemedText style={styles.trendText}>+8%</ThemedText>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>R$ {pendingRevenue.toFixed(0)}</ThemedText>
          <ThemedText style={styles.statLabel}>A Receber</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>R$ {averageTicket.toFixed(0)}</ThemedText>
          <ThemedText style={styles.statLabel}>Ticket Médio</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{pendingPayments.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Pendentes</ThemedText>
        </View>
      </View>

      {/* Revenue Chart */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Receita por Período
        </ThemedText>
        
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'week' && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod('week')}
          >
            <ThemedText style={[
              styles.periodText,
              selectedPeriod === 'week' && styles.periodTextActive
            ]}>
              Semana
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <ThemedText style={[
              styles.periodText,
              selectedPeriod === 'month' && styles.periodTextActive
            ]}>
              Mês
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'year' && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod('year')}
          >
            <ThemedText style={[
              styles.periodText,
              selectedPeriod === 'year' && styles.periodTextActive
            ]}>
              Ano
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            {revenueData.map((item, index) => (
              <View key={index} style={styles.chartBar}>
                <View 
                  style={[
                    styles.bar, 
                    { height: item.height }
                  ]} 
                />
                <ThemedText style={styles.barValue}>
                  {selectedPeriod === 'year' ? 
                    `${(item.value / 1000).toFixed(0)}k` : 
                    item.value.toString()
                  }
                </ThemedText>
                <ThemedText style={styles.barLabel}>{item.label}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ThemedView>

      {/* Pending Payments */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Pagamentos Pendentes
        </ThemedText>
        
        {pendingPayments.map((payment) => {
          const student = mockStudents.find(s => s.id === payment.studentId);
          if (!student) return null;
          
          const isOverdue = new Date(payment.dueDate) < new Date();
          
          return (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentInfo}>
                <ThemedText style={styles.paymentStudent}>{student.name}</ThemedText>
                <ThemedText style={styles.paymentPlan}>{student.plan.name}</ThemedText>
                <ThemedText style={[
                  styles.paymentDue,
                  isOverdue && styles.paymentOverdue
                ]}>
                  Vencimento: {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                  {isOverdue && ' (Vencido)'}
                </ThemedText>
              </View>
              <View style={styles.paymentAmount}>
                <ThemedText style={styles.paymentValue}>
                  R$ {payment.amount.toFixed(2)}
                </ThemedText>
                <View style={[
                  styles.paymentStatus,
                  { backgroundColor: isOverdue ? '#e74c3c' : '#f39c12' }
                ]}>
                  <ThemedText style={styles.paymentStatusText}>
                    {isOverdue ? 'Vencido' : 'Pendente'}
                  </ThemedText>
                </View>
              </View>
            </View>
          );
        })}

        {pendingPayments.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateIcon}>✅</ThemedText>
            <ThemedText style={styles.emptyStateText}>
              Todos os pagamentos estão em dia!
            </ThemedText>
          </View>
        )}
      </ThemedView>

      {/* Recent Payments */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Pagamentos Recentes
        </ThemedText>
        
        {paidPayments.slice(0, 5).map((payment) => {
          const student = mockStudents.find(s => s.id === payment.studentId);
          if (!student) return null;
          
          return (
            <View key={payment.id} style={styles.recentPaymentCard}>
              <View style={styles.recentPaymentInfo}>
                <ThemedText style={styles.recentPaymentStudent}>{student.name}</ThemedText>
                <ThemedText style={styles.recentPaymentDate}>
                  {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('pt-BR') : '-'}
                </ThemedText>
                <ThemedText style={styles.recentPaymentMethod}>
                  {payment.method === 'pix' ? 'PIX' :
                   payment.method === 'credit_card' ? 'Cartão' : 'Boleto'}
                </ThemedText>
              </View>
              <View style={styles.recentPaymentAmount}>
                <ThemedText style={styles.recentPaymentValue}>
                  R$ {payment.amount.toFixed(2)}
                </ThemedText>
                <View style={styles.paidBadge}>
                  <ThemedText style={styles.paidBadgeText}>Pago</ThemedText>
                </View>
              </View>
            </View>
          );
        })}
      </ThemedView>

      {/* Financial Actions */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Ações Rápidas
        </ThemedText>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionIcon}>📧</ThemedText>
            <ThemedText style={styles.actionText}>Enviar Cobranças</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionIcon}>📊</ThemedText>
            <ThemedText style={styles.actionText}>Relatório Mensal</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionIcon}>💳</ThemedText>
            <ThemedText style={styles.actionText}>Configurar Planos</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#e74c3c',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
    marginTop: 5,
  },
  overviewContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  overviewTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  trendText: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    textAlign: 'center',
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  periodButtonActive: {
    backgroundColor: '#e74c3c',
  },
  periodText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: '#27ae60',
    borderRadius: 10,
    marginBottom: 5,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentStudent: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  paymentPlan: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  paymentDue: {
    fontSize: 12,
    color: '#95a5a6',
  },
  paymentOverdue: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  paymentStatus: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  paymentStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  recentPaymentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentPaymentInfo: {
    flex: 1,
  },
  recentPaymentStudent: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  recentPaymentDate: {
    fontSize: 11,
    color: '#7f8c8d',
    marginBottom: 1,
  },
  recentPaymentMethod: {
    fontSize: 10,
    color: '#95a5a6',
  },
  recentPaymentAmount: {
    alignItems: 'flex-end',
  },
  recentPaymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 3,
  },
  paidBadge: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  paidBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
    textAlign: 'center',
  },
});
