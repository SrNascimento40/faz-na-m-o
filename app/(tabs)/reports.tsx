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
import { mockStudents, mockPayments, mockCheckIns, getStudentsByTrainerId } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<'overview' | 'students' | 'financial' | 'attendance'>('overview');

  if (user?.type !== 'trainer') {
    return null;
  }

  const trainer = user as Trainer;
  const students = getStudentsByTrainerId(trainer.id);
  
  // Calcular métricas
  const activeStudents = students.filter(s => s.paymentStatus === 'active');
  const overdueStudents = students.filter(s => s.paymentStatus === 'overdue');
  
  const totalRevenue = mockPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const thisMonthCheckIns = mockCheckIns.filter(c => {
    const checkInDate = new Date(c.date);
    const today = new Date();
    return checkInDate.getMonth() === today.getMonth() && 
           checkInDate.getFullYear() === today.getFullYear();
  });

  const averageAttendance = students.length > 0 ? thisMonthCheckIns.length / students.length : 0;

  // Ranking de alunos por pontos
  const studentRanking = students
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  // Dados de frequência por modalidade
  const modalityData = [
    { name: 'Muay Thai', students: students.filter(s => s.fightStyle === 'Muay Thai').length, color: '#e74c3c' },
    { name: 'Jiu-Jitsu', students: students.filter(s => s.fightStyle === 'Jiu-Jitsu').length, color: '#3498db' },
    { name: 'MMA', students: students.filter(s => s.fightStyle === 'MMA').length, color: '#f39c12' },
  ];

  const renderOverviewReport = () => (
    <View>
      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <ThemedText style={styles.metricValue}>{students.length}</ThemedText>
          <ThemedText style={styles.metricLabel}>Total de Alunos</ThemedText>
          <ThemedText style={styles.metricChange}>+5 este mês</ThemedText>
        </View>
        <View style={styles.metricCard}>
          <ThemedText style={styles.metricValue}>R$ {totalRevenue.toFixed(0)}</ThemedText>
          <ThemedText style={styles.metricLabel}>Receita Total</ThemedText>
          <ThemedText style={styles.metricChange}>+12% vs mês anterior</ThemedText>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <ThemedText style={[styles.metricValue, { color: '#27ae60' }]}>{activeStudents.length}</ThemedText>
          <ThemedText style={styles.metricLabel}>Alunos Ativos</ThemedText>
          <ThemedText style={styles.metricChange}>{((activeStudents.length / students.length) * 100).toFixed(0)}% do total</ThemedText>
        </View>
        <View style={styles.metricCard}>
          <ThemedText style={[styles.metricValue, { color: '#e74c3c' }]}>{overdueStudents.length}</ThemedText>
          <ThemedText style={styles.metricLabel}>Inadimplentes</ThemedText>
          <ThemedText style={styles.metricChange}>{((overdueStudents.length / students.length) * 100).toFixed(0)}% do total</ThemedText>
        </View>
      </View>

      {/* Modality Distribution */}
      <View style={styles.chartSection}>
        <ThemedText style={styles.chartTitle}>Distribuição por Modalidade</ThemedText>
        <View style={styles.modalityChart}>
          {modalityData.map((modality, index) => (
            <View key={index} style={styles.modalityItem}>
              <View style={styles.modalityBar}>
                <View 
                  style={[
                    styles.modalityFill,
                    { 
                      backgroundColor: modality.color,
                      width: `${(modality.students / students.length) * 100}%`
                    }
                  ]}
                />
              </View>
              <View style={styles.modalityInfo}>
                <ThemedText style={styles.modalityName}>{modality.name}</ThemedText>
                <ThemedText style={styles.modalityCount}>{modality.students} alunos</ThemedText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStudentsReport = () => (
    <View>
      {/* Student Ranking */}
      <View style={styles.rankingSection}>
        <ThemedText style={styles.chartTitle}>Ranking de Alunos (Top 10)</ThemedText>
        {studentRanking.map((student, index) => (
          <View key={student.id} style={styles.rankingItem}>
            <View style={styles.rankingPosition}>
              <ThemedText style={styles.rankingNumber}>{index + 1}</ThemedText>
            </View>
            <View style={styles.rankingInfo}>
              <ThemedText style={styles.rankingName}>{student.name}</ThemedText>
              <ThemedText style={styles.rankingStyle}>{student.fightStyle}</ThemedText>
            </View>
            <View style={styles.rankingPoints}>
              <ThemedText style={styles.rankingPointsValue}>{student.points}</ThemedText>
              <ThemedText style={styles.rankingPointsLabel}>pts</ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* Level Distribution */}
      <View style={styles.chartSection}>
        <ThemedText style={styles.chartTitle}>Distribuição por Nível</ThemedText>
        <View style={styles.levelStats}>
          <View style={styles.levelItem}>
            <ThemedText style={styles.levelCount}>
              {students.filter(s => s.level === 'beginner').length}
            </ThemedText>
            <ThemedText style={styles.levelLabel}>Iniciantes</ThemedText>
          </View>
          <View style={styles.levelItem}>
            <ThemedText style={styles.levelCount}>
              {students.filter(s => s.level === 'intermediate').length}
            </ThemedText>
            <ThemedText style={styles.levelLabel}>Intermediários</ThemedText>
          </View>
          <View style={styles.levelItem}>
            <ThemedText style={styles.levelCount}>
              {students.filter(s => s.level === 'advanced').length}
            </ThemedText>
            <ThemedText style={styles.levelLabel}>Avançados</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderFinancialReport = () => (
    <View>
      {/* Revenue Breakdown */}
      <View style={styles.revenueSection}>
        <ThemedText style={styles.chartTitle}>Receita por Plano</ThemedText>
        <View style={styles.planRevenue}>
          <View style={styles.planItem}>
            <ThemedText style={styles.planName}>Plano Básico</ThemedText>
            <ThemedText style={styles.planValue}>R$ 1.200</ThemedText>
            <ThemedText style={styles.planStudents}>10 alunos</ThemedText>
          </View>
          <View style={styles.planItem}>
            <ThemedText style={styles.planName}>Plano Premium</ThemedText>
            <ThemedText style={styles.planValue}>R$ 1.800</ThemedText>
            <ThemedText style={styles.planStudents}>10 alunos</ThemedText>
          </View>
          <View style={styles.planItem}>
            <ThemedText style={styles.planName}>Plano VIP</ThemedText>
            <ThemedText style={styles.planValue}>R$ 500</ThemedText>
            <ThemedText style={styles.planStudents}>2 alunos</ThemedText>
          </View>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.chartSection}>
        <ThemedText style={styles.chartTitle}>Métodos de Pagamento Preferidos</ThemedText>
        <View style={styles.paymentMethods}>
          <View style={styles.paymentMethod}>
            <ThemedText style={styles.paymentIcon}>📱</ThemedText>
            <ThemedText style={styles.paymentName}>PIX</ThemedText>
            <ThemedText style={styles.paymentPercentage}>60%</ThemedText>
          </View>
          <View style={styles.paymentMethod}>
            <ThemedText style={styles.paymentIcon}>💳</ThemedText>
            <ThemedText style={styles.paymentName}>Cartão</ThemedText>
            <ThemedText style={styles.paymentPercentage}>30%</ThemedText>
          </View>
          <View style={styles.paymentMethod}>
            <ThemedText style={styles.paymentIcon}>🧾</ThemedText>
            <ThemedText style={styles.paymentName}>Boleto</ThemedText>
            <ThemedText style={styles.paymentPercentage}>10%</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAttendanceReport = () => (
    <View>
      {/* Attendance Stats */}
      <View style={styles.attendanceStats}>
        <View style={styles.attendanceStat}>
          <ThemedText style={styles.attendanceValue}>{thisMonthCheckIns.length}</ThemedText>
          <ThemedText style={styles.attendanceLabel}>Check-ins este mês</ThemedText>
        </View>
        <View style={styles.attendanceStat}>
          <ThemedText style={styles.attendanceValue}>{averageAttendance.toFixed(1)}</ThemedText>
          <ThemedText style={styles.attendanceLabel}>Média por aluno</ThemedText>
        </View>
      </View>

      {/* Most Active Students */}
      <View style={styles.chartSection}>
        <ThemedText style={styles.chartTitle}>Alunos Mais Assíduos</ThemedText>
        {students
          .sort((a, b) => {
            const aCheckIns = mockCheckIns.filter(c => c.studentId === a.id).length;
            const bCheckIns = mockCheckIns.filter(c => c.studentId === b.id).length;
            return bCheckIns - aCheckIns;
          })
          .slice(0, 5)
          .map((student, index) => {
            const checkInCount = mockCheckIns.filter(c => c.studentId === student.id).length;
            return (
              <View key={student.id} style={styles.attendanceItem}>
                <ThemedText style={styles.attendancePosition}>{index + 1}º</ThemedText>
                <ThemedText style={styles.attendanceName}>{student.name}</ThemedText>
                <ThemedText style={styles.attendanceCount}>{checkInCount} treinos</ThemedText>
              </View>
            );
          })}
      </View>

      {/* Peak Hours */}
      <View style={styles.chartSection}>
        <ThemedText style={styles.chartTitle}>Horários de Pico</ThemedText>
        <View style={styles.peakHours}>
          <View style={styles.peakHour}>
            <ThemedText style={styles.peakTime}>18:00 - 19:00</ThemedText>
            <ThemedText style={styles.peakCount}>15 alunos/dia</ThemedText>
          </View>
          <View style={styles.peakHour}>
            <ThemedText style={styles.peakTime}>19:00 - 20:00</ThemedText>
            <ThemedText style={styles.peakCount}>12 alunos/dia</ThemedText>
          </View>
          <View style={styles.peakHour}>
            <ThemedText style={styles.peakTime}>20:00 - 21:00</ThemedText>
            <ThemedText style={styles.peakCount}>8 alunos/dia</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Relatórios
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Análises e insights da academia
        </ThemedText>
      </ThemedView>

      {/* Report Selector */}
      <View style={styles.selectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              selectedReport === 'overview' && styles.selectorButtonActive
            ]}
            onPress={() => setSelectedReport('overview')}
          >
            <ThemedText style={[
              styles.selectorText,
              selectedReport === 'overview' && styles.selectorTextActive
            ]}>
              Visão Geral
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.selectorButton,
              selectedReport === 'students' && styles.selectorButtonActive
            ]}
            onPress={() => setSelectedReport('students')}
          >
            <ThemedText style={[
              styles.selectorText,
              selectedReport === 'students' && styles.selectorTextActive
            ]}>
              Alunos
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.selectorButton,
              selectedReport === 'financial' && styles.selectorButtonActive
            ]}
            onPress={() => setSelectedReport('financial')}
          >
            <ThemedText style={[
              styles.selectorText,
              selectedReport === 'financial' && styles.selectorTextActive
            ]}>
              Financeiro
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.selectorButton,
              selectedReport === 'attendance' && styles.selectorButtonActive
            ]}
            onPress={() => setSelectedReport('attendance')}
          >
            <ThemedText style={[
              styles.selectorText,
              selectedReport === 'attendance' && styles.selectorTextActive
            ]}>
              Frequência
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Report Content */}
      <ThemedView style={styles.reportContent}>
        {selectedReport === 'overview' && renderOverviewReport()}
        {selectedReport === 'students' && renderStudentsReport()}
        {selectedReport === 'financial' && renderFinancialReport()}
        {selectedReport === 'attendance' && renderAttendanceReport()}
      </ThemedView>

      {/* Export Button */}
      <View style={styles.exportContainer}>
        <TouchableOpacity style={styles.exportButton}>
          <ThemedText style={styles.exportButtonText}>📊 Exportar Relatório</ThemedText>
        </TouchableOpacity>
      </View>
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
  selectorContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  selectorButton: {
    backgroundColor: '#ecf0f1',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
  },
  selectorButtonActive: {
    backgroundColor: '#e74c3c',
  },
  selectorText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  selectorTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  reportContent: {
    margin: 20,
    marginTop: 10,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  metricChange: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '500',
  },
  chartSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  modalityChart: {
    gap: 15,
  },
  modalityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalityBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginRight: 15,
  },
  modalityFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalityInfo: {
    width: 100,
  },
  modalityName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  modalityCount: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  rankingSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  rankingPosition: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankingNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rankingInfo: {
    flex: 1,
  },
  rankingName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  rankingStyle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  rankingPoints: {
    alignItems: 'flex-end',
  },
  rankingPointsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  rankingPointsLabel: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  levelStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  levelItem: {
    alignItems: 'center',
  },
  levelCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  levelLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  revenueSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planRevenue: {
    gap: 15,
  },
  planItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  planName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    flex: 1,
  },
  planValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginRight: 15,
  },
  planStudents: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paymentMethod: {
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  paymentName: {
    fontSize: 12,
    color: '#2c3e50',
    marginBottom: 5,
  },
  paymentPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  attendanceStats: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  attendanceStat: {
    flex: 1,
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
  attendanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  attendanceLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  attendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  attendancePosition: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
    width: 30,
  },
  attendanceName: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
    marginLeft: 15,
  },
  attendanceCount: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  peakHours: {
    gap: 10,
  },
  peakHour: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  peakTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  peakCount: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  exportContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  exportButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
