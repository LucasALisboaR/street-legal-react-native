import { Ionicons } from '@expo/vector-icons';
import { Box, Text, VStack } from '@gluestack-ui/themed';
import React from 'react';

import { BrandColors } from '@/constants/theme';

export function BadgesTab() {
  return (
    <Box mx="$6" p="$8" bg={BrandColors.mediumGray} borderRadius="$3xl" alignItems="center" justifyContent="center" style={{ minHeight: 200 }}>
      <Ionicons name="trophy" size={64} color={BrandColors.lightGray} />
      <Text color={BrandColors.lightGray} fontSize="$md" mt="$4" textAlign="center">
        Suas badges aparecerão aqui
      </Text>
    </Box>
  );
}

