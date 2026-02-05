import { Ionicons } from '@expo/vector-icons';
import { Box, Button, ButtonText, HStack, Text, VStack } from '@gluestack-ui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors, DefaultFonts } from '@/constants/theme';
import { EventTypeBackend } from '@/features/events/types';
import { eventService } from '@/services/event.service';

interface EventFormData {
    title: string;
    type: EventTypeBackend;
    description: string;
    eventDate: Date;
    address: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

const EVENT_TYPES: {
    type: EventTypeBackend;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}[] = [
        { type: 'MEET', label: 'Encontro', icon: 'car-outline', color: '#EF4444' },
        { type: 'RACE', label: 'Corrida', icon: 'flag-outline', color: '#EAB308' },
        { type: 'CRUISE', label: 'Rolê', icon: 'map-outline', color: '#22C55E' },
        { type: 'SHOWOFF', label: 'Exposição', icon: 'trophy-outline', color: '#8B5CF6' },
        { type: 'DRIFT', label: 'Drift', icon: 'sync-outline', color: '#F97316' },
        { type: 'TIME_ATTACK', label: 'Time Attack', icon: 'stopwatch-outline', color: '#06B6D4' },
        { type: 'OFFROAD', label: 'Offroad', icon: 'trail-sign-outline', color: '#84CC16' },
    ];

export default function NewEventScreen() {
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        type: 'MEET',
        description: '',
        eventDate: new Date(),
        address: {
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
        },
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [loading, setLoading] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    const updateField = (field: keyof EventFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateAddress = (field: keyof EventFormData['address'], value: string) => {
        setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, [field]: value },
        }));
    };

    const handleInputFocus = () => {
        // Pequeno delay para garantir que o teclado apareceu
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 300);
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
            if (event.type === 'dismissed') {
                return;
            }
        }
        if (selectedDate) {
            // Combina a data selecionada com a hora atual
            const newDate = new Date(selectedDate);
            newDate.setHours(formData.eventDate.getHours());
            newDate.setMinutes(formData.eventDate.getMinutes());
            updateField('eventDate', newDate);
            if (Platform.OS === 'ios') {
                setShowDatePicker(false);
            }
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
            if (event.type === 'dismissed') {
                return;
            }
        }
        if (selectedTime) {
            // Combina a hora selecionada com a data atual
            const newDate = new Date(formData.eventDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            updateField('eventDate', newDate);
            if (Platform.OS === 'ios') {
                setShowTimePicker(false);
            }
        }
    };

    const handleCreateEvent = async () => {
        // Validação de campos obrigatórios
        if (!formData.title.trim()) {
            Alert.alert('Erro', 'Por favor, preencha o título do evento');
            return;
        }

        if (!formData.address.city.trim() || !formData.address.state.trim()) {
            Alert.alert('Erro', 'Por favor, preencha a cidade e o estado');
            return;
        }

        setLoading(true);
        try {
            // Converte a data para ISO8601
            const eventDateISO = formData.eventDate.toISOString();

            // Prepara o payload
            const payload: any = {
                title: formData.title.trim(),
                type: formData.type,
                description: formData.description.trim() || '',
                eventDate: eventDateISO,
                address: {
                    city: formData.address.city.trim(),
                    state: formData.address.state.trim(),
                },
            };

            // Adiciona campos opcionais do endereço se preenchidos
            if (formData.address.street.trim()) {
                payload.address.street = formData.address.street.trim();
            }
            if (formData.address.number.trim()) {
                payload.address.number = formData.address.number.trim();
            }
            if (formData.address.neighborhood.trim()) {
                payload.address.neighborhood = formData.address.neighborhood.trim();
            }
            if (formData.address.zipCode.trim()) {
                payload.address.zipCode = formData.address.zipCode.trim();
            }

            await eventService.createEvent(payload);

            Alert.alert('Sucesso', 'Evento criado com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error: any) {
            console.error('Erro ao criar evento:', error);
            Alert.alert(
                'Erro',
                error instanceof Error ? error.message : 'Não foi possível criar o evento. Tente novamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    const canSubmit =
        formData.title.trim() !== '' &&
        formData.address.city.trim() !== '' &&
        formData.address.state.trim() !== '';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <Box flex={1} bg={BrandColors.darkGray}>
                    {/* Header */}
                    <Box
                        px="$6"
                        py="$4"
                        borderBottomWidth={1}
                        borderBottomColor="rgba(255,255,255,0.1)"
                    >
                        <HStack alignItems="center" justifyContent="space-between">
                            <Pressable
                                onPress={() => router.back()}
                                style={({ pressed }) => [
                                    styles.backButton,
                                    pressed && styles.backButtonPressed,
                                ]}
                            >
                                <Ionicons name="arrow-back" size={24} color={BrandColors.white} />
                            </Pressable>
                            <Text
                                color={BrandColors.white}
                                fontSize="$xl"
                                fontWeight="$bold"
                                flex={1}
                                textAlign="center"
                                style={{ fontFamily: DefaultFonts.heading }}
                            >
                                Criar Evento
                            </Text>
                            <Box w={40} />
                        </HStack>
                    </Box>

                    {/* Form Content */}
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={true}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled={true}
                        keyboardDismissMode="on-drag"
                    >
                        <Box px="$6" py="$4">
                            <VStack gap="$4">
                                {/* Título */}
                                <VStack gap="$2">
                                    <Text
                                        color={BrandColors.white}
                                        fontSize="$sm"
                                        fontWeight="$semibold"
                                        style={{ fontFamily: DefaultFonts.bodyBold }}
                                    >
                                        Título do evento *
                                    </Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Ex: Encontro JDM Noturno"
                                            placeholderTextColor={BrandColors.placeholderGray}
                                            value={formData.title}
                                            onChangeText={(text) => updateField('title', text)}
                                            onFocus={handleInputFocus}
                                            style={[styles.input, { fontFamily: DefaultFonts.body }]}
                                        />
                                    </View>
                                </VStack>

                                {/* Tipo de evento */}
                                <VStack gap="$2">
                                    <Text
                                        color={BrandColors.white}
                                        fontSize="$sm"
                                        fontWeight="$semibold"
                                        style={{ fontFamily: DefaultFonts.bodyBold }}
                                    >
                                        Tipo de evento *
                                    </Text>
                                    <HStack gap="$2" flexWrap="wrap">
                                        {EVENT_TYPES.map((type) => (
                                            <Pressable
                                                key={type.type}
                                                onPress={() => updateField('type', type.type)}
                                                style={({ pressed }) => [
                                                    styles.typeButton,
                                                    formData.type === type.type && {
                                                        borderColor: type.color,
                                                        backgroundColor: BrandColors.darkGray,
                                                    },
                                                    pressed && styles.typeButtonPressed,
                                                ]}
                                            >
                                                <Ionicons
                                                    name={type.icon}
                                                    size={18}
                                                    color={formData.type === type.type ? type.color : BrandColors.lightGray}
                                                />
                                                <Text
                                                    style={[
                                                        styles.typeButtonText,
                                                        formData.type === type.type && { color: type.color },
                                                        { fontFamily: DefaultFonts.body },
                                                    ]}
                                                >
                                                    {type.label}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </HStack>
                                </VStack>

                                {/* Data */}
                                <VStack gap="$2">
                                    <Text
                                        color={BrandColors.white}
                                        fontSize="$sm"
                                        fontWeight="$semibold"
                                        style={{ fontFamily: DefaultFonts.bodyBold }}
                                    >
                                        Data do evento *
                                    </Text>
                                    <Pressable
                                        onPress={() => {
                                            setPickerMode('date');
                                            setShowDatePicker(true);
                                        }}
                                        style={styles.dateTimeButton}
                                    >
                                        <Ionicons name="calendar-outline" size={20} color={BrandColors.white} />
                                        <Text
                                            color={BrandColors.white}
                                            fontSize="$md"
                                            style={{ fontFamily: DefaultFonts.body }}
                                        >
                                            {formData.eventDate.toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </Text>
                                    </Pressable>
                                    {showDatePicker && pickerMode === 'date' && (
                                        <>
                                            <DateTimePicker
                                                value={formData.eventDate}
                                                mode="date"
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                onChange={handleDateChange}
                                                minimumDate={new Date()}
                                            />
                                            {Platform.OS === 'ios' && (
                                                <Pressable
                                                    onPress={() => {
                                                        setShowDatePicker(false);
                                                    }}
                                                    style={styles.pickerButton}
                                                >
                                                    <Text style={[styles.pickerButtonText, { fontFamily: DefaultFonts.bodyBold }]}>
                                                        Confirmar Data
                                                    </Text>
                                                </Pressable>
                                            )}
                                        </>
                                    )}
                                </VStack>

                                {/* Hora */}
                                <VStack gap="$2">
                                    <Text
                                        color={BrandColors.white}
                                        fontSize="$sm"
                                        fontWeight="$semibold"
                                        style={{ fontFamily: DefaultFonts.bodyBold }}
                                    >
                                        Hora do evento *
                                    </Text>
                                    <Pressable
                                        onPress={() => {
                                            setPickerMode('time');
                                            setShowTimePicker(true);
                                        }}
                                        style={styles.dateTimeButton}
                                    >
                                        <Ionicons name="time-outline" size={20} color={BrandColors.white} />
                                        <Text
                                            color={BrandColors.white}
                                            fontSize="$md"
                                            style={{ fontFamily: DefaultFonts.body }}
                                        >
                                            {formData.eventDate.toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </Text>
                                    </Pressable>
                                    {showTimePicker && pickerMode === 'time' && (
                                        <>
                                            <DateTimePicker
                                                value={formData.eventDate}
                                                mode="time"
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                onChange={handleTimeChange}
                                            />
                                            {Platform.OS === 'ios' && (
                                                <Pressable
                                                    onPress={() => {
                                                        setShowTimePicker(false);
                                                    }}
                                                    style={styles.pickerButton}
                                                >
                                                    <Text style={[styles.pickerButtonText, { fontFamily: DefaultFonts.bodyBold }]}>
                                                        Confirmar Hora
                                                    </Text>
                                                </Pressable>
                                            )}
                                        </>
                                    )}
                                </VStack>

                                {/* Descrição */}
                                <VStack gap="$2">
                                    <Text
                                        color={BrandColors.white}
                                        fontSize="$sm"
                                        fontWeight="$semibold"
                                        style={{ fontFamily: DefaultFonts.bodyBold }}
                                    >
                                        Descrição
                                    </Text>
                                    <View style={styles.textAreaContainer}>
                                        <TextInput
                                            style={styles.textArea}
                                            placeholder="Descreva o evento"
                                            placeholderTextColor={BrandColors.placeholderGray}
                                            value={formData.description}
                                            onChangeText={(text) => updateField('description', text)}
                                            onFocus={handleInputFocus}
                                            multiline
                                            numberOfLines={4}
                                            textAlignVertical="top"
                                        />
                                    </View>
                                </VStack>

                                {/* Endereço */}
                                <VStack gap="$3" mt="$4">
                                    <Text
                                        color={BrandColors.white}
                                        fontSize="$lg"
                                        fontWeight="$bold"
                                        style={{ fontFamily: DefaultFonts.heading }}
                                    >
                                        Endereço
                                    </Text>

                                    {/* Rua e Número */}
                                    <HStack gap="$2">
                                        <VStack gap="$2" flex={2}>
                                            <Text
                                                color={BrandColors.lightGray}
                                                fontSize="$sm"
                                                style={{ fontFamily: DefaultFonts.body }}
                                            >
                                                Rua
                                            </Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    placeholder="Ex: Av. Paulista"
                                                    placeholderTextColor={BrandColors.placeholderGray}
                                                    value={formData.address.street}
                                                    onChangeText={(text) => updateAddress('street', text)}
                                                    onFocus={handleInputFocus}
                                                    style={[styles.input, { fontFamily: DefaultFonts.body }]}
                                                />
                                            </View>
                                        </VStack>
                                        <VStack gap="$2" flex={1}>
                                            <Text
                                                color={BrandColors.lightGray}
                                                fontSize="$sm"
                                                style={{ fontFamily: DefaultFonts.body }}
                                            >
                                                Número
                                            </Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    placeholder="Ex: 1578"
                                                    placeholderTextColor={BrandColors.placeholderGray}
                                                    value={formData.address.number}
                                                    onChangeText={(text) => updateAddress('number', text)}
                                                    onFocus={handleInputFocus}
                                                    keyboardType="numeric"
                                                    style={[styles.input, { fontFamily: DefaultFonts.body }]}
                                                />
                                            </View>
                                        </VStack>
                                    </HStack>

                                    {/* Bairro e CEP */}
                                    <HStack gap="$2">
                                        <VStack gap="$2" flex={1}>
                                            <Text
                                                color={BrandColors.lightGray}
                                                fontSize="$sm"
                                                style={{ fontFamily: DefaultFonts.body }}
                                            >
                                                Bairro
                                            </Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    placeholder="Ex: Bela Vista"
                                                    placeholderTextColor={BrandColors.placeholderGray}
                                                    value={formData.address.neighborhood}
                                                    onChangeText={(text) => updateAddress('neighborhood', text)}
                                                    onFocus={handleInputFocus}
                                                    style={[styles.input, { fontFamily: DefaultFonts.body }]}
                                                />
                                            </View>
                                        </VStack>
                                        <VStack gap="$2" flex={1}>
                                            <Text
                                                color={BrandColors.lightGray}
                                                fontSize="$sm"
                                                style={{ fontFamily: DefaultFonts.body }}
                                            >
                                                CEP
                                            </Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    placeholder="Ex: 01310-200"
                                                    placeholderTextColor={BrandColors.placeholderGray}
                                                    value={formData.address.zipCode}
                                                    onChangeText={(text) => updateAddress('zipCode', text)}
                                                    onFocus={handleInputFocus}
                                                    keyboardType="numeric"
                                                    style={[styles.input, { fontFamily: DefaultFonts.body }]}
                                                />
                                            </View>
                                        </VStack>
                                    </HStack>

                                    {/* Cidade e Estado */}
                                    <HStack gap="$2">
                                        <VStack gap="$2" flex={2}>
                                            <Text
                                                color={BrandColors.lightGray}
                                                fontSize="$sm"
                                                style={{ fontFamily: DefaultFonts.body }}
                                            >
                                                Cidade *
                                            </Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    placeholder="Ex: São Paulo"
                                                    placeholderTextColor={BrandColors.placeholderGray}
                                                    value={formData.address.city}
                                                    onChangeText={(text) => updateAddress('city', text)}
                                                    onFocus={handleInputFocus}
                                                    style={[styles.input, { fontFamily: DefaultFonts.body }]}
                                                />
                                            </View>
                                        </VStack>
                                        <VStack gap="$2" flex={1}>
                                            <Text
                                                color={BrandColors.lightGray}
                                                fontSize="$sm"
                                                style={{ fontFamily: DefaultFonts.body }}
                                            >
                                                Estado *
                                            </Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    placeholder="Ex: SP"
                                                    placeholderTextColor={BrandColors.placeholderGray}
                                                    value={formData.address.state}
                                                    onChangeText={(text) => updateAddress('state', text.toUpperCase())}
                                                    onFocus={handleInputFocus}
                                                    maxLength={2}
                                                    style={[styles.input, { fontFamily: DefaultFonts.body }]}
                                                />
                                            </View>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Box>
                    </ScrollView>

                    {/* Footer Button */}
                    <SafeAreaView edges={['bottom']} style={styles.footerSafeArea}>
                        <Box
                            px="$6"
                            py="$4"
                            borderTopWidth={1}
                            borderTopColor="rgba(255,255,255,0.1)"
                            bg={BrandColors.darkGray}
                        >
                            <Button
                                bg={BrandColors.orange}
                                borderRadius="$full"
                                onPress={handleCreateEvent}
                                isDisabled={!canSubmit || loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color={BrandColors.white} />
                                ) : (
                                    <ButtonText
                                        color={BrandColors.white}
                                        fontWeight="$semibold"
                                        style={{ fontFamily: DefaultFonts.bodyBold }}
                                    >
                                        Criar Evento
                                    </ButtonText>
                                )}
                            </Button>
                        </Box>
                    </SafeAreaView>
                </Box>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BrandColors.darkGray,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    backButtonPressed: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        opacity: 0.8,
    },
    typeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: BrandColors.mediumGray,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        paddingVertical: 10,
        paddingHorizontal: 12,
        minWidth: 100,
    },
    typeButtonPressed: {
        opacity: 0.8,
    },
    typeButtonText: {
        color: BrandColors.lightGray,
        fontSize: 13,
        fontWeight: '500',
    },
    dateTimeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: BrandColors.mediumGray,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    pickerButton: {
        backgroundColor: BrandColors.orange,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    pickerButtonText: {
        color: BrandColors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    inputContainer: {
        backgroundColor: BrandColors.mediumGray,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 14,
        
    },
    input: {
        flex: 1,
        color: BrandColors.white,
        fontSize: 16,
        padding: 0,
    },
    textAreaContainer: {
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
        color: BrandColors.white,
        fontSize: 16,
        padding: 0,
        minHeight: 100,
        fontFamily: DefaultFonts.body,
    },
    footerSafeArea: {
        backgroundColor: BrandColors.darkGray,
    },
});
