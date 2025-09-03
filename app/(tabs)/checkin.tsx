import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { Student } from '@/types';
import { mockCheckIns, getCheckInsByStudentId } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function CheckInScreen() {
  const { user } = useAuth();
  const [showQRModal, setShowQRModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  if (user?.type !== 'student') {
    return null;
  }

  const student = user as Student;
  const checkIns = getCheckInsByStudentId(student.id);
  const recentCheckIns = checkIns
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

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

  const handleQRCheckIn = () => {
    router.push('/qr-scanner');
  };

  const handleManualCheckIn = () => {
    setShowManualModal(true);
  };

  const confirmManualCheckIn = () => {
    setShowManualModal(false);
    Alert.alert(
      'Check-in Realizado!',
      'Você ganhou 10 pontos pelo treino de hoje! 🥊',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Check-in
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Registre sua presença nos treinos
        </ThemedText>
      </ThemedView>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{thisWeekCheckIns.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Esta Semana</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{thisMonthCheckIns.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Este Mês</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{checkIns.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total</ThemedText>
        </View>
      </View>

      {/* Check-in Options */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Fazer Check-in
        </ThemedText>
        
        <View style={styles.checkInOptions}>
          {/* <TouchableOpacity
            style={styles.checkInButton}
            onPress={handleQRCheckIn}
          >
            <View style={styles.checkInIcon}>
              <ThemedText style={styles.checkInIconText}>📱</ThemedText>
            </View>
            <ThemedText style={styles.checkInButtonTitle}>QR Code</ThemedText>
            <ThemedText style={styles.checkInButtonSubtitle}>
              Escaneie o código na entrada
            </ThemedText>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.checkInButton}
            onPress={handleManualCheckIn}
          >
            <View style={styles.checkInIcon}>
              <ThemedText style={styles.checkInIconText}>✋</ThemedText>
            </View>
            <ThemedText style={styles.checkInButtonTitle}>Manual</ThemedText>
            <ThemedText style={styles.checkInButtonSubtitle}>
              Registrar presença manualmente
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Today's Schedule */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Horários de Hoje
        </ThemedText>
        
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <ThemedText style={styles.scheduleTimeText}>18:00</ThemedText>
            </View>
            <View style={styles.scheduleInfo}>
              <ThemedText style={styles.scheduleTitle}>Muay Thai - Iniciante</ThemedText>
              <ThemedText style={styles.scheduleInstructor}>Prof. Saitama</ThemedText>
            </View>
            <View style={styles.scheduleStatus}>
              <ThemedText style={styles.scheduleStatusText}>Disponível</ThemedText>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <ThemedText style={styles.scheduleTimeText}>19:30</ThemedText>
            </View>
            <View style={styles.scheduleInfo}>
              <ThemedText style={styles.scheduleTitle}>Jiu-Jitsu - Intermediário</ThemedText>
              <ThemedText style={styles.scheduleInstructor}>Prof. Saitama</ThemedText>
            </View>
            <View style={styles.scheduleStatus}>
              <ThemedText style={styles.scheduleStatusText}>Disponível</ThemedText>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <ThemedText style={styles.scheduleTimeText}>21:00</ThemedText>
            </View>
            <View style={styles.scheduleInfo}>
              <ThemedText style={styles.scheduleTitle}>MMA - Avançado</ThemedText>
              <ThemedText style={styles.scheduleInstructor}>Prof. Saitama</ThemedText>
            </View>
            <View style={styles.scheduleStatus}>
              <ThemedText style={styles.scheduleStatusText}>Disponível</ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>

      {/* Recent Check-ins */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Histórico Recente
        </ThemedText>
        
        {recentCheckIns.map((checkIn) => (
          <View key={checkIn.id} style={styles.historyItem}>
            <View style={styles.historyDate}>
              <ThemedText style={styles.historyDateText}>
                {new Date(checkIn.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit'
                })}
              </ThemedText>
              <ThemedText style={styles.historyTimeText}>
                {new Date(checkIn.date).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </ThemedText>
            </View>
            <View style={styles.historyInfo}>
              <ThemedText style={styles.historyType}>
                {checkIn.type === 'training' ? 'Treino' : 
                 checkIn.type === 'event' ? 'Evento' : 'Exame'}
              </ThemedText>
              <ThemedText style={styles.historyPoints}>+{checkIn.points} pts</ThemedText>
            </View>
            <View style={styles.historyStatus}>
              <View style={styles.historyStatusDot} />
            </View>
          </View>
        ))}
      </ThemedView>

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContent}>
            <ThemedText style={styles.qrModalTitle}>
              Escaneando QR Code...
            </ThemedText>
            <View style={styles.qrScanner}>
              <View style={styles.qrFrame}>
                <ThemedText style={styles.qrIcon}>📱</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.qrModalSubtitle}>
              Aponte a câmera para o QR Code na entrada
            </ThemedText>
            <TouchableOpacity
              style={styles.qrCancelButton}
              onPress={() => setShowQRModal(false)}
            >
              <ThemedText style={styles.qrCancelText}>Cancelar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Manual Check-in Modal */}
      <Modal
        visible={showManualModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowManualModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.manualModalContent}>
            <ThemedText style={styles.manualModalTitle}>
              Check-in Manual
            </ThemedText>
            <ThemedText style={styles.manualModalSubtitle}>
              Confirme sua presença no treino de hoje
            </ThemedText>
            
            <View style={styles.manualCheckInInfo}>
              <ThemedText style={styles.manualInfoLabel}>Data:</ThemedText>
              <ThemedText style={styles.manualInfoValue}>
                {new Date().toLocaleDateString('pt-BR')}
              </ThemedText>
            </View>
            
            <View style={styles.manualCheckInInfo}>
              <ThemedText style={styles.manualInfoLabel}>Horário:</ThemedText>
              <ThemedText style={styles.manualInfoValue}>
                {new Date().toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </ThemedText>
            </View>

            <View style={styles.manualButtons}>
              <TouchableOpacity
                style={styles.manualCancelButton}
                onPress={() => setShowManualModal(false)}
              >
                <ThemedText style={styles.manualCancelText}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.manualConfirmButton}
                onPress={confirmManualCheckIn}
              >
                <ThemedText style={styles.manualConfirmText}>Confirmar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
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
  checkInOptions: {
    flexDirection: 'row',
    gap: 15,
  },
  checkInButton: {
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
  checkInIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkInIconText: {
    fontSize: 24,
  },
  checkInButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#2c3e50',
  },
  checkInButtonSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  scheduleTime: {
    width: 60,
    marginRight: 15,
  },
  scheduleTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  scheduleInstructor: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  scheduleStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#d5f4e6',
    borderRadius: 8,
  },
  scheduleStatusText: {
    fontSize: 10,
    color: '#27ae60',
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
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
  historyDate: {
    width: 60,
    marginRight: 15,
  },
  historyDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  },
  historyTimeText: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  historyInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyType: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyPoints: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
  },
  historyStatus: {
    marginLeft: 10,
  },
  historyStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27ae60',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  qrScanner: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e74c3c',
    borderStyle: 'dashed',
  },
  qrFrame: {
    width: 150,
    height: 150,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrIcon: {
    fontSize: 40,
  },
  qrModalSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrCancelButton: {
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  qrCancelText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  manualModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
  },
  manualModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2c3e50',
  },
  manualModalSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  manualCheckInInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    marginBottom: 10,
  },
  manualInfoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  manualInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  manualButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 30,
  },
  manualCancelButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  manualCancelText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  manualConfirmButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  manualConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
