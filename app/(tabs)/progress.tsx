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
import { Student } from '@/types';
import { mockCheckIns, getCheckInsByStudentId } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  if (user?.type !== 'student') {
    return null;
  }

  const student = user as Student;
  const checkIns = getCheckInsByStudentId(student.id);

  // Calcular estatísticas
  const totalPoints = checkIns.reduce((sum, c) => sum + c.points, 0);
  const averagePointsPerSession = checkIns.length > 0 ? Math.round(totalPoints / checkIns.length) : 0;
  
  const thisWeekCheckIns = checkIns.filter(c => {
    const checkInDate = new Date(c.date);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    return checkInDate >= weekStart;
  });

  const thisMonthCheckIns = checkIns.filter(c => {
    const checkInDate = new Date(c.date);
    const today = new Date();
    return checkInDate.getMonth() === today.getMonth() && 
           checkInDate.getFullYear() === today.getFullYear();
  });

  const thisYearCheckIns = checkIns.filter(c => {
    const checkInDate = new Date(c.date);
    const today = new Date();
    return checkInDate.getFullYear() === today.getFullYear();
  });

  // Dados para o gráfico simples
  const getWeeklyData = () => {
    const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    return weeks.map((week, index) => ({
      label: week,
      value: Math.floor(Math.random() * 5) + 1, // Dados simulados
      height: (Math.floor(Math.random() * 5) + 1) * 20
    }));
  };

  const getMonthlyData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map((month, index) => ({
      label: month,
      value: Math.floor(Math.random() * 15) + 5,
      height: (Math.floor(Math.random() * 15) + 5) * 8
    }));
  };

  const getYearlyData = () => {
    const years = ['2022', '2023', '2024'];
    return years.map((year, index) => ({
      label: year,
      value: Math.floor(Math.random() * 100) + 50,
      height: (Math.floor(Math.random() * 100) + 50) * 1.5
    }));
  };

  const getChartData = () => {
    switch (selectedPeriod) {
      case 'week': return getWeeklyData();
      case 'month': return getMonthlyData();
      case 'year': return getYearlyData();
      default: return getMonthlyData();
    }
  };

  const chartData = getChartData();

  // Calcular próximo nível
  const levelThresholds = {
    beginner: { min: 0, max: 500, next: 'intermediate' },
    intermediate: { min: 500, max: 1000, next: 'advanced' },
    advanced: { min: 1000, max: 2000, next: 'expert' }
  };

  const currentLevel = levelThresholds[student.level as keyof typeof levelThresholds];
  const progressToNext = currentLevel ? 
    ((student.points - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100 : 0;

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Progresso
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Acompanhe sua evolução
        </ThemedText>
      </ThemedView>

      {/* Level Progress */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Nível Atual
        </ThemedText>
        
        <View style={styles.levelCard}>
          <View style={styles.levelInfo}>
            <ThemedText style={styles.levelName}>
              {student.level === 'beginner' ? 'Iniciante' :
               student.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
            </ThemedText>
            <ThemedText style={styles.levelPoints}>
              {student.points} pontos
            </ThemedText>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(progressToNext, 100)}%` }
                ]} 
              />
            </View>
            <ThemedText style={styles.progressText}>
              {Math.round(progressToNext)}% para {
                currentLevel?.next === 'intermediate' ? 'Intermediário' :
                currentLevel?.next === 'advanced' ? 'Avançado' : 'Expert'
              }
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{checkIns.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Treinos</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{totalPoints}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Pontos</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{averagePointsPerSession}</ThemedText>
          <ThemedText style={styles.statLabel}>Média/Treino</ThemedText>
        </View>
      </View>

      {/* Chart Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Frequência de Treinos
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

        {/* Simple Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            {chartData.map((item, index) => (
              <View key={index} style={styles.chartBar}>
                <View 
                  style={[
                    styles.bar, 
                    { height: Math.min(item.height, 120) }
                  ]} 
                />
                <ThemedText style={styles.barValue}>{item.value}</ThemedText>
                <ThemedText style={styles.barLabel}>{item.label}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ThemedView>

      {/* Achievements */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Conquistas
        </ThemedText>
        
        <View style={styles.achievementsContainer}>
          <View style={styles.achievementCard}>
            <ThemedText style={styles.achievementIcon}>🏆</ThemedText>
            <ThemedText style={styles.achievementTitle}>Primeira Luta</ThemedText>
            <ThemedText style={styles.achievementDescription}>
              Complete seu primeiro treino
            </ThemedText>
            <View style={styles.achievementBadge}>
              <ThemedText style={styles.achievementBadgeText}>Conquistado</ThemedText>
            </View>
          </View>

          <View style={styles.achievementCard}>
            <ThemedText style={styles.achievementIcon}>🔥</ThemedText>
            <ThemedText style={styles.achievementTitle}>Sequência de 7 dias</ThemedText>
            <ThemedText style={styles.achievementDescription}>
              Treine por 7 dias consecutivos
            </ThemedText>
            <View style={[styles.achievementBadge, styles.achievementBadgeLocked]}>
              <ThemedText style={[styles.achievementBadgeText, styles.achievementBadgeTextLocked]}>
                Bloqueado
              </ThemedText>
            </View>
          </View>

          <View style={styles.achievementCard}>
            <ThemedText style={styles.achievementIcon}>💪</ThemedText>
            <ThemedText style={styles.achievementTitle}>100 Treinos</ThemedText>
            <ThemedText style={styles.achievementDescription}>
              Complete 100 treinos
            </ThemedText>
            <View style={[styles.achievementBadge, styles.achievementBadgeLocked]}>
              <ThemedText style={[styles.achievementBadgeText, styles.achievementBadgeTextLocked]}>
                {checkIns.length}/100
              </ThemedText>
            </View>
          </View>

          <View style={styles.achievementCard}>
            <ThemedText style={styles.achievementIcon}>🥊</ThemedText>
            <ThemedText style={styles.achievementTitle}>Lutador Dedicado</ThemedText>
            <ThemedText style={styles.achievementDescription}>
              Alcance 1000 pontos
            </ThemedText>
            <View style={[styles.achievementBadge, styles.achievementBadgeLocked]}>
              <ThemedText style={[styles.achievementBadgeText, styles.achievementBadgeTextLocked]}>
                {student.points}/1000
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>

      {/* Goals */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Metas do Mês
        </ThemedText>
        
        <View style={styles.goalsContainer}>
          <View style={styles.goalItem}>
            <View style={styles.goalInfo}>
              <ThemedText style={styles.goalTitle}>Treinar 12 vezes</ThemedText>
              <ThemedText style={styles.goalProgress}>
                {thisMonthCheckIns.length}/12 treinos
              </ThemedText>
            </View>
            <View style={styles.goalProgressBar}>
              <View 
                style={[
                  styles.goalProgressFill, 
                  { width: `${Math.min((thisMonthCheckIns.length / 12) * 100, 100)}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalInfo}>
              <ThemedText style={styles.goalTitle}>Ganhar 200 pontos</ThemedText>
              <ThemedText style={styles.goalProgress}>
                {thisMonthCheckIns.reduce((sum, c) => sum + c.points, 0)}/200 pontos
              </ThemedText>
            </View>
            <View style={styles.goalProgressBar}>
              <View 
                style={[
                  styles.goalProgressFill, 
                  { width: `${Math.min((thisMonthCheckIns.reduce((sum, c) => sum + c.points, 0) / 200) * 100, 100)}%` }
                ]} 
              />
            </View>
          </View>
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
  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textTransform: 'capitalize',
  },
  levelPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
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
    padding: 20,
    alignItems: 'center',
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
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    marginBottom: 5,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  achievementsContainer: {
    gap: 15,
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    flex: 1,
    marginTop: 2,
  },
  achievementBadge: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  achievementBadgeLocked: {
    backgroundColor: '#ecf0f1',
  },
  achievementBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  achievementBadgeTextLocked: {
    color: '#7f8c8d',
  },
  goalsContainer: {
    gap: 15,
  },
  goalItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  goalProgress: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 3,
  },
});
