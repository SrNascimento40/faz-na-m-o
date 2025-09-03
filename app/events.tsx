import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'tournament' | 'seminar' | 'graduation' | 'training';
  date: string;
  time: string;
  location: string;
  instructor?: string;
  maxParticipants?: number;
  currentParticipants: number;
  price: number;
  image: string;
  requirements?: string[];
  isRegistered: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Campeonato Interno de Muay Thai',
    description: 'Competição interna para todos os níveis. Venha mostrar suas habilidades e ganhar experiência em combate.',
    type: 'tournament',
    date: '2024-02-15',
    time: '14:00',
    location: 'Academia Central Fight - Tatame Principal',
    instructor: 'Mestre Carlos Silva',
    maxParticipants: 32,
    currentParticipants: 18,
    price: 0,
    image: 'https://via.placeholder.com/300x200',
    requirements: ['Mínimo 6 meses de treino', 'Atestado médico', 'Equipamentos de proteção'],
    isRegistered: false,
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Seminário de Jiu-Jitsu com Faixa Preta',
    description: 'Seminário especial com técnicas avançadas de Jiu-Jitsu ministrado por um faixa preta renomado.',
    type: 'seminar',
    date: '2024-02-08',
    time: '10:00',
    location: 'Academia Central Fight - Sala 2',
    instructor: 'Professor João Santos',
    maxParticipants: 20,
    currentParticipants: 15,
    price: 80,
    image: 'https://via.placeholder.com/300x200',
    requirements: ['Faixa azul ou superior', 'Kimono limpo'],
    isRegistered: true,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Exame de Graduação - Muay Thai',
    description: 'Avaliação para progressão de graduação no Muay Thai. Teste suas habilidades e evolua de nível.',
    type: 'graduation',
    date: '2024-01-25',
    time: '18:00',
    location: 'Academia Central Fight - Tatame Principal',
    instructor: 'Mestre Carlos Silva',
    maxParticipants: 15,
    currentParticipants: 12,
    price: 50,
    image: 'https://via.placeholder.com/300x200',
    requirements: ['Mínimo 4 meses na graduação atual', 'Frequência mínima de 75%'],
    isRegistered: false,
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Treino Especial de Condicionamento',
    description: 'Treino focado em condicionamento físico e resistência para lutadores de todos os níveis.',
    type: 'training',
    date: '2024-01-20',
    time: '07:00',
    location: 'Academia Central Fight - Área Externa',
    instructor: 'Professor Ana Costa',
    maxParticipants: 25,
    currentParticipants: 22,
    price: 0,
    image: 'https://via.placeholder.com/300x200',
    isRegistered: true,
    status: 'completed'
  },
  {
    id: '5',
    title: 'Workshop de Defesa Pessoal',
    description: 'Aprenda técnicas básicas de defesa pessoal aplicáveis no dia a dia. Aberto ao público.',
    type: 'seminar',
    date: '2024-03-10',
    time: '15:00',
    location: 'Academia Central Fight - Sala 1',
    instructor: 'Professor Roberto Lima',
    maxParticipants: 30,
    currentParticipants: 8,
    price: 40,
    image: 'https://via.placeholder.com/300x200',
    requirements: ['Roupas confortáveis'],
    isRegistered: false,
    status: 'upcoming'
  }
];

export default function EventsScreen() {
  const { user } = useAuth();
  const [events, setEvents] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'registered'>('all');

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'tournament': return '🏆';
      case 'seminar': return '📚';
      case 'graduation': return '🥋';
      case 'training': return '💪';
      default: return '📅';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#3498db';
      case 'ongoing': return '#f39c12';
      case 'completed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Próximo';
      case 'ongoing': return 'Em andamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRegister = (event: Event) => {
    if (event.isRegistered) {
      Alert.alert(
        'Cancelar Inscrição',
        `Deseja cancelar sua inscrição no evento "${event.title}"?`,
        [
          { text: 'Não', style: 'cancel' },
          {
            text: 'Sim',
            onPress: () => {
              setEvents(prev => prev.map(e => 
                e.id === event.id 
                  ? { ...e, isRegistered: false, currentParticipants: e.currentParticipants - 1 }
                  : e
              ));
              Alert.alert('Sucesso', 'Inscrição cancelada com sucesso!');
            }
          }
        ]
      );
    } else {
      if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
        Alert.alert('Evento Lotado', 'Este evento já atingiu o número máximo de participantes.');
        return;
      }

      Alert.alert(
        'Confirmar Inscrição',
        `Deseja se inscrever no evento "${event.title}"?${event.price > 0 ? `\n\nValor: R$ ${event.price.toFixed(2)}` : ''}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar',
            onPress: () => {
              setEvents(prev => prev.map(e => 
                e.id === event.id 
                  ? { ...e, isRegistered: true, currentParticipants: e.currentParticipants + 1 }
                  : e
              ));
              Alert.alert('Sucesso', 'Inscrição realizada com sucesso!');
            }
          }
        ]
      );
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'upcoming') return event.status === 'upcoming';
    if (filter === 'registered') return event.isRegistered;
    return true;
  });

  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const registeredEvents = events.filter(e => e.isRegistered).length;

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>← Voltar</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Eventos
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Campeonatos, seminários e treinos especiais
        </ThemedText>
      </ThemedView>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{upcomingEvents}</ThemedText>
          <ThemedText style={styles.statLabel}>Próximos</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{registeredEvents}</ThemedText>
          <ThemedText style={styles.statLabel}>Inscrições</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{events.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total</ThemedText>
        </View>
      </View>

      {/* Filter */}
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
            Todos
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'upcoming' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('upcoming')}
        >
          <ThemedText style={[
            styles.filterText,
            filter === 'upcoming' && styles.filterTextActive
          ]}>
            Próximos
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'registered' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('registered')}
        >
          <ThemedText style={[
            styles.filterText,
            filter === 'registered' && styles.filterTextActive
          ]}>
            Minhas Inscrições
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Events List */}
      <ThemedView style={styles.eventsContainer}>
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateIcon}>📅</ThemedText>
            <ThemedText style={styles.emptyStateTitle}>
              {filter === 'registered' ? 'Nenhuma inscrição' : 'Nenhum evento'}
            </ThemedText>
            <ThemedText style={styles.emptyStateMessage}>
              {filter === 'registered' 
                ? 'Você ainda não se inscreveu em nenhum evento.'
                : 'Não há eventos disponíveis no momento.'
              }
            </ThemedText>
          </View>
        ) : (
          filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
            >
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <View style={styles.eventTitleContainer}>
                    <ThemedText style={styles.eventIcon}>
                      {getEventIcon(event.type)}
                    </ThemedText>
                    <ThemedText style={styles.eventTitle} numberOfLines={2}>
                      {event.title}
                    </ThemedText>
                  </View>
                  
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(event.status) }
                  ]}>
                    <ThemedText style={styles.statusText}>
                      {getStatusText(event.status)}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.eventDescription} numberOfLines={2}>
                  {event.description}
                </ThemedText>

                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailItem}>
                    <ThemedText style={styles.eventDetailIcon}>📅</ThemedText>
                    <ThemedText style={styles.eventDetailText}>
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.eventDetailItem}>
                    <ThemedText style={styles.eventDetailIcon}>🕐</ThemedText>
                    <ThemedText style={styles.eventDetailText}>
                      {event.time}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.eventDetailItem}>
                    <ThemedText style={styles.eventDetailIcon}>👥</ThemedText>
                    <ThemedText style={styles.eventDetailText}>
                      {event.currentParticipants}
                      {event.maxParticipants && `/${event.maxParticipants}`}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.eventFooter}>
                  <View style={styles.priceContainer}>
                    <ThemedText style={styles.eventPrice}>
                      {event.price === 0 ? 'Gratuito' : `R$ ${event.price.toFixed(2)}`}
                    </ThemedText>
                  </View>
                  
                  {event.isRegistered && (
                    <View style={styles.registeredBadge}>
                      <ThemedText style={styles.registeredText}>✓ Inscrito</ThemedText>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ThemedView>

      {/* Event Detail Modal */}
      <Modal
        visible={showEventModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEventModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedEvent && (
              <>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Image source={{ uri: selectedEvent.image }} style={styles.modalImage} />
                  
                  <View style={styles.modalHeader}>
                    <ThemedText style={styles.modalTitle}>
                      {selectedEvent.title}
                    </ThemedText>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(selectedEvent.status) }
                    ]}>
                      <ThemedText style={styles.statusText}>
                        {getStatusText(selectedEvent.status)}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={styles.modalDescription}>
                    {selectedEvent.description}
                  </ThemedText>

                  <View style={styles.modalDetails}>
                    <View style={styles.modalDetailItem}>
                      <ThemedText style={styles.modalDetailLabel}>Data:</ThemedText>
                      <ThemedText style={styles.modalDetailValue}>
                        {formatDate(selectedEvent.date)}
                      </ThemedText>
                    </View>
                    
                    <View style={styles.modalDetailItem}>
                      <ThemedText style={styles.modalDetailLabel}>Horário:</ThemedText>
                      <ThemedText style={styles.modalDetailValue}>
                        {selectedEvent.time}
                      </ThemedText>
                    </View>
                    
                    <View style={styles.modalDetailItem}>
                      <ThemedText style={styles.modalDetailLabel}>Local:</ThemedText>
                      <ThemedText style={styles.modalDetailValue}>
                        {selectedEvent.location}
                      </ThemedText>
                    </View>
                    
                    {selectedEvent.instructor && (
                      <View style={styles.modalDetailItem}>
                        <ThemedText style={styles.modalDetailLabel}>Instrutor:</ThemedText>
                        <ThemedText style={styles.modalDetailValue}>
                          {selectedEvent.instructor}
                        </ThemedText>
                      </View>
                    )}
                    
                    <View style={styles.modalDetailItem}>
                      <ThemedText style={styles.modalDetailLabel}>Participantes:</ThemedText>
                      <ThemedText style={styles.modalDetailValue}>
                        {selectedEvent.currentParticipants}
                        {selectedEvent.maxParticipants && `/${selectedEvent.maxParticipants}`}
                      </ThemedText>
                    </View>
                    
                    <View style={styles.modalDetailItem}>
                      <ThemedText style={styles.modalDetailLabel}>Valor:</ThemedText>
                      <ThemedText style={[
                        styles.modalDetailValue,
                        { color: selectedEvent.price === 0 ? '#27ae60' : '#e74c3c' }
                      ]}>
                        {selectedEvent.price === 0 ? 'Gratuito' : `R$ ${selectedEvent.price.toFixed(2)}`}
                      </ThemedText>
                    </View>
                  </View>

                  {selectedEvent.requirements && selectedEvent.requirements.length > 0 && (
                    <View style={styles.requirementsSection}>
                      <ThemedText style={styles.requirementsTitle}>Requisitos:</ThemedText>
                      {selectedEvent.requirements.map((req, index) => (
                        <ThemedText key={index} style={styles.requirementItem}>
                          • {req}
                        </ThemedText>
                      ))}
                    </View>
                  )}
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowEventModal(false)}
                  >
                    <ThemedText style={styles.cancelButtonText}>Fechar</ThemedText>
                  </TouchableOpacity>
                  
                  {selectedEvent.status === 'upcoming' && (
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        selectedEvent.isRegistered ? styles.unregisterButton : styles.registerButton
                      ]}
                      onPress={() => {
                        handleRegister(selectedEvent);
                        setShowEventModal(false);
                      }}
                    >
                      <ThemedText style={[
                        styles.registerButtonText,
                        selectedEvent.isRegistered && { color: '#e74c3c' }
                      ]}>
                        {selectedEvent.isRegistered ? 'Cancelar Inscrição' : 'Inscrever-se'}
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Create Event Button (for trainers) */}
      {user?.type === 'trainer' && (
        <View style={styles.createButtonContainer}>
          <TouchableOpacity style={styles.createButton}>
            <ThemedText style={styles.createButtonText}>+ Criar Evento</ThemedText>
          </TouchableOpacity>
        </View>
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 20,
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
  eventsContainer: {
    margin: 20,
    marginTop: 0,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#ecf0f1',
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 10,
  },
  eventIcon: {
    fontSize: 20,
    marginRight: 8,
    marginTop: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  eventDetailText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  registeredBadge: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  registeredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#ecf0f1',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalDetails: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  modalDetailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  modalDetailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  requirementsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  requirementItem: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
  },
  registerButton: {
    backgroundColor: '#27ae60',
  },
  unregisterButton: {
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  createButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
