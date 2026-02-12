import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react-native';
import { colors, GameButton } from './GameUI';
import {useAlertStore} from '../store/useStore'; 

export default function CustomAlert() {
  const { visible, title, message, type, buttonText, hideAlert, onConfirm } = useAlertStore();
  
  const getAlertStyle = () => {
    switch(type) {
      case 'success':
        return { icon: <CheckCircle2 size={50} color="#10B981" />, color: '#10B981' };
      case 'error':
        return { icon: <XCircle size={50} color={colors.primary} />, color: colors.primary };
      case 'info':
      default:
        return { icon: <AlertCircle size={50} color={colors.secondary} />, color: colors.secondary };
    }
  };

  const handlePress = () => {
    hideAlert(); 
    if (onConfirm) {
      setTimeout(() => {
        onConfirm(); 
      }, 300);
    }
  };

  const alertStyle = getAlertStyle();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={hideAlert}
    >
      <View style={styles.overlay}>
        <View style={styles.alertCard}>
          
          <View style={[styles.iconContainer, { borderColor: alertStyle.color }]}>
            {alertStyle.icon}
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <GameButton 
            onPress={handlePress} 
            variant="primary" 
            style={{ width: '100%', marginTop: 10, backgroundColor: alertStyle.color, borderColor: alertStyle.color }}
          >
            {buttonText}
          </GameButton>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(45, 36, 36, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertCard: {
    width: '100%',
    backgroundColor: colors.cream,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: colors.dark,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.white,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  title: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 24,
    color: colors.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  }
});