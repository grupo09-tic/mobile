import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../auth/authStore';
import { useSidebar } from '../../components/SidebarContext';
import { useTheme } from '../../components/ThemeContext';
import { AppColors } from '../../constants/theme';

export const ProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user, logout, updatePassword, isLoading } = useAuthStore();
  const { openSidebar } = useSidebar();
  const { theme, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const formatCPF = (cpf: string | null) => {
    if (!cpf) return '—';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return '—';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return '—';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header Section (Blue Background) */}
        <View style={[styles.headerSection, { paddingTop: insets.top + 20, backgroundColor: isDark ? theme.surface : theme.primary }]}>
          <TouchableOpacity 
            style={[styles.backButton, { top: insets.top + 10 }]} 
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="chevron-left" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuButtonHeader, { top: insets.top + 10 }]} 
            onPress={openSidebar}
          >
            <MaterialCommunityIcons name="menu" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarContainer, { borderColor: isDark ? theme.primary : 'rgba(255,255,255,0.4)' }]}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <MaterialCommunityIcons name="account" size={60} color="#fff" />
              )}
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <MaterialCommunityIcons name="pencil" size={16} color="#FF7F50" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.nome || 'João Silva'}</Text>
          <Text style={[styles.userRole, { color: isDark ? theme.textSecondary : 'rgba(255,255,255,0.85)' }]}>
            {user?.cargo || 'Analista de TI'} · {user?.departamento || 'Departamento de Tecnologia'}
          </Text>
        </View>

        {/* Main Content */}
        <View style={[styles.mainContent, { backgroundColor: theme.background }]}>
          {/* Info Card */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.divider }]}>
            <Text style={[styles.cardTitle, { color: theme.textHint }]}>Dados do Colaborador</Text>
            <InfoRow icon="card-account-details-outline" label="CPF" value={formatCPF(user?.cpf || null)} theme={theme} />
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <InfoRow icon="phone-outline" label="Telefone" value={formatPhone(user?.telefone || null)} theme={theme} />
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <InfoRow icon="calendar-check-outline" label="Data de Admissão" value={formatDate(user?.dataAdmissao || null)} theme={theme} />
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <InfoRow icon="email-outline" label="E-mail Corporativo" value={user?.email || '—'} theme={theme} />
          </View>

          {/* Account Settings */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.divider }]}>
            <Text style={[styles.cardTitle, { color: theme.textHint }]}>Configurações</Text>
            <ActionRow 
              icon="lock-reset" 
              label="Alterar Senha" 
              onTap={() => setModalVisible(true)} 
              theme={theme}
            />
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <ActionRow 
              icon="logout" 
              label="Encerrar Sessão" 
              color={theme.error} 
              onTap={handleLogout} 
              theme={theme}
            />
          </View>

          <Text style={[styles.versionText, { color: theme.textHint }]}>Versão 1.0.0 (Brisa)</Text>
        </View>
      </ScrollView>

      <ChangePasswordModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        onSave={updatePassword}
        theme={theme}
      />
    </Animated.View>
  );
};

const InfoRow = ({ icon, label, value, valueColor, theme }: any) => (
  <View style={styles.row}>
    <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
      <MaterialCommunityIcons name={icon} size={22} color={theme.primary} />
    </View>
    <View style={styles.rowInfo}>
      <Text style={[styles.rowLabel, { color: theme.textHint }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.textPrimary }, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
    </View>
  </View>
);

const ActionRow = ({ icon, label, onTap, color, theme }: any) => (
  <TouchableOpacity style={styles.row} onPress={onTap}>
    <View style={[styles.iconBox, { backgroundColor: color ? color + '1A' : theme.background }]}>
      <MaterialCommunityIcons name={icon} size={22} color={color || theme.textSecondary} />
    </View>
    <Text style={[styles.rowLabelAction, { color: theme.textPrimary }, color ? { color, fontWeight: '600' } : undefined]}>{label}</Text>
    <MaterialCommunityIcons name="chevron-right" size={20} color={color ? color + '99' : theme.textHint} />
  </TouchableOpacity>
);

const ChangePasswordModal = ({ visible, onClose, onSave, theme }: any) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem.');
      return;
    }

    setLoading(true);
    try {
      await onSave({ currentPassword, newPassword, confirmNewPassword: confirmPassword });
      Alert.alert('Sucesso', 'Senha alterada com sucesso.');
      onClose();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao alterar senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.modalContent, { backgroundColor: theme.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Alterar Senha</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, borderColor: theme.divider, color: theme.textPrimary }]}
              placeholder="Senha atual"
              placeholderTextColor={theme.textHint}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, borderColor: theme.divider, color: theme.textPrimary }]}
              placeholder="Nova senha"
              placeholderTextColor={theme.textHint}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, borderColor: theme.divider, color: theme.textPrimary }]}
              placeholder="Confirmar nova senha"
              placeholderTextColor={theme.textHint}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: theme.primary }, loading && { opacity: 0.7 }]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
  },
  headerSection: {
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    paddingBottom: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    padding: 8,
    zIndex: 10,
  },
  menuButtonHeader: {
    position: 'absolute',
    right: 10,
    padding: 8,
    zIndex: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  userRole: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  mainContent: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textHint,
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rowInfo: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: AppColors.textHint,
    marginBottom: 2,
  },
  rowLabelAction: {
    flex: 1,
    fontSize: 16,
    color: AppColors.textPrimary,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 58,
  },
  versionText: {
    textAlign: 'center',
    color: AppColors.textHint,
    fontSize: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
