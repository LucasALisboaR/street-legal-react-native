import { Ionicons } from '@expo/vector-icons';
import { Box, Text, VStack } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Pressable, Text as RNText, ScrollView, StyleSheet } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { UserCar } from '@/services/user.service';

interface GarageTabProps {
  garage: UserCar[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH - 80; // 40px margin on each side + 24px padding
const CAROUSEL_ITEM_SPACING = 16;

// Imagens de drivetrain
const drivetrainImages = {
  FWD: require('@/assets/images/fwd.png'),
  RWD: require('@/assets/images/rwd.png'),
  AWD: require('@/assets/images/awd.png'),
};

// Função helper para obter a imagem do drivetrain
const getDrivetrainImage = (drivetrain: string) => {
  const upperDrivetrain = drivetrain.toUpperCase();
  return drivetrainImages[upperDrivetrain as keyof typeof drivetrainImages] || drivetrainImages.FWD;
};

export function GarageTab({ garage }: GarageTabProps) {
  // Mock de carros para desenvolvimento/teste
  const mockCars: UserCar[] = [
    {
      id: '1',
      brand: 'Nissan',
      model: 'Skyline GT-R R34',
      year: 1999,
      color: 'Red',
      nickname: 'Skyline',
      trim: 'GT-R R34',
      thumbnailUrl: 'https://img.freepik.com/psd-premium/carro-esporte-em-fundo-transparente-renderizacao-3d-ilustracao_494250-47862.jpg?semt=ais_hybrid&w=740&q=80',
      specs: {
        engine: 'V6',
        horsepower: 500,
        torque: 500,
        transmission: 'Manual',
        drivetrain: 'RWD',
        fuelType: 'Gasoline',
      },
      modsList: ['Mod 1', 'Mod 2', 'Mod 3'],
    },
    {
      id: '2',
      brand: 'Nissan',
      model: 'Skyline GT-R R34',
      year: 1999,
      color: 'Red',
      nickname: 'Skyline',
      trim: 'GT-R R34',
      thumbnailUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      specs: {
        engine: 'V6',
        horsepower: 500,
        torque: 500,
        transmission: 'Manual',
        drivetrain: 'AWD',
        fuelType: 'Gasoline',
      },
      modsList: ['Mod 1', 'Mod 2', 'Mod 3'],
    }
  ];

  garage = mockCars;
  const handleAddCar = () => {
    router.push('/create-car');
  };

  return (
    <Box mx="$6" mb="$4">
      <VStack gap="$2">
        {/* Carrossel de carros */}
        {garage.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
            snapToInterval={CAROUSEL_ITEM_WIDTH + CAROUSEL_ITEM_SPACING}
            decelerationRate="fast"
            snapToAlignment="start"
          >
            {garage.map((car, index) => (
              <Box
                key={car.id}
                style={[
                  styles.carouselItem,
                  index === garage.length - 1 && { marginRight: 0 },
                ]}
              >
                <Box 
                  position="relative" 
                  w="100%" 
                  h="100%"
                  borderRadius={24}
                  overflow="hidden"
                >
                  {/* Fundo do card */}
                  <Box position="absolute" w="100%" h="100%">
                    {/* Overlay escuro por completo na imagem de fundo */}
                    <Box 
                      position="absolute" 
                      w="100%" 
                      h="100%"
                      style={styles.darkOverlay}
                    />
                  </Box>

                  {/* Imagem do carro integrada com o fundo */}
                  <Box 
                    position="absolute" 
                    w="100%" 
                    h="100%"
                    alignItems="center"
                    justifyContent="flex-end"
                    style={styles.carContainer}
                  >
                    
                    <Image
                      source={{ uri: car.thumbnailUrl }}
                      style={styles.carImage}
                      resizeMode="contain"
                      accessibilityLabel={`${car.brand} ${car.model}`}
                    />
                  </Box>
                  
                  {/* Informações no topo */}
                  <Box 
                    position="absolute" 
                    top={0} 
                    left={0} 
                    right={0}
                    px="$4" 
                    pt="$4"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    {/* Topo esquerdo: Ano, Marca e Modelo */}
                    <VStack gap="$0">
                      
                      <RNText style={styles.brandText}>
                        {car.brand.toUpperCase()}
                      </RNText>
                      <RNText style={styles.modelText}>
                        {car.model.toUpperCase()}
                      </RNText>
                    </VStack>

                    {/* Topo direito: Boxes informativos */}
                    <VStack gap="$2" alignItems="flex-end">
                      <Box
                        px="$1"
                        borderRadius="$md"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        gap="$1"
                        style={styles.infoBox}
                      >
                        <Image
                          source={getDrivetrainImage(car.specs.drivetrain)}
                          style={{ width: 40, height: 40, marginTop: 5, marginLeft: -3}}
                          resizeMode="contain"
                          accessibilityLabel={`${car.specs.drivetrain.toUpperCase()}`}
                        />
                        <Text color={BrandColors.white} 
                        fontSize="$sm" 
                        fontWeight="$bold">
                          {car.specs.drivetrain.toUpperCase()}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              </Box>
            ))}
          </ScrollView>
        ) : (
          <Box
            p="$8"
            bg={BrandColors.mediumGray}
            borderRadius="$3xl"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: 200 }}
            w="100%"
          >
            <Ionicons name="car" size={64} color={BrandColors.lightGray} />
            <Text color={BrandColors.lightGray} fontSize="$md" mt="$4" textAlign="center">
              Nenhum carro na garagem
            </Text>
          </Box>
        )}

        {/* Botão Adicionar novo carro */}
        <Pressable
          onPress={handleAddCar}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
        >
          <Ionicons name="add" size={20} color={BrandColors.white} style={styles.addButtonIcon} />
          <RNText style={styles.addButtonText}>
            Adicionar novo carro
          </RNText>
        </Pressable>
      </VStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.orange,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  addButtonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: BrandColors.white,
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 16,
  },
  carouselContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH,
    height: 280,
    marginRight: CAROUSEL_ITEM_SPACING,
  },
  carContainer: {
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  carImage: {
    width: '115%',
    height: '75%',
    marginBottom: -10,
  },
  darkOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Filtro escuro por completo na imagem de fundo
  },
  infoBox: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  // Estilos de texto com fontes customizadas (Montserrat)
  yearText: {
    color: BrandColors.white,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular', // Fonte mais leve
  },
  brandText: {
    color: BrandColors.white,
    fontSize: 18,
    fontFamily: 'Montserrat-Bold', // Fonte média/pesada
  },
  modelText: {
    color: BrandColors.orange,
    fontSize: 20,
    fontFamily: 'Montserrat-ExtraBold', // Fonte mais pesada
  },
});
