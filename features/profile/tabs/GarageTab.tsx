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

export function GarageTab({ garage }: GarageTabProps) {
  const handleAddCar = () => {
    router.push('/create-car');
  };

  return (
    <Box mx="$6" mb="$4">
      <VStack gap="$4">
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
                <Box position="relative" w="100%" alignItems="center" justifyContent="center">
                  <Image
                    source={{ uri: car.thumbnailUrl }}
                    style={styles.carImage}
                    resizeMode="cover"
                  />
                  {/* Nome do carro com efeito 3D */}
                  <Box
                    position="absolute"
                    bottom={-20}
                    px="$4"
                    py="$2"
                    bg="rgba(0, 0, 0, 0.7)"
                    borderRadius="$lg"
                    style={styles.carNameContainer}
                  >
                    <Text
                      color={BrandColors.white}
                      fontSize="$xl"
                      fontWeight="$bold"
                      style={styles.carName3D}
                    >
                      {car.fullName}
                    </Text>
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
    fontWeight: '600',
    fontSize: 16,
  },
  carouselContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH,
    marginRight: CAROUSEL_ITEM_SPACING,
  },
  carImage: {
    width: '100%',
    height: 280,
    borderRadius: 24,
  },
  carNameContainer: {
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 0, 0.3)',
  },
  carName3D: {
    textShadowColor: 'rgba(255, 69, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
