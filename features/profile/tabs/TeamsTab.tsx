import { Ionicons } from '@expo/vector-icons';
import { Box, Text, VStack } from '@gluestack-ui/themed';
import React from 'react';

import { BrandColors } from '@/constants/theme';

export function TeamsTab() {
  return (
    <Box mx="$6" p="$8" bg={BrandColors.mediumGray} borderRadius="$3xl" alignItems="center" justifyContent="center" style={{ minHeight: 200 }}>
      <Ionicons name="people" size={64} color={BrandColors.lightGray} />
      <Text color={BrandColors.lightGray} fontSize="$md" mt="$4" textAlign="center">
        Suas equipes aparecerão aqui
      </Text>
    </Box>
  );
}

