import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { useAuthStore } from '../../auth/authStore';
import { useTheme } from '../../components/ThemeContext';
import { AppColors } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LOGO_ASPECT_RATIO = 904 / 343;

export const LoginScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const { theme, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading } = useAuthStore();
  const logoWidth = Math.min(width - 48, 320);
  const logoHeight = logoWidth / LOGO_ASPECT_RATIO;

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('E-mail Inválido', 'Por favor, insira um endereço de e-mail válido.');
      return;
    }

    // Validação de tamanho de senha (conforme schema do backend)
    if (password.length < 6) {
      Alert.alert('Senha Curta', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await login({ email: trimmedEmail, senha: password, rememberMe });
    } catch (error: any) {
      Alert.alert('Erro de Login', error.message || 'E-mail ou senha incorretos.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/logo_anexo.png')} 
            style={[styles.logo, { width: logoWidth, height: logoHeight }, isDark && { tintColor: '#fff' }]}
            resizeMode="contain"
          />
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Acesse sua conta para continuar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>E-mail</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.divider }]}>
              <View style={[styles.leadingIconContainer, { borderRightColor: theme.divider }]}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={22}
                  color={theme.primary}
                  style={styles.inputIcon}
                />
              </View>
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="seu@email.com"
                placeholderTextColor={theme.textHint}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Senha</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.divider }]}>
              <View style={[styles.leadingIconContainer, { borderRightColor: theme.divider }]}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={22}
                  color={theme.primary}
                  style={styles.inputIcon}
                />
              </View>
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="••••••••"
                placeholderTextColor={theme.textHint}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={[styles.trailingIconButton, { borderLeftColor: theme.divider }]}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setRememberMe(!rememberMe)}
            >
              <MaterialCommunityIcons 
                name={rememberMe ? "checkbox-marked" : "checkbox-blank-outline"} 
                size={24} 
                color={rememberMe ? theme.primary : theme.textSecondary} 
              />
              <Text style={[styles.checkboxLabel, { color: theme.textSecondary }]}>Manter conectado</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={[styles.forgotPassword, { color: theme.primary }]}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary }, isLoading ? styles.buttonDisabled : undefined]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.surface, borderColor: theme.primary }]}
            onPress={() => navigation.navigate('Denuncia')}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>DENUNCIA ANONIMA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginTop: 8,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.divider,
    borderRadius: 12,
    height: 52,
    overflow: 'hidden',
  },
  leadingIconContainer: {
    width: 42,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: AppColors.divider,
  },
  inputIcon: {
    marginTop: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: AppColors.textPrimary,
    paddingHorizontal: 12,
  },
  trailingIconButton: {
    width: 42,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: AppColors.divider,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  forgotPassword: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '500',
  },
  button: {
    backgroundColor: AppColors.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: AppColors.surface,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
