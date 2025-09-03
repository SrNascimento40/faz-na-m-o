import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function QRScannerScreen() {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    // Simular permissão da câmera
    setHasPermission(true);
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    // Simular processamento do QR Code
    setTimeout(() => {
      try {
        const qrData = JSON.parse(data);
        
        if (qrData.type === 'checkin' && qrData.gymId) {
          Alert.alert(
            'Check-in Realizado!',
            `Check-in confirmado na academia ${qrData.gymName || 'Central Fight'}.\n\n+10 pontos adicionados!`,
            [
              {
                text: 'OK',
                onPress: () => router.back()
              }
            ]
          );
        } else {
          Alert.alert(
            'QR Code Inválido',
            'Este QR Code não é válido para check-in.',
            [
              {
                text: 'Tentar Novamente',
                onPress: () => setScanned(false)
              }
            ]
          );
        }
      } catch (error) {
        Alert.alert(
          'Erro no QR Code',
          'Não foi possível processar este QR Code.',
          [
            {
              text: 'Tentar Novamente',
              onPress: () => setScanned(false)
            }
          ]
        );
      }
    }, 1000);
  };

  const simulateQRScan = () => {
    const mockQRData = {
      type: 'checkin',
      gymId: 'gym_001',
      gymName: 'Central Fight',
      timestamp: new Date().toISOString()
    };
    
    handleBarCodeScanned({
      type: 'qr',
      data: JSON.stringify(mockQRData)
    });
  };

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Solicitando permissão da câmera...</ThemedText>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>
          Acesso à câmera negado
        </ThemedText>
        <ThemedText style={styles.errorSubtext}>
          Para usar o scanner QR, permita o acesso à câmera nas configurações do app.
        </ThemedText>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>Voltar</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.headerButtonText}>✕</ThemedText>
        </TouchableOpacity>
        
        <ThemedText style={styles.headerTitle}>Scanner QR</ThemedText>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setFlashOn(!flashOn)}
        >
          <ThemedText style={styles.headerButtonText}>
            {flashOn ? '🔦' : '💡'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Camera View Simulation */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraView}>
          {/* Scanning Frame */}
          <View style={styles.scanningFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Scanning Line Animation */}
            <View style={styles.scanningLine} />
          </View>
          
          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <ThemedText style={styles.instructionsTitle}>
              Posicione o QR Code dentro da moldura
            </ThemedText>
            <ThemedText style={styles.instructionsText}>
              O scanner detectará automaticamente o código
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        {/* Manual Check-in Button */}
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => router.push('/(tabs)/checkin')}
        >
          <ThemedText style={styles.manualButtonIcon}>✋</ThemedText>
          <ThemedText style={styles.manualButtonText}>Check-in Manual</ThemedText>
        </TouchableOpacity>

        {/* Simulate Scan Button (for demo) */}
        <TouchableOpacity
          style={styles.simulateButton}
          onPress={simulateQRScan}
          disabled={scanned}
        >
          <ThemedText style={styles.simulateButtonText}>
            {scanned ? 'Processando...' : 'Simular Scan (Demo)'}
          </ThemedText>
        </TouchableOpacity>

        {/* Help Text */}
        <ThemedText style={styles.helpText}>
          Procure pelo QR Code na recepção da academia ou peça ajuda ao instrutor
        </ThemedText>
      </View>

      {/* Processing Overlay */}
      {scanned && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingContainer}>
            <ThemedText style={styles.processingIcon}>⏳</ThemedText>
            <ThemedText style={styles.processingText}>
              Processando check-in...
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraView: {
    width: width,
    height: height - 200,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanningFrame: {
    width: 250,
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#e74c3c',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanningLine: {
    width: 200,
    height: 2,
    backgroundColor: '#e74c3c',
    opacity: 0.8,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: -80,
    alignItems: 'center',
  },
  instructionsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionsText: {
    color: '#bdc3c7',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  manualButton: {
    backgroundColor: '#34495e',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  manualButtonIcon: {
    color: '#fff',
    fontSize: 20,
    marginRight: 10,
  },
  manualButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  simulateButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  simulateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  helpText: {
    color: '#95a5a6',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 200,
  },
  processingIcon: {
    fontSize: 40,
    marginBottom: 15,
  },
  processingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  backButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
