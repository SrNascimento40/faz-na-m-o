import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'trainer'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    const success = await login(email, password, userType);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Erro', 'Email ou senha incorretos');
    }
  };

  const fillDemoCredentials = (type: 'student' | 'trainer') => {
    if (type === 'trainer') {
      setEmail('carlos@centralfight.com');
      setUserType('trainer');
    } else {
      setEmail('joao@email.com');
      setUserType('student');
    }
    setPassword('123456');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>🥊</Text>
            </View>
            <ThemedText type="title" style={styles.appName}>Central Fight</ThemedText>
            <ThemedText style={styles.subtitle}>Academia de Lutas</ThemedText>
          </View>

          {/* Seletor de tipo de usuário */}
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'student' && styles.userTypeButtonActive
              ]}
              onPress={() => setUserType('student')}
            >
              <Text style={[
                styles.userTypeText,
                userType === 'student' && styles.userTypeTextActive
              ]}>
                Aluno
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'trainer' && styles.userTypeButtonActive
              ]}
              onPress={() => setUserType('trainer')}
            >
              <Text style={[
                styles.userTypeText,
                userType === 'trainer' && styles.userTypeTextActive
              ]}>
                Treinador
              </Text>
            </TouchableOpacity>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Botões de demonstração */}
          <View style={styles.demoContainer}>
            <ThemedText style={styles.demoTitle}>Contas de Demonstração:</ThemedText>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillDemoCredentials('student')}
            >
              <Text style={styles.demoButtonText}>👨‍🎓 Login como Aluno</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillDemoCredentials('trainer')}
            >
              <Text style={styles.demoButtonText}>👨‍🏫 Login como Treinador</Text>
            </TouchableOpacity>
          </View>

          {/* Link para cadastro */}
          <TouchableOpacity style={styles.registerLink}>
            <ThemedText style={styles.registerText}>
              Não tem conta? Cadastre-se aqui
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#ecf0f1',
    borderRadius: 25,
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  userTypeButtonActive: {
    backgroundColor: '#e74c3c',
  },
  userTypeText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  userTypeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoContainer: {
    marginBottom: 20,
  },
  demoTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 10,
  },
  demoButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  registerLink: {
    alignItems: 'center',
  },
  registerText: {
    color: '#3498db',
    fontSize: 16,
  },
});
