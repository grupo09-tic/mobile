import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../auth/authStore';
import { AppColors, AppTheme } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 56) / 2; // Ajustado para 2 colunas com padding de 20px e gap de 16px

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const firstName = user?.nome?.split(' ')[0] || 'Usuário';

  const modules = [
    {
      id: 'questionarios',
      title: 'Questionários',
      subtitle: '2 itens',
      icon: 'clipboard-text-outline',
      color: AppColors.moduleBlue,
      route: 'Questionarios',
    },
    {
      id: 'avisos',
      title: 'Avisos',
      subtitle: '4 itens',
      icon: 'clipboard-text-outline',
      color: AppColors.modulePurple,
      route: 'Avisos',
    },
    {
      id: 'documentos',
      title: 'Documentos',
      subtitle: '0 itens',
      icon: 'file-document-outline',
      color: AppColors.moduleGreen,
      route: 'Documentos',
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
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require('../../../assets/logo_anexo.png')} 
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <View style={styles.greetingWrapper}>
              <Text style={styles.welcomeSubtitle}>Olá, bem-vindo! 👋</Text>
              <Text style={styles.userName}>{user?.nome || 'João Silva'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationWrapper}>
            <View style={styles.notificationBtn}>
              <MaterialCommunityIcons name="bell" size={26} color="#FFD700" />
              <View style={styles.notifBadge} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Featured Alert Card */}
        <TouchableOpacity style={styles.alertCard} activeOpacity={0.9}>
          <View style={styles.alertIconBg}>
            <MaterialCommunityIcons name="bullhorn" size={24} color="#fff" />
          </View>
          <View style={styles.alertInfo}>
            <Text style={styles.alertTag}>ÚLTIMO AVISO</Text>
            <Text style={styles.alertTitle} numberOfLines={2}>
              Reunião geral amanhã às 10h na sala de conferências
            </Text>
            <Text style={styles.alertTime}>Hoje, 08:30</Text>
          </View>
          <View style={styles.alertMegaphone}>
             <MaterialCommunityIcons name="bullhorn" size={60} color="rgba(255,255,255,0.1)" />
          </View>
        </TouchableOpacity>

        {/* Modules Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Módulos</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {/* Modules Grid */}
        <View style={styles.modulesGrid}>
          {modules.map((module, index) => (
            <TouchableOpacity
              key={module.id}
              style={styles.gridCard}
              onPress={() => navigation.navigate(module.route)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.moduleIconContainer, { backgroundColor: '#F3F4F6' }]}>
                  <MaterialCommunityIcons name={module.icon as any} size={28} color={module.color} />
                </View>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>{index + 2}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{module.title}</Text>
                <Text style={styles.cardSubtitle}>{module.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <MaterialCommunityIcons name="home-variant" size={28} color={AppColors.primary} />
          <Text style={[styles.navText, { color: AppColors.primary, fontWeight: '700' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Questionarios')}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={26} color={AppColors.textHint} />
          <Text style={styles.navText}>Questionários</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Avisos')}>
          <MaterialCommunityIcons name="bullhorn-outline" size={26} color={AppColors.textHint} />
          <Text style={styles.navText}>Avisos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Documentos')}>
          <MaterialCommunityIcons name="file-document-outline" size={26} color={AppColors.textHint} />
          <Text style={styles.navText}>Documentos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={async () => {
             await logout();
          }}
        >
          <MaterialCommunityIcons name="logout" size={26} color={AppColors.textHint} />
          <Text style={styles.navText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
    gap: 12,
  },
  brandLogo: {
    width: 240,
    height: 75,
    marginBottom: 8,
  },
  greetingWrapper: {
    gap: 2,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  notificationWrapper: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  notificationBtn: {
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.error,
    borderWidth: 2,
    borderColor: '#fff',
  },
  alertCard: {
    backgroundColor: '#4338CA', // Suavizado para Indigo (menos escuro que o slate anterior)
    borderRadius: 24,
    padding: 20,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    overflow: 'hidden',
  },
  alertIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  alertInfo: {
    flex: 1,
    zIndex: 2,
  },
  alertTag: {
    color: '#A5B4FC', // Indigo claro para melhor contraste no fundo Indigo
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  alertTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 8,
  },
  alertTime: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
  },
  alertMegaphone: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    transform: [{ rotate: '-15deg' }],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  seeAllLink: {
    color: AppColors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  gridCard: {
    width: COLUMN_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBadge: {
    backgroundColor: '#FA8072', // Vermelho salmão como na foto
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    height: 85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  navText: {
    fontSize: 10,
    color: AppColors.textHint,
    fontWeight: '600',
  },
});
