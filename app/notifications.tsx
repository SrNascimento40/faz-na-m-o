import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'payment' | 'checkin' | 'event' | 'system' | 'achievement';
  date: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Pagamento Vencido',
    message: 'Sua mensalidade venceu ontem. Clique para pagar agora.',
    type: 'payment',
    date: '2024-01-15T10:30:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    title: 'Novo Recorde!',
    message: 'Parabéns! Você atingiu 1500 pontos e subiu de nível.',
    type: 'achievement',
    date: '2024-01-14T18:45:00Z',
    read: false,
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Lembrete de Treino',
    message: 'Não esqueça do seu treino hoje às 19h.',
    type: 'checkin',
    date: '2024-01-14T16:00:00Z',
    read: true,
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Campeonato Interno',
    message: 'Inscrições abertas para o campeonato de Muay Thai. Participe!',
    type: 'event',
    date: '2024-01-13T09:00:00Z',
    read: true,
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Atualização do App',
    message: 'Nova versão disponível com melhorias e correções.',
    type: 'system',
    date: '2024-01-12T14:20:00Z',
    read: true,
    priority: 'low'
  },
  {
    id: '6',
    title: 'Pagamento Confirmado',
    message: 'Seu pagamento foi processado com sucesso. Obrigado!',
    type: 'payment',
    date: '2024-01-10T11:15:00Z',
    read: true,
    priority: 'low'
  },
  {
    id: '7',
    title: 'Novo Aluno na Turma',
    message: 'Maria Silva se juntou à sua turma de Jiu-Jitsu.',
    type: 'system',
    date: '2024-01-09T08:30:00Z',
    read: true,
    priority: 'low'
  },
  {
    id: '8',
    title: 'Meta Atingida!',
    message: 'Você completou 20 treinos este mês. Continue assim!',
    type: 'achievement',
    date: '2024-01-08T20:00:00Z',
    read: true,
    priority: 'medium'
  }
];

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const onRefresh = () => {
    setRefreshing(true);
    // Simular carregamento
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💳';
      case 'checkin': return '✅';
      case 'event': return '🏆';
      case 'achievement': return '🎉';
      case 'system': return '⚙️';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    
    return date.toLocaleDateString('pt-BR');
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>← Voltar</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Notificações
        </ThemedText>
        {unreadCount > 0 && (
          <ThemedText style={styles.unreadCount}>
            {unreadCount} não lidas
          </ThemedText>
        )}
      </ThemedView>

      {/* Filter and Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('all')}
          >
            <ThemedText style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive
            ]}>
              Todas ({notifications.length})
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'unread' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('unread')}
          >
            <ThemedText style={[
              styles.filterText,
              filter === 'unread' && styles.filterTextActive
            ]}>
              Não lidas ({unreadCount})
            </ThemedText>
          </TouchableOpacity>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <ThemedText style={styles.markAllText}>Marcar todas como lidas</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ThemedView style={styles.notificationsContainer}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateIcon}>📭</ThemedText>
            <ThemedText style={styles.emptyStateTitle}>
              {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
            </ThemedText>
            <ThemedText style={styles.emptyStateMessage}>
              {filter === 'unread' 
                ? 'Todas as suas notificações foram lidas!'
                : 'Você receberá notificações sobre pagamentos, treinos e eventos aqui.'
              }
            </ThemedText>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.unreadNotification
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationLeft}>
                    <ThemedText style={styles.notificationIcon}>
                      {getNotificationIcon(notification.type)}
                    </ThemedText>
                    <View style={styles.notificationTextContainer}>
                      <ThemedText style={[
                        styles.notificationTitle,
                        !notification.read && styles.unreadTitle
                      ]}>
                        {notification.title}
                      </ThemedText>
                      <ThemedText style={styles.notificationDate}>
                        {formatDate(notification.date)}
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.notificationRight}>
                    <View style={[
                      styles.priorityIndicator,
                      { backgroundColor: getPriorityColor(notification.priority) }
                    ]} />
                    {!notification.read && (
                      <View style={styles.unreadDot} />
                    )}
                  </View>
                </View>
                
                <ThemedText style={styles.notificationMessage}>
                  {notification.message}
                </ThemedText>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteNotification(notification.id)}
              >
                <ThemedText style={styles.deleteButtonText}>🗑️</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ThemedView>

      {/* Quick Actions */}
      {user?.type === 'trainer' && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Ações Rápidas</ThemedText>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <ThemedText style={styles.quickActionIcon}>📢</ThemedText>
            <ThemedText style={styles.quickActionText}>Enviar Notificação</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <ThemedText style={styles.quickActionIcon}>📊</ThemedText>
            <ThemedText style={styles.quickActionText}>Relatório de Engajamento</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
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
  unreadCount: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 5,
  },
  actionsContainer: {
    padding: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    borderRadius: 25,
    padding: 4,
    marginBottom: 15,
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
  markAllButton: {
    alignItems: 'center',
    padding: 10,
  },
  markAllText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsContainer: {
    margin: 20,
    marginTop: 0,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  notificationDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  notificationRight: {
    alignItems: 'flex-end',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e74c3c',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 16,
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
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
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
  quickActionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
});
