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
  useWindowDimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../auth/authStore';
import { useSidebar } from '../../components/SidebarContext';
import { useTheme } from '../../components/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { user, logout } = useAuthStore();
  const { openSidebar } = useSidebar();
  const { theme, isDark } = useTheme();

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        },
      ]
    );
  };
  const brandLogoWidth = Math.min(windowWidth - 114, 240);
  const brandLogoHeight = 44;

  const modules = [
    {
      id: 'questionarios',
      title: 'Questionários',
      subtitle: '2 pendentes',
      icon: 'clipboard-text-outline',
      color: theme.moduleBlue,
      route: 'Questionarios',
      badge: '2'
    },
    {
      id: 'avisos',
      title: 'Avisos',
      subtitle: '3 não lidos',
      icon: 'bullhorn-outline',
      color: theme.modulePurple,
      route: 'Avisos',
      badge: '3'
    },
    {
      id: 'documentos',
      title: 'Documentos',
      subtitle: 'Holerites, docs',
      icon: 'file-document-outline',
      color: theme.moduleGreen,
      route: 'Documentos',
    },
    {
      id: 'notificacoes',
      title: 'Notificações',
      subtitle: '5 novas',
      icon: 'bell-outline',
      color: theme.moduleOrange,
      route: 'Avisos',
      badge: '5'
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content" } />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoRow}>
              <TouchableOpacity onPress={openSidebar} style={styles.menuButton}>
                <MaterialCommunityIcons name="menu" size={28} color={theme.textPrimary} />
              </TouchableOpacity>
              <Image 
                source={require('../../../assets/logo_anexo.png')} 
                style={[styles.brandLogo, { width: brandLogoWidth, height: brandLogoHeight }, isDark && { tintColor: '#fff' }]}
                resizeMode="contain"
              />
            </View>
            <View style={styles.greetingWrapper}>
              <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>Olá, bem-vindo! 👋</Text>
              <Text style={[styles.userName, { color: theme.textPrimary }]}>{user?.nome || 'João Silva'}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.notificationBtn, { backgroundColor: theme.surface }]}>
            <MaterialCommunityIcons name="bell-badge" size={24} color={theme.warning} />
          </TouchableOpacity>
        </View>

        {/* Featured Card (Latest Announcement) */}
        <TouchableOpacity style={[styles.featuredCard, { backgroundColor: isDark ? theme.surface : theme.primary + 'E6' }]}>
          <View style={styles.featuredBadge}>
            <MaterialCommunityIcons name="bullhorn-variant" size={14} color="#fff" />
            <Text style={styles.featuredBadgeText}>ÚLTIMO AVISO</Text>
          </View>
          <Text style={styles.featuredTitle}>Reunião geral amanhã às 10h na sala de conferências</Text>
          <Text style={[styles.featuredDate, { color: isDark ? theme.textSecondary : 'rgba(255,255,255,0.7)' }]}>Hoje, 08:30</Text>
          <View style={styles.featuredIconBg}>
            <MaterialCommunityIcons name="bullhorn" size={80} color="rgba(255,255,255,0.1)" />
          </View>
        </TouchableOpacity>

        {/* Modules Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Módulos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ModuleList')}>
            <Text style={[styles.seeAllLink, { color: theme.primary }]}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modulesGrid}>
          {modules.map((module) => (
            <TouchableOpacity 
              key={module.id} 
              style={[styles.moduleCard, { backgroundColor: theme.surface }]}
              onPress={() => navigation.navigate(module.route)}
            >
              <View style={styles.moduleIconHeader}>
                <View style={[styles.moduleIconContainer, { backgroundColor: isDark ? theme.background : module.color + '15' }]}>
                  <MaterialCommunityIcons name={module.icon as any} size={28} color={module.color} />
                </View>
                {module.badge && (
                  <View style={[styles.moduleBadge, { backgroundColor: theme.error }]}>
                    <Text style={styles.moduleBadgeText}>{module.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.moduleTitle, { color: theme.textPrimary }]}>{module.title}</Text>
              <Text style={[styles.moduleSubtitle, { color: theme.textHint }]}>{module.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={[styles.bottomNav, { 
        backgroundColor: theme.surface, 
        paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
        borderTopColor: theme.divider,
        borderTopWidth: 1
      }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <MaterialCommunityIcons name="home-variant" size={28} color={theme.primary} />
          <Text style={[styles.navText, { color: theme.primary, fontWeight: '700' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Questionarios')}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={26} color={theme.textHint} />
          <Text style={[styles.navText, { color: theme.textHint }]}>Questionários</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Avisos')}>
          <MaterialCommunityIcons name="bullhorn-outline" size={26} color={theme.textHint} />
          <Text style={[styles.navText, { color: theme.textHint }]}>Avisos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <MaterialCommunityIcons name="account-outline" size={28} color={theme.textHint} />
          <Text style={[styles.navText, { color: theme.textHint }]}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={26} color={theme.error} />
          <Text style={[styles.navText, { color: theme.error }]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    padding: 4,
    marginLeft: -4,
  },
  brandLogo: {
    marginBottom: 0,
  },
  greetingWrapper: {
    gap: 2,
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 12,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 8,
    zIndex: 1,
  },
  featuredDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  featuredIconBg: {
    position: 'absolute',
    right: -10,
    bottom: -10,
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
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  moduleCard: {
    width: (width - 56) / 2,
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  moduleIconHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  moduleIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginTop: -4,
    marginRight: -4,
  },
  moduleBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  moduleSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
