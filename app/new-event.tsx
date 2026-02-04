import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/button';
import { AuthInput } from '@/components/auth/input';
import { BrandColors } from '@/constants/theme';
import { EventType } from '@/features/events/types';

export default function NewEventScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<EventType>('meetup');
  const [loading, setLoading] = useState(false);

  const eventTypes: Array<{ type: EventType; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = [
    { type: 'meetup', label: 'Encontro', icon: 'car-outline', color: '#EF4444' },
    { type: 'exhibition', label: 'Exposição', icon: 'trophy-outline', color: '#EAB308' },
    { type: 'ride', label: 'Rolê', icon: 'map-outline', color: '#22C55E' },
  ];

  const handleCreateEvent = async () => {
    if (!title.trim() || !location.trim() || !date.trim() || !time.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implementar criação do evento na API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulação
      
      Alert.alert('Sucesso', 'Evento criado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível criar o evento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={BrandColors.white} />
            </TouchableOpacity>

            <Text style={styles.title}>
              CRIAR <Text style={styles.titleAccent}>EVENTO</Text>
            </Text>

            <Text style={styles.subtitle}>Organize um encontro ou rolê</Text>

            <View style={styles.form}>
              <AuthInput
                icon="calendar-outline"
                placeholder="Título do evento"
                value={title}
                onChangeText={setTitle}
                autoCapitalize="words"
              />

              <View style={styles.typeContainer}>
                <Text style={styles.label}>Tipo de evento</Text>
                <View style={styles.typeButtons}>
                  {eventTypes.map((type) => (
                    <TouchableOpacity
                      key={type.type}
                      style={[
                        styles.typeButton,
                        selectedType === type.type && styles.typeButtonSelected,
                        selectedType === type.type && { borderColor: type.color },
                      ]}
                      onPress={() => setSelectedType(type.type)}
                    >
                      <Ionicons
                        name={type.icon}
                        size={20}
                        color={selectedType === type.type ? type.color : BrandColors.lightGray}
                      />
                      <Text
                        style={[
                          styles.typeButtonText,
                          selectedType === type.type && { color: type.color },
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <AuthInput
                icon="location-outline"
                placeholder="Localização"
                value={location}
                onChangeText={setLocation}
                autoCapitalize="words"
              />

              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeInput}>
                  <AuthInput
                    icon="calendar-outline"
                    placeholder="Data (DD/MM/AAAA)"
                    value={date}
                    onChangeText={setDate}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.dateTimeInput}>
                  <AuthInput
                    icon="time-outline"
                    placeholder="Hora (HH:MM)"
                    value={time}
                    onChangeText={setTime}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.textAreaContainer}>
                <View style={styles.textAreaWrapper}>
                  <Ionicons name="document-text-outline" size={20} color={BrandColors.white} style={styles.textAreaIcon} />
                  <View style={styles.textArea}>
                    <TextInput
                      style={styles.textAreaInput}
                      placeholder="Descrição (opcional)"
                      placeholderTextColor={BrandColors.placeholderGray}
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </View>
              </View>

              <AuthButton
                title="CRIAR EVENTO"
                icon="add-circle-outline"
                onPress={handleCreateEvent}
                loading={loading}
                disabled={!title.trim() || !location.trim() || !date.trim() || !time.trim() || loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.darkGray,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    width: '100%',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 32,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: BrandColors.white,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  titleAccent: {
    color: BrandColors.orange,
  },
  subtitle: {
    fontSize: 14,
    color: BrandColors.lightGray,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: BrandColors.white,
    fontWeight: '600',
    marginBottom: 12,
  },
  typeContainer: {
    marginVertical: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BrandColors.mediumGray,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  typeButtonSelected: {
    backgroundColor: BrandColors.darkGray,
  },
  typeButtonText: {
    color: BrandColors.lightGray,
    fontSize: 14,
    fontWeight: '500',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  dateTimeInput: {
    flex: 1,
  },
  textAreaContainer: {
    marginVertical: 8,
  },
  textAreaWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: BrandColors.mediumGray,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 120,
  },
  textAreaIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textArea: {
    flex: 1,
  },
  textAreaInput: {
    color: BrandColors.white,
    fontSize: 16,
    padding: 0,
    minHeight: 100,
  },
});

