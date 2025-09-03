import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { Student, Trainer } from '@/types';
import { mockStudents, mockPayments, mockCheckIns } from '@/data/mockData';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);

  if (user?.type !== 'trainer') {
    router.back();
    return null;
  }

  const student = mockStudents.find(s => s.id === id);
  
  if (!student) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Aluno não encontrado</ThemedText>
      </ThemedView>
    );
  }

  const studentPayments = mockPayments.filter(p => p.studentId === student.id);
  const studentCheckIns = mockCheckIns.filter(c => c.studentId === student.id);
  const recentCheckIns = studentCheckIns
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const handleEdit = () => {
    setEditedStudent({ ...student });
    setShowEditModal(true);
  };

  const handleSave = () => {
    // Aqui você salvaria as alterações no backend
    Alert.alert('Sucesso', 'Dados do aluno atualizados com sucesso!');
    setShowEditModal(false);
  };

  const handleCheckIn = () => {
    Alert.alert(
      'Check-in Realizado',
      `Check-in registrado para ${student.name}`,
      [{ text: 'OK' }]
    );
  };

  const handleSendNotification = () => {
    Alert.alert(
      'Notificação Enviada',
      `Notificação enviada para ${student.name}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>← Voltar</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Detalhes do Aluno
        </ThemedText>
      </ThemedView>

      {/* Student Info Card */}
      <View style={styles.studentCard}>
        <Image
          source={{ uri: student.photo || 'https://via.placeholder.com/120' }}
          style={styles.studentPhoto}
        />
        <View style={styles.studentInfo}>
          <ThemedText style={styles.studentName}>{student.name}</ThemedText>
          <ThemedText style={styles.studentEmail}>{student.email}</ThemedText>
          <ThemedText style={styles.studentPhone}>{student.phone}</ThemedText>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: student.paymentStatus === 'active' ? '#27ae60' : '#e74c3c' }
            ]}>
              <ThemedText style={styles.statusText}>
                {student.paymentStatus === 'active' ? 'Ativo' : 'Pendente'}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCheckIn}>
          <ThemedText style={styles.actionIcon}>✅</ThemedText>
          <ThemedText style={styles.actionText}>Check-in</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleSendNotification}>
          <ThemedText style={styles.actionIcon}>📧</ThemedText>
          <ThemedText style={styles.actionText}>Notificar</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
          <ThemedText style={styles.actionIcon}>✏️</ThemedText>
          <ThemedText style={styles.actionText}>Editar</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Student Details */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Informações Detalhadas
        </ThemedText>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Plano:</ThemedText>
            <ThemedText style={styles.detailValue}>{student.plan.name}</ThemedText>
          </View>
          
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Modalidade:</ThemedText>
            <ThemedText style={styles.detailValue}>{student.fightStyle}</ThemedText>
          </View>
          
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Nível:</ThemedText>
            <ThemedText style={styles.detailValue}>
              {student.level === 'beginner' ? 'Iniciante' :
               student.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
            </ThemedText>
          </View>
          
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Categoria:</ThemedText>
            <ThemedText style={styles.detailValue}>{student.category}</ThemedText>
          </View>
          
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Pontos:</ThemedText>
            <ThemedText style={[styles.detailValue, { color: '#e74c3c' }]}>
              {student.points}
            </ThemedText>
          </View>
          
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Vencimento:</ThemedText>
            <ThemedText style={styles.detailValue}>
              {new Date(student.dueDate).toLocaleDateString('pt-BR')}
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Payment History */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Histórico de Pagamentos
        </ThemedText>
        
        {studentPayments.map((payment) => (
          <View key={payment.id} style={styles.paymentItem}>
            <View style={styles.paymentInfo}>
              <ThemedText style={styles.paymentAmount}>
                R$ {payment.amount.toFixed(2)}
              </ThemedText>
              <ThemedText style={styles.paymentDate}>
                {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
              </ThemedText>
            </View>
            <View style={[
              styles.paymentStatus,
              { backgroundColor: payment.status === 'paid' ? '#27ae60' : '#f39c12' }
            ]}>
              <ThemedText style={styles.paymentStatusText}>
                {payment.status === 'paid' ? 'Pago' : 'Pendente'}
              </ThemedText>
            </View>
          </View>
        ))}
      </ThemedView>

      {/* Check-in History */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Histórico de Treinos
        </ThemedText>
        
        {recentCheckIns.map((checkIn) => (
          <View key={checkIn.id} style={styles.checkInItem}>
            <View style={styles.checkInInfo}>
              <ThemedText style={styles.checkInDate}>
                {new Date(checkIn.date).toLocaleDateString('pt-BR')}
              </ThemedText>
              <ThemedText style={styles.checkInType}>
                {checkIn.type === 'training' ? 'Treino' : 'Evento'}
              </ThemedText>
            </View>
            <ThemedText style={styles.checkInPoints}>+{checkIn.points} pts</ThemedText>
          </View>
        ))}
      </ThemedView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Editar Aluno</ThemedText>
            
            {editedStudent && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Nome"
                  value={editedStudent.name}
                  onChangeText={(text) => setEditedStudent({...editedStudent, name: text})}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={editedStudent.email}
                  onChangeText={(text) => setEditedStudent({...editedStudent, email: text})}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Telefone"
                  value={editedStudent.phone}
                  onChangeText={(text) => setEditedStudent({...editedStudent, phone: text})}
                />
                
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowEditModal(false)}
                  >
                    <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSave}
                  >
                    <ThemedText style={styles.saveButtonText}>Salvar</ThemedText>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  studentCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  studentPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 20,
  },
  studentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  studentEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  studentPhone: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    minWidth: 80,
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
  detailsGrid: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  paymentItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  paymentDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  paymentStatus: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  paymentStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  checkInItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
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
  checkInInfo: {
    flex: 1,
  },
  checkInDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  checkInType: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  checkInPoints: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ecf0f1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
