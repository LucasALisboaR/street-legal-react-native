import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

export type ProfileTabKey = 'garage' | 'teams' | 'badges';

const TAB_LABELS: Record<ProfileTabKey, string> = {
  garage: 'GARAGEM',
  teams: 'EQUIPES',
  badges: 'BADGES',
};

interface SegmentedTabsProps {
  activeTab: ProfileTabKey;
  onChange: (tab: ProfileTabKey) => void;
}

export function SegmentedTabs({ activeTab, onChange }: SegmentedTabsProps) {
  return (
    <View style={styles.container}>
      {(Object.keys(TAB_LABELS) as ProfileTabKey[]).map((tab) => {
        const isActive = tab === activeTab;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(tab)}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {TAB_LABELS[tab]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: BrandColors.mediumGray,
    borderRadius: 999,
    padding: 6,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: BrandColors.orange,
  },
  tabLabel: {
    color: BrandColors.lightGray,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  tabLabelActive: {
    color: BrandColors.white,
  },
});

