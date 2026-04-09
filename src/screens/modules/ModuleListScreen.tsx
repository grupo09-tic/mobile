import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeContext';
import { AppColors } from '../../constants/theme';
import { ALL_MODULES } from '../../constants/modules';

export const ModuleListScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const allModules = ALL_MODULES.filter(m => m.id !== 'home' && m.id !== 'profile');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top, backgroundColor: theme.surface, borderBottomColor: theme.divider }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.appBarTitle, { color: theme.textPrimary }]}>Todos os Módulos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {allModules.map((module) => (
          <TouchableOpacity
            key={module.id}
            style={[styles.moduleCard, { backgroundColor: theme.surface, borderColor: theme.divider }]}
            onPress={() => navigation.navigate(module.route)}
          >
            <View style={[styles.iconContainer, { backgroundColor: (theme as any)[module.colorName] + '1A' }]}>
              <MaterialCommunityIcons name={module.icon as any} size={28} color={(theme as any)[module.colorName]} />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={[styles.moduleTitle, { color: theme.textPrimary }]}>{module.title}</Text>
              <Text style={[styles.moduleSubtitle, { color: theme.textHint }]}>{module.subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textHint} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  appBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  scrollContent: {
    padding: 20,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  moduleSubtitle: {
    fontSize: 13,
    color: AppColors.textHint,
    marginTop: 2,
  },
});
