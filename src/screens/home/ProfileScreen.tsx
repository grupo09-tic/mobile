import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../auth/authStore';
import { AppColors } from '../../constants/theme';

export const ProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user, logout, updatePassword } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);

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

  return (
    <View style={styles.container}>
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Meu Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <MaterialCommunityIcons name="account" size={40} color={AppColors.primary} />
            )}
          </View>
          <Text style={styles.userName}>{user?.nome || '—'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.perfilUsuario?.nome || 'Usuário'}</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <InfoRow icon="email-outline" label="E-mail" value={user?.email || '—'} />
          <View style={styles.divider} />
          <InfoRow icon="shield-check-outline" label="Perfil" value={user?.perfilUsuario?.nome || '—'} />
          <View style={styles.divider} />
          <InfoRow 
            icon="circle-medium" 
            label="Status" 
            value={user?.ativo ? 'Ativo' : 'Inativo'} 
            valueColor={user?.ativo ? AppColors.success : AppColors.error}
          />
        </View>

        {/* Actions Card */}
        <View style={styles.card}>
          <ActionRow 
            icon="lock-reset" 
            label="Alterar Senha" 
            onTap={() => setModalVisible(true)} 
          />
          <View style={styles.divider} />
          <ActionRow 
            icon="logout" 
            label="Sair" 
            color={AppColors.error} 
            onTap={handleLogout} 
          />
        </View>
      </ScrollView>

      <ChangePasswordModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        onSave={updatePassword}
      />
    </View>
  );
};

const InfoRow = ({ icon, label, value, valueColor }: any) => (
  <View style={styles.row}>
    <MaterialCommunityIcons name={icon} size={20} color={AppColors.textSecondary} />
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={[styles.rowValue, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
  </View>
);

const ActionRow = ({ icon, label, onTap, color }: any) => (
  <TouchableOpacity style={styles.row} onPress={onTap}>
    <MaterialCommunityIcons name={icon} size={20} color={color || AppColors.textSecondary} />
    <Text style={[styles.rowLabel, color ? { color, fontWeight: '500' } : undefined]}>{label}</Text>
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
  appBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginLeft: 16,
  },
  scrollContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 13,
    color: '#4338CA',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  rowLabel: {
    fontSize: 15,
    color: AppColors.textSecondary,
    marginLeft: 16,
    flex: 1,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 52,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: AppColors.textPrimary,
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
