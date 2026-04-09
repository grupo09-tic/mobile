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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../auth/authStore';
import { AppColors } from '../../constants/theme';

export const ProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user, logout, updatePassword, isLoading } = useAuthStore();
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Meu Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <MaterialCommunityIcons name="account" size={60} color={AppColors.primary} />
              )}
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <MaterialCommunityIcons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.nome || '—'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.cargo || user?.perfilUsuario?.nome || 'Colaborador'}</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados do Colaborador</Text>
          <InfoRow icon="card-account-details-outline" label="CPF" value={formatCPF(user?.cpf || null)} />
          <View style={styles.divider} />
          <InfoRow icon="office-building-outline" label="Departamento" value={user?.departamento || '—'} />
          <View style={styles.divider} />
          <InfoRow icon="briefcase-outline" label="Cargo" value={user?.cargo || '—'} />
          <View style={styles.divider} />
          <InfoRow icon="email-outline" label="E-mail Corporativo" value={user?.email || '—'} />
        </View>

        {/* Account Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configurações</Text>
          <ActionRow 
            icon="lock-reset" 
            label="Alterar Senha" 
            onTap={() => setModalVisible(true)} 
          />
          <View style={styles.divider} />
          <ActionRow 
            icon="logout" 
            label="Encerrar Sessão" 
            color={AppColors.error} 
            onTap={handleLogout} 
          />
        </View>

        <Text style={styles.versionText}>Versão 1.0.0 (Brisa)</Text>
      </ScrollView>

      <ChangePasswordModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        onSave={updatePassword}
      />
    </Animated.View>
  );
};

const InfoRow = ({ icon, label, value, valueColor }: any) => (
  <View style={styles.row}>
    <View style={styles.iconBox}>
      <MaterialCommunityIcons name={icon} size={22} color={AppColors.primary} />
    </View>
    <View style={styles.rowInfo}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
    </View>
  </View>
);

const ActionRow = ({ icon, label, onTap, color }: any) => (
  <TouchableOpacity style={styles.row} onPress={onTap}>
    <View style={[styles.iconBox, color ? { backgroundColor: color + '1A' } : undefined]}>
      <MaterialCommunityIcons name={icon} size={22} color={color || AppColors.textSecondary} />
    </View>
    <Text style={[styles.rowLabelAction, color ? { color, fontWeight: '600' } : undefined]}>{label}</Text>
    <MaterialCommunityIcons name="chevron-right" size={20} color={color ? color + '99' : AppColors.textHint} />
  </TouchableOpacity>
);

const ChangePasswordModal = ({ visible, onClose, onSave }: any) => {
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
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={AppColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Senha atual"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Nova senha"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar nova senha"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity 
              style={[styles.primaryButton, loading && { opacity: 0.7 }]} 
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
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: AppColors.primary + '20',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: AppColors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: AppColors.primary + '15',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.primary,
    textTransform: 'uppercase',
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
