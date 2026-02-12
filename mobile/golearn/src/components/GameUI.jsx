import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, TextInput } from 'react-native';

export const colors = {
  primary: '#BF4646',
  secondary: '#7EACB5',
  sand: '#EDDCC6',
  cream: '#FFF4EA',
  dark: '#2D2424',
  white: '#FFFFFF'
};

export const GameCard = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

export const GameInput = ({ label, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput 
      style={styles.input} 
      placeholderTextColor="#9CA3AF"
      {...props} 
    />
  </View>
);

export const GameButton = ({ children, onPress, variant = 'primary', style }) => {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress}
      style={[
        styles.button, 
        isPrimary ? styles.buttonPrimary : styles.buttonOutline,
        style
      ]}
    >
      <Text style={[styles.buttonText, isPrimary ? { color: colors.white } : { color: colors.dark }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export const XPBar = ({ progress = 0, color = '#10B981', height = 16, showLabel = true }) => (
  <View style={styles.xpContainer}>
    {showLabel && (
      <View style={styles.xpHeader}>
        <Text style={styles.xpLabel}>PROGRESS</Text>
        <Text style={styles.xpValue}>{progress}%</Text>
      </View>
    )}
    <View style={[styles.xpTrack, { height }]}>
      <View style={[styles.xpFill, { width: `${progress}%`, backgroundColor: color }]} />
      <View style={styles.xpShine} /> 
    </View>
  </View>
);


export const GameIconButton = ({ children, onPress, active = false, style }) => (
  <TouchableOpacity 
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.iconButton, 
      active ? styles.iconButtonActive : styles.iconButtonInactive,
      style
    ]}
  >
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cream,
    borderWidth: 4,
    borderColor: colors.dark,
    borderRadius: 24,
    padding: 24,
    
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8, 
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: colors.dark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.sand,
    borderRadius: 16,
    padding: 14,
    fontFamily: 'PlusJakartaSans-Bold',
    color: colors.dark,
    fontSize: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 6, 
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderColor: '#8A3333', 
  },
  buttonOutline: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.sand,
    borderBottomColor: '#D1BFA9',
    borderBottomWidth: 6,
  },
  buttonText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 16,
    letterSpacing: 1,
  },
  xpContainer: {
    width: '100%',
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  xpLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  xpValue: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 10,
    color: colors.dark,
  },
  xpTrack: {
    width: '100%',
    backgroundColor: colors.sand,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.dark,
    overflow: 'hidden',
    position: 'relative',
  },
  xpFill: {
    height: '100%',
    borderRadius: 6, 
  },
  xpShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255, 0.3)',
  },

  
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  iconButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.dark,
  },
  iconButtonInactive: {
    backgroundColor: colors.white,
    borderColor: colors.sand,
  }
});