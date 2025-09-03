import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Conta Excluída', 'Sua conta foi excluída com sucesso.');
            logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange,
    icon,
    danger = false 
  }: {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    icon: string;
    danger?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingLeft}>
        <ThemedText style={styles.settingIcon}>{icon}</ThemedText>
        <View style={styles.settingTextContainer}>
          <ThemedText style={[
            styles.settingTitle,
            danger && { color: '#e74c3c' }
          ]}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>
          )}
        </View>
      </View>
      
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#ecf0f1', true: '#e74c3c' }}
          thumbColor={switchValue ? '#fff' : '#bdc3c7'}
        />
      ) : (
        <ThemedText style={styles.settingArrow}>›</ThemedText>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>← Voltar</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Configurações
        </ThemedText>
      </ThemedView>

      {/* User Info */}
      <View style={styles.userSection}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <ThemedText style={styles.userAvatarText}>
              {user?.name.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.userDetails}>
            <ThemedText style={styles.userName}>{user?.name}</ThemedText>
            <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
            <ThemedText style={styles.userType}>
              {user?.type === 'student' ? 'Aluno' : 'Treinador'}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Account Settings */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Conta</ThemedText>
        
        <SettingItem
          icon="👤"
          title="Editar Perfil"
          subtitle="Alterar informações pessoais"
          onPress={() => router.push('/(tabs)/profile')}
        />
        
        <SettingItem
          icon="🔒"
          title="Alterar Senha"
          subtitle="Atualizar sua senha de acesso"
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
        />
        
        <SettingItem
          icon="🔐"
          title="Autenticação Biométrica"
          subtitle="Use sua digital ou Face ID"
          showSwitch={true}
          switchValue={biometric}
          onSwitchChange={setBiometric}
        />
      </ThemedView>

      {/* App Settings */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Aplicativo</ThemedText>
        
        <SettingItem
          icon="🔔"
          title="Notificações"
          subtitle="Receber alertas e lembretes"
          showSwitch={true}
          switchValue={notifications}
          onSwitchChange={setNotifications}
        />
        
        <SettingItem
          icon="🌙"
          title="Modo Escuro"
          subtitle="Tema escuro para o aplicativo"
          showSwitch={true}
          switchValue={darkMode}
          onSwitchChange={setDarkMode}
        />
        
        <SettingItem
          icon="☁️"
          title="Backup Automático"
          subtitle="Sincronizar dados na nuvem"
          showSwitch={true}
          switchValue={autoBackup}
          onSwitchChange={setAutoBackup}
        />
        
        <SettingItem
          icon="🌐"
          title="Idioma"
          subtitle="Português (Brasil)"
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
        />
      </ThemedView>

      {/* Support */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Suporte</ThemedText>
        
        <SettingItem
          icon="❓"
          title="Central de Ajuda"
          subtitle="FAQ e tutoriais"
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
        />
        
        <SettingItem
          icon="📞"
          title="Contatar Suporte"
          subtitle="Fale conosco"
          onPress={() => Alert.alert('Contato', 'Email: suporte@centralfight.com\nTelefone: (11) 99999-9999')}
        />
        
        <SettingItem
          icon="⭐"
          title="Avaliar App"
          subtitle="Deixe sua avaliação"
          onPress={() => Alert.alert('Obrigado!', 'Redirecionando para a loja de apps...')}
        />
        
        <SettingItem
          icon="📄"
          title="Termos de Uso"
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
        />
        
        <SettingItem
          icon="🔒"
          title="Política de Privacidade"
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
        />
      </ThemedView>

      {/* About */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Sobre</ThemedText>
        
        <SettingItem
          icon="ℹ️"
          title="Versão do App"
          subtitle="1.0.0"
          onPress={() => {}}
        />
        
        <SettingItem
          icon="🏢"
          title="Sobre o Central Fight"
          subtitle="Plataforma para academias de lutas"
          onPress={() => Alert.alert(
            'Central Fight',
            'Aplicativo desenvolvido para facilitar o gerenciamento de academias de lutas e melhorar a experiência dos alunos.\n\nVersão: 1.0.0\nDesenvolvido com React Native'
          )}
        />
      </ThemedView>

      {/* Danger Zone */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Zona de Perigo</ThemedText>
        
        <SettingItem
          icon="🚪"
          title="Sair da Conta"
          subtitle="Fazer logout do aplicativo"
          onPress={handleLogout}
          danger={true}
        />
        
        <SettingItem
          icon="🗑️"
          title="Excluir Conta"
          subtitle="Remover permanentemente sua conta"
          onPress={handleDeleteAccount}
          danger={true}
        />
      </ThemedView>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Central Fight v1.0.0
        </ThemedText>
        <ThemedText style={styles.footerText}>
          © 2024 Todos os direitos reservados
        </ThemedText>
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
  userSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  userType: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '600',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    marginLeft: 5,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  settingArrow: {
    fontSize: 20,
    color: '#bdc3c7',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 5,
  },
});
