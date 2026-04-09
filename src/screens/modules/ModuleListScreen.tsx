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
import { AppColors } from '../../constants/theme';

export const ModuleListScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  const allModules = [
    {
      id: 'questionarios',
      title: 'Questionários',
      subtitle: 'Responda pesquisas e avaliações',
      icon: 'clipboard-text-outline',
      color: AppColors.moduleBlue,
      route: 'Questionarios',
    },
    {
      id: 'avisos',
      title: 'Avisos',
      subtitle: 'Fique por dentro das novidades',
      icon: 'bullhorn-outline',
      color: AppColors.modulePurple,
      route: 'Avisos',
    },
    {
      id: 'documentos',
      title: 'Documentos',
      subtitle: 'Acesse seus arquivos importantes',
      icon: 'file-document-outline',
      color: AppColors.moduleGreen,
      route: 'Documentos',
    },
    {
      id: 'financeiro',
      title: 'Informes Financeiros',
      subtitle: 'Veja seus contracheques e informes',
      icon: 'finance',
      color: AppColors.primary,
      route: 'InformesFinanceiros',
    },
    {
      id: 'denuncia',
      title: 'Denúncia Anônima',
      subtitle: 'Relate ocorrências com segurança',
      icon: 'shield-outline',
      color: AppColors.moduleRed,
      route: 'Denuncia',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Todos os Módulos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {allModules.map((module) => (
          <TouchableOpacity
            key={module.id}
            style={styles.moduleCard}
            onPress={() => navigation.navigate(module.route)}
          >
            <View style={[styles.iconContainer, { backgroundColor: module.color + '1A' }]}>
              <MaterialCommunityIcons name={module.icon as any} size={28} color={module.color} />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={AppColors.textHint} />
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
