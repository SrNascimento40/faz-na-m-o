import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { Student } from '@/types';
import { mockPayments, getPaymentsByStudentId } from '@/data/mockData';

export default function PaymentsScreen() {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');

  if (user?.type !== 'student') {
    return null;
  }

  const student = user as Student;
  const payments = getPaymentsByStudentId(student.id);
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const paidPayments = payments.filter(p => p.status === 'paid');

  const handlePayment = (payment: any) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    Alert.alert(
      'Pagamento Processado',
      `Pagamento de R$ ${selectedPayment.amount.toFixed(2)} processado com sucesso via ${
        paymentMethod === 'pix' ? 'PIX' : 
        paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 'Boleto'
      }!`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowPaymentModal(false);
            setSelectedPayment(null);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Pagamentos
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Gerencie suas mensalidades
        </ThemedText>
      </ThemedView>

      {/* Current Plan */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Plano Atual</ThemedText>
        <View style={styles.planCard}>
          <View style={styles.planInfo}>
            <ThemedText style={styles.planName}>{student.plan.name}</ThemedText>
            <ThemedText style={styles.planDescription}>{student.plan.description}</ThemedText>
            <ThemedText style={styles.planPrice}>R$ {student.plan.price.toFixed(2)}/mês</ThemedText>
          </View>
          <View style={[
            styles.planStatus,
            { backgroundColor: student.paymentStatus === 'active' ? '#27ae60' : '#e74c3c' }
          ]}>
            <ThemedText style={styles.planStatusText}>
              {student.paymentStatus === 'active' ? 'Ativo' : 'Pendente'}
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Pagamentos Pendentes
          </ThemedText>
          {pendingPayments.map((payment) => (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentInfo}>
                <ThemedText style={styles.paymentAmount}>
                  R$ {payment.amount.toFixed(2)}
                </ThemedText>
                <ThemedText style={styles.paymentDue}>
                  Vencimento: {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                </ThemedText>
                <View style={styles.paymentStatus}>
                  <View style={[styles.statusDot, { backgroundColor: '#e74c3c' }]} />
                  <ThemedText style={styles.statusText}>Pendente</ThemedText>
                </View>
              </View>
              <TouchableOpacity
                style={styles.payButton}
                onPress={() => handlePayment(payment)}
              >
                <ThemedText style={styles.payButtonText}>Pagar</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </ThemedView>
      )}

      {/* Payment History */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Histórico de Pagamentos
        </ThemedText>
        {paidPayments.map((payment) => (
          <View key={payment.id} style={styles.historyCard}>
            <View style={styles.historyInfo}>
              <ThemedText style={styles.historyAmount}>
                R$ {payment.amount.toFixed(2)}
              </ThemedText>
              <ThemedText style={styles.historyDate}>
                Pago em: {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('pt-BR') : '-'}
              </ThemedText>
              <ThemedText style={styles.historyMethod}>
                Método: {
                  payment.method === 'pix' ? 'PIX' :
                  payment.method === 'credit_card' ? 'Cartão de Crédito' : 'Boleto'
                }
              </ThemedText>
            </View>
            <View style={styles.paidStatus}>
              <View style={[styles.statusDot, { backgroundColor: '#27ae60' }]} />
              <ThemedText style={[styles.statusText, { color: '#27ae60' }]}>Pago</ThemedText>
            </View>
          </View>
        ))}
      </ThemedView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Realizar Pagamento
            </ThemedText>
            
            {selectedPayment && (
              <View style={styles.paymentDetails}>
                <ThemedText style={styles.paymentDetailAmount}>
                  R$ {selectedPayment.amount.toFixed(2)}
                </ThemedText>
                <ThemedText style={styles.paymentDetailDescription}>
                  Mensalidade - {student.plan.name}
                </ThemedText>
              </View>
            )}

            <ThemedText style={styles.methodTitle}>Método de Pagamento:</ThemedText>
            
            <View style={styles.paymentMethods}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  paymentMethod === 'pix' && styles.methodButtonActive
                ]}
                onPress={() => setPaymentMethod('pix')}
              >
                <ThemedText style={styles.methodIcon}>📱</ThemedText>
                <ThemedText style={[
                  styles.methodText,
                  paymentMethod === 'pix' && styles.methodTextActive
                ]}>PIX</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  paymentMethod === 'credit_card' && styles.methodButtonActive
                ]}
                onPress={() => setPaymentMethod('credit_card')}
              >
                <ThemedText style={styles.methodIcon}>💳</ThemedText>
                <ThemedText style={[
                  styles.methodText,
                  paymentMethod === 'credit_card' && styles.methodTextActive
                ]}>Cartão</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  paymentMethod === 'boleto' && styles.methodButtonActive
                ]}
                onPress={() => setPaymentMethod('boleto')}
              >
                <ThemedText style={styles.methodIcon}>🧾</ThemedText>
                <ThemedText style={[
                  styles.methodText,
                  paymentMethod === 'boleto' && styles.methodTextActive
                ]}>Boleto</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={processPayment}
              >
                <ThemedText style={styles.confirmButtonText}>Pagar</ThemedText>
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
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  planDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  planStatus: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  planStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  paymentDue: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  historyCard: {
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
  historyInfo: {
    flex: 1,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  historyDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  historyMethod: {
    fontSize: 12,
    color: '#95a5a6',
  },
  paidStatus: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 20,
    color: '#2c3e50',
  },
  paymentDetails: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  paymentDetailAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  paymentDetailDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  methodButton: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ecf0f1',
    marginHorizontal: 5,
  },
  methodButtonActive: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  methodIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  methodText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  methodTextActive: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
