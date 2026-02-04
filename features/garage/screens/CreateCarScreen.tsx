import { Ionicons } from '@expo/vector-icons';
import {
    Box,
    Button,
    ButtonText,
    HStack,
    Input,
    InputField,
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/theme';
import { SearchableSelect } from '@/features/profile/components/SearchableSelect';
import { SimpleSelect } from '@/features/profile/components/SimpleSelect';
import { useAuth } from '@/hooks/use-auth';
import { userService } from '@/services/user.service';

interface FipeOption {
    code: string;
    name: string;
}

interface CarFormData {
    brand: string;
    model: string;
    year: number;
    color: string;
    nickname: string;
    trim: string;
    specs: {
        engine: string;
        horsepower: number;
        torque: number;
        transmission: string;
        drivetrain: string;
        fuelType: string;
    };
    modsList: string[];
}

const FIPE_BASE_URL = 'https://fipe.parallelum.com.br/api/v2/cars';

const STEPS = [
    { id: 1, title: 'Informações Básicas' },
    { id: 2, title: 'Detalhes' },
    { id: 3, title: 'Especificações' },
];

const TRANSMISSION_OPTIONS = [
    { label: 'Manual', value: 'MANUAL' },
    { label: 'Automática', value: 'AUTOMATIC' },
    { label: 'Dupla Embreagem', value: 'DUAL_CLUTCH' },
    { label: 'CVT', value: 'CVT' },
];

const DRIVETRAIN_OPTIONS = [
    { label: 'Dianteira (FWD)', value: 'FWD' },
    { label: 'Traseira (RWD)', value: 'RWD' },
    { label: 'Integral (AWD)', value: 'AWD' },
];

const FUEL_TYPE_OPTIONS = [
    { label: 'Gasolina', value: 'GASOLINE' },
    { label: 'Etanol', value: 'ETHANOL' },
    { label: 'Diesel', value: 'DIESEL' },
    { label: 'Híbrido', value: 'HYBRID' },
    { label: 'Elétrico', value: 'ELECTRIC' },
    { label: 'Flex', value: 'FLEX' },
];

export function CreateCarScreen() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<CarFormData>({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        nickname: '',
        trim: '',
        specs: {
            engine: '',
            horsepower: 0,
            torque: 0,
            transmission: '',
            drivetrain: '',
            fuelType: '',
        },
        modsList: [],
    });

    const [brands, setBrands] = useState<FipeOption[]>([]);
    const [models, setModels] = useState<FipeOption[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const { user } = useAuth();
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        loadBrands();
    }, []);

    useEffect(() => {
        if (formData.brand) {
            loadModels(formData.brand);
        } else {
            setModels([]);
            setFormData((prev) => ({ ...prev, model: '' }));
        }
    }, [formData.brand]);

    const loadBrands = async () => {
        setLoadingBrands(true);
        try {
            const response = await fetch(`${FIPE_BASE_URL}/brands`);
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            console.error('Erro ao carregar marcas:', error);
        } finally {
            setLoadingBrands(false);
        }
    };

    const loadModels = async (brandCode: string) => {
        setLoadingModels(true);
        try {
            const response = await fetch(`${FIPE_BASE_URL}/brands/${brandCode}/models`);
            const data = await response.json();
            setModels(data);
        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
        } finally {
            setLoadingModels(false);
        }
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const hasFormData = () => {
        return (
            formData.brand !== '' ||
            formData.model !== '' ||
            formData.year !== new Date().getFullYear() ||
            formData.color !== '' ||
            formData.nickname !== '' ||
            formData.trim !== '' ||
            formData.specs.engine !== '' ||
            formData.specs.horsepower !== 0 ||
            formData.specs.torque !== 0 ||
            formData.specs.transmission !== '' ||
            formData.specs.drivetrain !== '' ||
            formData.specs.fuelType !== '' ||
            formData.modsList.length > 0
        );
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            // Se estiver no step 1, verifica se há dados antes de sair
            if (hasFormData()) {
                setShowConfirmDialog(true);
            } else {
                router.push('/profile');
            }
        }
    };

    const handleHeaderBack = () => {
        // Botão do header sempre volta para /profile
        if (hasFormData()) {
            setShowConfirmDialog(true);
        } else {
            router.push('/profile');
        }
    };

    const handleConfirmExit = () => {
        setShowConfirmDialog(false);
        router.push('/profile');
    };

    const handleCancelExit = () => {
        setShowConfirmDialog(false);
    };

    const handleSubmit = async () => {
        if (!user?.uid) {
            Alert.alert('Erro', 'Usuário não autenticado');
            return;
        }

        setSubmitting(true);
        try {
            const payload: any = {
                brand: formData.brand,
                model: formData.model,
                year: formData.year,
                color: formData.color,
                nickname: formData.nickname,
                trim: formData.trim,
                specs: {
                    engine: formData.specs.engine,
                    horsepower: formData.specs.horsepower,
                    torque: formData.specs.torque,
                    transmission: formData.specs.transmission,
                    drivetrain: formData.specs.drivetrain,
                    fuelType: formData.specs.fuelType,
                },
            };

            // Só inclui modsList se não estiver vazio
            if (formData.modsList.length > 0) {
                payload.modsList = formData.modsList;
            }

            await userService.createCar(user.uid, payload);
            Alert.alert('Sucesso', 'Carro adicionado com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            console.error('Erro ao criar carro:', error);
            Alert.alert(
                'Erro',
                error instanceof Error ? error.message : 'Erro ao adicionar carro. Tente novamente.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const updateField = (field: keyof CarFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateSpecs = (field: keyof CarFormData['specs'], value: any) => {
        setFormData((prev) => ({
            ...prev,
            specs: { ...prev.specs, [field]: value },
        }));
    };

    const addModification = () => {
        setFormData((prev) => ({
            ...prev,
            modsList: [...prev.modsList, ''],
        }));
    };

    const updateModification = (index: number, value: string) => {
        setFormData((prev) => {
            const newModsList = [...prev.modsList];
            newModsList[index] = value;
            return { ...prev, modsList: newModsList };
        });
    };

    const removeModification = (index: number) => {
        setFormData((prev) => {
            const newModsList = prev.modsList.filter((_, i) => i !== index);
            return { ...prev, modsList: newModsList };
        });
    };

    const handleInputFocus = () => {
        // Pequeno delay para garantir que o teclado apareceu
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 300);
    };

    const canProceedStep1 = formData.brand && formData.model && formData.year > 0;
    const canSubmit = canProceedStep1;

    const renderStepIndicator = () => (
        <HStack gap="$2" justifyContent="center" mb="$4">
            {STEPS.map((step) => (
                <HStack key={step.id} alignItems="center" gap="$2">
                    <Box
                        w={32}
                        h={32}
                        borderRadius="$full"
                        bg={currentStep >= step.id ? BrandColors.orange : BrandColors.mediumGray}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Text
                            color={currentStep >= step.id ? BrandColors.white : BrandColors.lightGray}
                            fontSize="$sm"
                            fontWeight="$bold"
                        >
                            {step.id}
                        </Text>
                    </Box>
                    {step.id < STEPS.length && (
                        <Box
                            w={40}
                            h={2}
                            bg={currentStep > step.id ? BrandColors.orange : BrandColors.mediumGray}
                        />
                    )}
                </HStack>
            ))}
        </HStack>
    );

    const renderStep1 = () => (
        <VStack gap="$4">
            <Text color={BrandColors.white} fontSize="$lg" fontWeight="$bold" mb="$2">
                Informações Básicas
            </Text>

            <VStack gap="$2">
                <Text color={BrandColors.white} fontSize="$sm" fontWeight="$semibold">
                    Marca *
                </Text>
                <SearchableSelect
                    placeholder="Selecione a marca"
                    options={brands}
                    value={formData.brand}
                    onSelect={(option) => updateField('brand', option.code)}
                    loading={loadingBrands}
                />
            </VStack>

            <VStack gap="$2">
                <Text color={BrandColors.white} fontSize="$sm" fontWeight="$semibold">
                    Modelo *
                </Text>
                <SearchableSelect
                    placeholder="Selecione o modelo"
                    options={models}
                    value={formData.model}
                    onSelect={(option) => updateField('model', option.code)}
                    loading={loadingModels}
                    disabled={!formData.brand}
                />
            </VStack>

            <VStack gap="$2">
                <Text color={BrandColors.white} fontSize="$sm" fontWeight="$semibold">
                    Ano *
                </Text>
                <Input bg={BrandColors.mediumGray} borderRadius="$md">
                    <InputField
                        placeholder="Ex: 2024"
                        placeholderTextColor={BrandColors.placeholderGray}
                        color={BrandColors.white}
                        keyboardType="numeric"
                        value={formData.year.toString()}
                        onChangeText={(text) => updateField('year', parseInt(text) || 0)}
                    />
                </Input>
            </VStack>
        </VStack>
    );

    const renderStep2 = () => (
        <VStack gap="$4">
            <Text color={BrandColors.white} fontSize="$lg" fontWeight="$bold" mb="$2">
                Detalhes
            </Text>

            <VStack gap="$2">
                <Text color={BrandColors.white} fontSize="$sm" fontWeight="$semibold">
                    Cor
                </Text>
                <Input bg={BrandColors.mediumGray} borderRadius="$md">
                    <InputField
                        placeholder="Ex: Preto, Branco, Prata..."
                        placeholderTextColor={BrandColors.placeholderGray}
                        color={BrandColors.white}
                        value={formData.color}
                        onChangeText={(text) => updateField('color', text)}
                    />
                </Input>
            </VStack>

            <VStack gap="$2">
                <Text color={BrandColors.white} fontSize="$sm" fontWeight="$semibold">
                    Apelido
                </Text>
                <Input bg={BrandColors.mediumGray} borderRadius="$md">
                    <InputField
                        placeholder="Ex: Meu carro, Batmóvel..."
                        placeholderTextColor={BrandColors.placeholderGray}
                        color={BrandColors.white}
                        value={formData.nickname}
                        onChangeText={(text) => updateField('nickname', text)}
                    />
                </Input>
            </VStack>

            <VStack gap="$2">
                <Text color={BrandColors.white} fontSize="$sm" fontWeight="$semibold">
                    Versão/Trim
                </Text>
                <Input bg={BrandColors.mediumGray} borderRadius="$md">
                    <InputField
                        placeholder="Ex: Sport, Comfort, Premium..."
                        placeholderTextColor={BrandColors.placeholderGray}
                        color={BrandColors.white}
                        value={formData.trim}
                        onChangeText={(text) => updateField('trim', text)}
                    />
                </Input>
            </VStack>
        </VStack>
    );

    const renderStep3 = () => (
        <VStack gap="$4">
            <Text color={BrandColors.white} fontSize="$lg" fontWeight="$bold" mb="$2">
                Especificações
            </Text>

            <VStack gap="$3">
                <VStack gap="$2">
                    <Text color={BrandColors.lightGray} fontSize="$sm">
                        Motor
                    </Text>
                    <Input bg={BrandColors.mediumGray} borderRadius="$md">
                        <InputField
                            placeholder="Ex: 2.0 Turbo, V8 5.0..."
                            placeholderTextColor={BrandColors.placeholderGray}
                            color={BrandColors.white}
                            value={formData.specs.engine}
                            onChangeText={(text) => updateSpecs('engine', text)}
                            onFocus={handleInputFocus}
                        />
                    </Input>
                </VStack>

                <HStack gap="$3">
                    <VStack gap="$2" flex={1}>
                        <Text color={BrandColors.lightGray} fontSize="$sm">
                            Potência (cv)
                        </Text>
                        <Input bg={BrandColors.mediumGray} borderRadius="$md">
                            <InputField
                                placeholder="Ex: 200"
                                placeholderTextColor={BrandColors.placeholderGray}
                                color={BrandColors.white}
                                keyboardType="numeric"
                                value={formData.specs.horsepower.toString()}
                                onChangeText={(text) => updateSpecs('horsepower', parseInt(text) || 0)}
                                onFocus={handleInputFocus}
                            />
                        </Input>
                    </VStack>
                    <VStack gap="$2" flex={1}>
                        <Text color={BrandColors.lightGray} fontSize="$sm">
                            Torque (Nm)
                        </Text>
                        <Input bg={BrandColors.mediumGray} borderRadius="$md">
                            <InputField
                                placeholder="Ex: 350"
                                placeholderTextColor={BrandColors.placeholderGray}
                                color={BrandColors.white}
                                keyboardType="numeric"
                                value={formData.specs.torque.toString()}
                                onChangeText={(text) => updateSpecs('torque', parseInt(text) || 0)}
                                onFocus={handleInputFocus}
                            />
                        </Input>
                    </VStack>
                </HStack>

                <VStack gap="$2">
                    <Text color={BrandColors.lightGray} fontSize="$sm">
                        Transmissão
                    </Text>
                    <SimpleSelect
                        placeholder="Selecione a transmissão"
                        options={TRANSMISSION_OPTIONS}
                        value={formData.specs.transmission}
                        onChange={(value) => updateSpecs('transmission', value)}
                    />
                </VStack>

                <VStack gap="$2">
                    <Text color={BrandColors.lightGray} fontSize="$sm">
                        Tração
                    </Text>
                    <SimpleSelect
                        placeholder="Selecione a tração"
                        options={DRIVETRAIN_OPTIONS}
                        value={formData.specs.drivetrain}
                        onChange={(value) => updateSpecs('drivetrain', value)}
                    />
                </VStack>

                <VStack gap="$2">
                    <Text color={BrandColors.lightGray} fontSize="$sm">
                        Combustível
                    </Text>
                    <SimpleSelect
                        placeholder="Selecione o combustível"
                        options={FUEL_TYPE_OPTIONS}
                        value={formData.specs.fuelType}
                        onChange={(value) => updateSpecs('fuelType', value)}
                    />
                </VStack>

                <VStack gap="$2">
                    <Text color={BrandColors.lightGray} fontSize="$sm">
                        Lista de Modificações
                    </Text>
                    {formData.modsList.length > 0 && (
                        <VStack gap="$2">
                            {formData.modsList.map((mod, index) => (
                                <HStack key={index} gap="$2" alignItems="center">
                                    <Input bg={BrandColors.mediumGray} borderRadius="$md" flex={1}>
                                        <InputField
                                            placeholder="Ex: Escape esportivo, Suspensão rebaixada..."
                                            placeholderTextColor={BrandColors.placeholderGray}
                                            color={BrandColors.white}
                                            value={mod}
                                            onChangeText={(text) => updateModification(index, text)}
                                            onFocus={handleInputFocus}
                                        />
                                    </Input>
                                    <Pressable
                                        onPress={() => removeModification(index)}
                                        style={({ pressed }) => [
                                            styles.removeButton,
                                            pressed && styles.removeButtonPressed,
                                        ]}
                                    >
                                        <Ionicons name="close-circle" size={24} color={BrandColors.lightGray} />
                                    </Pressable>
                                </HStack>
                            ))}
                        </VStack>
                    )}
                    <Pressable
                        onPress={addModification}
                        style={({ pressed }) => [
                            styles.addModButton,
                            pressed && styles.addModButtonPressed,
                        ]}
                    >
                        <HStack alignItems="center" gap="$2">
                            <Ionicons name="add" size={20} color={BrandColors.orange} />
                            <Text color={BrandColors.orange} fontSize="$sm" fontWeight="$semibold">
                                Modificação
                            </Text>
                        </HStack>
                    </Pressable>
                </VStack>
            </VStack>
        </VStack>
    );

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
                                onPress={handleHeaderBack}
                                style={({ pressed }) => [
                                    styles.backButton,
                                    pressed && styles.backButtonPressed,
                                ]}
                            >
                                <Ionicons name="arrow-back" size={24} color={BrandColors.white} />
                            </Pressable>
                            <Text color={BrandColors.white} fontSize="$xl" fontWeight="$bold" flex={1} textAlign="center">
                                Adicionar novo carro
                            </Text>
                            <Box w={40} />
                        </HStack>
                    </Box>

                    {/* Step Indicator */}
                    <Box px="$6" pt="$4">
                        {renderStepIndicator()}
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
                        <Box px="$6" pb="$4">
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                        </Box>
                    </ScrollView>

                    {/* Footer Buttons */}
                    <SafeAreaView edges={['bottom']} style={styles.footerSafeArea}>
                        <Box
                            px="$6"
                            py="$4"
                            borderTopWidth={1}
                            borderTopColor="rgba(255,255,255,0.1)"
                            bg={BrandColors.darkGray}
                        >
                            <HStack gap="$3" justifyContent="space-between">
                                {currentStep !== 1 && (
                                    <Button
                                        variant="outline"
                                        borderColor={BrandColors.lightGray}
                                        borderRadius="$full"
                                        onPress={handleBack}
                                        flex={1}
                                    >
                                        <ButtonText color={BrandColors.lightGray}>
                                            Voltar
                                        </ButtonText>
                                    </Button>
                                )}
                                {currentStep < 3 ? (
                                    <Button
                                        bg={BrandColors.orange}
                                        borderRadius="$full"
                                        onPress={handleNext}
                                        flex={1}
                                        isDisabled={currentStep === 1 && !canProceedStep1}
                                    >
                                        <ButtonText color={BrandColors.white} fontWeight="$semibold">
                                            Próximo
                                        </ButtonText>
                                    </Button>
                                ) : (
                                    <Button
                                        bg={BrandColors.orange}
                                        borderRadius="$full"
                                        onPress={handleSubmit}
                                        flex={1}
                                        isDisabled={!canSubmit || submitting}
                                    >
                                        {submitting ? (
                                            <ActivityIndicator size="small" color={BrandColors.white} />
                                        ) : (
                                            <ButtonText color={BrandColors.white} fontWeight="$semibold">
                                                Adicionar
                                            </ButtonText>
                                        )}
                                    </Button>
                                )}
                            </HStack>
                        </Box>
                    </SafeAreaView>
                </Box>
            </KeyboardAvoidingView>

            {/* Confirmation Dialog */}
            <Modal isOpen={showConfirmDialog} onClose={handleCancelExit} size="md">
                <ModalBackdrop />
                <ModalContent bg={BrandColors.darkGray} borderRadius="$3xl">
                    <ModalHeader>
                        <Text color={BrandColors.white} fontSize="$lg" fontWeight="$bold">
                            Descartar alterações?
                        </Text>
                        <ModalCloseButton>
                            <Ionicons name="close" size={20} color={BrandColors.white} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text color={BrandColors.lightGray} fontSize="$md">
                            Os dados preenchidos serão perdidos. Deseja continuar?
                        </Text>
                    </ModalBody>
                    <ModalFooter gap="$3">
                        <Button
                            variant="outline"
                            borderColor={BrandColors.lightGray}
                            borderRadius="$full"
                            onPress={handleCancelExit}
                            flex={1}
                        >
                            <ButtonText color={BrandColors.lightGray}>Cancelar</ButtonText>
                        </Button>
                        <Button
                            bg={BrandColors.orange}
                            borderRadius="$full"
                            onPress={handleConfirmExit}
                            flex={1}
                        >
                            <ButtonText color={BrandColors.white} fontWeight="$semibold">
                                Confirmar
                            </ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
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
    textArea: {
        minHeight: 100,
        paddingTop: 12,
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
    removeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    removeButtonPressed: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        opacity: 0.8,
    },
    addModButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: BrandColors.orange,
        backgroundColor: 'transparent',
    },
    addModButtonPressed: {
        backgroundColor: 'rgba(255,69,0,0.1)',
        opacity: 0.8,
    },
    footerSafeArea: {
        backgroundColor: BrandColors.darkGray,
    },
});

