import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { Student, Trainer } from '@/types';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState(user?.phone || '');

  if (!user) {
    return null;
  }

  const isStudent = user.type === 'student';
  const student = isStudent ? user as Student : null;
  const trainer = !isStudent ? user as Trainer : null;

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleSaveProfile = () => {
    // Aqui você salvaria as alterações no backend
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    setShowEditModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: user.photo || 'https://via.placeholder.com/120' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <ThemedText style={styles.editImageIcon}>📷</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText type="title" style={styles.userName}>
          {user.name}
        </ThemedText>
        <ThemedText style={styles.userType}>
          {isStudent ? 'Aluno' : 'Treinador'}
        </ThemedText>
      </ThemedView>

      {/* User Info */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Informações Pessoais
        </ThemedText>
        
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Email:</ThemedText>
            <ThemedText style={styles.infoValue}>{user.email}</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Telefone:</ThemedText>
            <ThemedText style={styles.infoValue}>{user.phone}</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Membro desde:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {new Date(user.createdAt).toLocaleDateString('pt-BR')}
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <ThemedText style={styles.editButtonText}>Editar Perfil</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Student Specific Info */}
      {isStudent && student && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Informações do Aluno
          </ThemedText>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Plano:</ThemedText>
              <ThemedText style={styles.infoValue}>{student.plan.name}</ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Modalidade:</ThemedText>
              <ThemedText style={styles.infoValue}>{student.fightStyle}</ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Nível:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {student.level === 'beginner' ? 'Iniciante' :
                 student.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Categoria:</ThemedText>
              <ThemedText style={styles.infoValue}>{student.category}</ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Peso:</ThemedText>
              <ThemedText style={styles.infoValue}>{student.weight} kg</ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Pontos:</ThemedText>
              <ThemedText style={[styles.infoValue, styles.pointsValue]}>
                {student.points}
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      )}

      {/* Trainer Specific Info */}
      {!isStudent && trainer && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Informações do Treinador
          </ThemedText>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Academia:</ThemedText>
              <ThemedText style={styles.infoValue}>{trainer.gymName}</ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Especialidades:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {trainer.specialties.join(', ')}
              </ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Total de Alunos:</ThemedText>
              <ThemedText style={[styles.infoValue, styles.pointsValue]}>
                {trainer.students.length}
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      )}

      {/* Settings */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Configurações
        </ThemedText>
        
        <View style={styles.settingsCard}>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/notifications')}
          >
            <ThemedText style={styles.settingIcon}>🔔</ThemedText>
            <ThemedText style={styles.settingText}>Notificações</ThemedText>
            <ThemedText style={styles.settingArrow}>›</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/settings')}
          >
            <ThemedText style={styles.settingIcon}>⚙️</ThemedText>
            <ThemedText style={styles.settingText}>Configurações</ThemedText>
            <ThemedText style={styles.settingArrow}>›</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/events')}
          >
            <ThemedText style={styles.settingIcon}>🏆</ThemedText>
            <ThemedText style={styles.settingText}>Eventos</ThemedText>
            <ThemedText style={styles.settingArrow}>›</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          >
            <ThemedText style={styles.settingIcon}>ℹ️</ThemedText>
            <ThemedText style={styles.settingText}>Sobre o App</ThemedText>
            <ThemedText style={styles.settingArrow}>›</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutText}>Sair da Conta</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Editar Perfil
            </ThemedText>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Nome:</ThemedText>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Digite seu nome"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Telefone:</ThemedText>
              <TextInput
                style={styles.input}
                value={editedPhone}
                onChangeText={setEditedPhone}
                placeholder="Digite seu telefone"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <ThemedText style={styles.modalCancelText}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveProfile}
              >
                <ThemedText style={styles.modalSaveText}>Salvar</ThemedText>
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
    marginBottom: width < 800 ? 100 : 0,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    paddingTop: 60,
    backgroundColor: '#e74c3c',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editImageIcon: {
    fontSize: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userType: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
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
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  pointsValue: {
    color: '#e74c3c',
  },
  editButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  settingArrow: {
    fontSize: 20,
    color: '#bdc3c7',
  },
  logoutContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  logoutText: {
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
    padding: 30,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#2c3e50',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 10,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
