import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { Trainer, Student } from '@/types';
import { mockStudents, getStudentsByTrainerId } from '@/data/mockData';

export default function StudentsScreen() {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'overdue'>('all');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  if (user?.type !== 'trainer') {
    return null;
  }

  const trainer = user as Trainer;
  const allStudents = getStudentsByTrainerId(trainer.id);
  
  // Filtrar alunos
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && student.paymentStatus === 'active') ||
                         (selectedFilter === 'overdue' && student.paymentStatus === 'overdue');
    
    return matchesSearch && matchesFilter;
  });

  const activeStudents = allStudents.filter(s => s.paymentStatus === 'active').length;
  const overdueStudents = allStudents.filter(s => s.paymentStatus === 'overdue').length;

  const handleStudentPress = (student: Student) => {
    router.push(`/student/${student.id}`);
  };

  const handleCheckIn = (student: Student) => {
    Alert.alert(
      'Check-in Realizado',
      `Check-in registrado para ${student.name}`,
      [{ text: 'OK' }]
    );
    setShowStudentModal(false);
  };

  const handleSendNotification = (student: Student) => {
    Alert.alert(
      'Notificação Enviada',
      `Notificação de pagamento enviada para ${student.name}`,
      [{ text: 'OK' }]
    );
    setShowStudentModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Alunos
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Gerencie seus alunos
        </ThemedText>
      </ThemedView>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{allStudents.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={[styles.statNumber, { color: '#27ae60' }]}>{activeStudents}</ThemedText>
          <ThemedText style={styles.statLabel}>Ativos</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={[styles.statNumber, { color: '#e74c3c' }]}>{overdueStudents}</ThemedText>
          <ThemedText style={styles.statLabel}>Inadimplentes</ThemedText>
        </View>
      </View>

      {/* Search and Filters */}
      <ThemedView style={styles.section}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar aluno..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <ThemedText style={[
              styles.filterText,
              selectedFilter === 'all' && styles.filterTextActive
            ]}>
              Todos
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'active' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('active')}
          >
            <ThemedText style={[
              styles.filterText,
              selectedFilter === 'active' && styles.filterTextActive
            ]}>
              Ativos
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'overdue' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('overdue')}
          >
            <ThemedText style={[
              styles.filterText,
              selectedFilter === 'overdue' && styles.filterTextActive
            ]}>
              Inadimplentes
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Students List */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Lista de Alunos ({filteredStudents.length})
        </ThemedText>
        
        {filteredStudents.map((student) => (
          <TouchableOpacity
            key={student.id}
            style={styles.studentCard}
            onPress={() => handleStudentPress(student)}
          >
            <Image
              source={{ uri: student.photo || 'https://via.placeholder.com/60' }}
              style={styles.studentPhoto}
            />
            <View style={styles.studentInfo}>
              <ThemedText style={styles.studentName}>{student.name}</ThemedText>
              <ThemedText style={styles.studentPlan}>{student.plan.name}</ThemedText>
              <ThemedText style={styles.studentStyle}>{student.fightStyle}</ThemedText>
            </View>
            <View style={styles.studentStatus}>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: student.paymentStatus === 'active' ? '#27ae60' : '#e74c3c' }
              ]}>
                <ThemedText style={styles.statusText}>
                  {student.paymentStatus === 'active' ? 'Ativo' : 'Pendente'}
                </ThemedText>
              </View>
              <ThemedText style={styles.studentPoints}>{student.points} pts</ThemedText>
            </View>
          </TouchableOpacity>
        ))}

        {filteredStudents.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              Nenhum aluno encontrado
            </ThemedText>
          </View>
        )}
      </ThemedView>

      {/* Add Student Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton}>
          <ThemedText style={styles.addButtonText}>+ Adicionar Aluno</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Student Detail Modal */}
      <Modal
        visible={showStudentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStudentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedStudent && (
              <>
                <View style={styles.modalHeader}>
                  <Image
                    source={{ uri: selectedStudent.photo || 'https://via.placeholder.com/80' }}
                    style={styles.modalStudentPhoto}
                  />
                  <ThemedText style={styles.modalStudentName}>
                    {selectedStudent.name}
                  </ThemedText>
                  <ThemedText style={styles.modalStudentEmail}>
                    {selectedStudent.email}
                  </ThemedText>
                </View>

                <View style={styles.modalInfo}>
                  <View style={styles.modalInfoRow}>
                    <ThemedText style={styles.modalInfoLabel}>Plano:</ThemedText>
                    <ThemedText style={styles.modalInfoValue}>{selectedStudent.plan.name}</ThemedText>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <ThemedText style={styles.modalInfoLabel}>Modalidade:</ThemedText>
                    <ThemedText style={styles.modalInfoValue}>{selectedStudent.fightStyle}</ThemedText>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <ThemedText style={styles.modalInfoLabel}>Nível:</ThemedText>
                    <ThemedText style={styles.modalInfoValue}>
                      {selectedStudent.level === 'beginner' ? 'Iniciante' :
                       selectedStudent.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </ThemedText>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <ThemedText style={styles.modalInfoLabel}>Categoria:</ThemedText>
                    <ThemedText style={styles.modalInfoValue}>{selectedStudent.category}</ThemedText>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <ThemedText style={styles.modalInfoLabel}>Pontos:</ThemedText>
                    <ThemedText style={[styles.modalInfoValue, { color: '#e74c3c' }]}>
                      {selectedStudent.points}
                    </ThemedText>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <ThemedText style={styles.modalInfoLabel}>Status:</ThemedText>
                    <ThemedText style={[
                      styles.modalInfoValue,
                      { color: selectedStudent.paymentStatus === 'active' ? '#27ae60' : '#e74c3c' }
                    ]}>
                      {selectedStudent.paymentStatus === 'active' ? 'Ativo' : 'Pendente'}
                    </ThemedText>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <ThemedText style={styles.modalInfoLabel}>Vencimento:</ThemedText>
                    <ThemedText style={styles.modalInfoValue}>
                      {new Date(selectedStudent.dueDate).toLocaleDateString('pt-BR')}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={() => handleCheckIn(selectedStudent)}
                  >
                    <ThemedText style={styles.modalActionIcon}>✅</ThemedText>
                    <ThemedText style={styles.modalActionText}>Check-in</ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={() => handleSendNotification(selectedStudent)}
                  >
                    <ThemedText style={styles.modalActionIcon}>📧</ThemedText>
                    <ThemedText style={styles.modalActionText}>Notificar</ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.modalActionButton}>
                    <ThemedText style={styles.modalActionIcon}>✏️</ThemedText>
                    <ThemedText style={styles.modalActionText}>Editar</ThemedText>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowStudentModal(false)}
                >
                  <ThemedText style={styles.modalCloseText}>Fechar</ThemedText>
                </TouchableOpacity>
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
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#e74c3c',
  },
  filterText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  studentPlan: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  studentStyle: {
    fontSize: 12,
    color: '#95a5a6',
  },
  studentStatus: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  studentPoints: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  addButtonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  addButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
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
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  modalStudentPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  modalStudentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  modalStudentEmail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  modalInfo: {
    marginBottom: 25,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  modalInfoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  modalInfoValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  modalActionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    minWidth: 80,
  },
  modalActionIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  modalActionText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '500',
  },
  modalCloseButton: {
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
});
