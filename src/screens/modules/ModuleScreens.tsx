import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSidebar } from '../../components/SidebarContext';
import { useTheme } from '../../components/ThemeContext';
import { AppColors } from '../../constants/theme';
import * as ImagePicker from 'expo-image-picker';

interface ModuleScaffoldProps {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  items: Array<{ title: string; subtitle: string }>;
  emptyMessage?: string;
  onBack: () => void;
}

const ModuleScaffold = ({ title, icon, iconColor, items, emptyMessage, onBack }: ModuleScaffoldProps) => {
  const insets = useSafeAreaInsets();
  const { openSidebar } = useSidebar();
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top, backgroundColor: theme.surface, borderBottomColor: theme.divider }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => onBack ? onBack() : null}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.appBarTitle, { color: theme.textPrimary }]}>{title}</Text>
        <TouchableOpacity style={styles.menuButton} onPress={openSidebar}>
          <MaterialCommunityIcons name="menu" size={26} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.length > 0 ? (
          <View style={styles.list}>
            {items.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.divider }]}>
                <View style={[styles.cardIconContainer, { backgroundColor: iconColor + '1A' }]}>
                  <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                  <Text style={[styles.cardSubtitle, { color: theme.textHint }]}>{item.subtitle}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textHint} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="information-outline" size={48} color={theme.textHint} />
            <Text style={[styles.emptyText, { color: theme.textHint }]}>{emptyMessage || 'Nenhum item encontrado.'}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export const QuestionariosScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  return (
    <ModuleScaffold
      title="Questionários"
      icon="clipboard-text-outline"
      iconColor={theme.moduleBlue}
      items={[]}
      emptyMessage="Nenhum questionário pendente no momento."
      onBack={() => navigation.goBack()}
    />
  );
};

export const AvisosScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  return (
    <ModuleScaffold
      title="Avisos"
      icon="bullhorn-outline"
      iconColor={theme.modulePurple}
      items={[
        { title: 'Manutenção no Sistema', subtitle: 'Agendada para este sábado às 22h.' },
        { title: 'Novo Benefício', subtitle: 'Confira as novas parcerias do clube de descontos.' },
      ]}
      onBack={() => navigation.goBack()}
    />
  );
};

export const DocumentosScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  return (
    <ModuleScaffold
      title="Documentos"
      icon="file-document-outline"
      iconColor={theme.moduleGreen}
      items={[]}
      emptyMessage="Sua pasta de documentos está vazia."
      onBack={() => navigation.goBack()}
    />
  );
};

export const DenunciaScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { openSidebar } = useSidebar();
  const { theme } = useTheme();
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anexos, setAnexos] = useState<Array<{ uri: string; type: string; fileName: string }>>([]);
  const [modalAnexoVisible, setModalAnexoVisible] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const categorias = [
    'Ética e Conduta',
    'Assédio',
    'Segurança',
    'Infraestrutura',
    'Outros',
  ];

  const solicitarPermissoes = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissões Necessárias',
        'Para anexar arquivos ou usar a câmera, é necessário conceder permissões de acesso à câmera e galeria.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const capturarFoto = async () => {
    const permissoesOk = await solicitarPermissoes();
    if (!permissoesOk) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const novoAnexo = {
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
          fileName: `foto_${Date.now()}.jpg`,
        };
        adicionarAnexo(novoAnexo);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível capturar a foto. Tente novamente.');
    } finally {
      setModalAnexoVisible(false);
    }
  };

  const selecionarArquivo = async () => {
    const permissoesOk = await solicitarPermissoes();
    if (!permissoesOk) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const novoAnexo = {
          uri: asset.uri,
          type: asset.mimeType || 'application/octet-stream',
          fileName: `arquivo_${Date.now()}.${asset.mimeType?.split('/')[1] || 'bin'}`,
        };
        adicionarAnexo(novoAnexo);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo. Tente novamente.');
    } finally {
      setModalAnexoVisible(false);
    }
  };

  const adicionarAnexo = (anexo: any) => {
    if (!ALLOWED_TYPES.includes(anexo.type)) {
      Alert.alert('Tipo de Arquivo Inválido', 'Por favor, selecione apenas imagens (JPG/PNG/GIF) ou documentos (PDF/DOC/DOCX).');
      return;
    }

    if (anexos.length >= 5) {
      Alert.alert('Limite de Anexos', 'Você pode anexar no máximo 5 arquivos.');
      return;
    }

    setAnexos([...anexos, anexo]);
  };

  const removerAnexo = (index: number) => {
    const novosAnexos = [...anexos];
    novosAnexos.splice(index, 1);
    setAnexos(novosAnexos);
  };

  const handleEnviar = async () => {
    if (!categoria || !descricao.trim()) {
      Alert.alert('Erro', 'Por favor, selecione uma categoria e descreva a ocorrência.');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEnviado(true);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar sua denúncia. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top, backgroundColor: theme.surface, borderBottomColor: theme.divider }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.appBarTitle, { color: theme.textPrimary }]}>Denúncia Enviada</Text>
        </View>
        
        <View style={styles.center}>
          <View style={styles.successIconContainer}>
            <MaterialCommunityIcons name="check-circle" size={80} color={theme.success} />
          </View>
          <Text style={[styles.successTitle, { color: theme.textPrimary }]}>Recebemos seu relato!</Text>
          <Text style={[styles.successSubtitle, { color: theme.textSecondary }]}>
            Sua denúncia foi registrada de forma totalmente anônima e será analisada pelo nosso comitê de ética.
          </Text>
          <TouchableOpacity 
            style={[styles.primaryButton, { width: '80%', backgroundColor: theme.primary }]} 
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.primaryButtonText}>Voltar para o Início</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top, backgroundColor: theme.surface, borderBottomColor: theme.divider }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.appBarTitle, { color: theme.textPrimary }]}>Denúncia Anônima</Text>
        <TouchableOpacity style={styles.menuButton} onPress={openSidebar}>
          <MaterialCommunityIcons name="menu" size={26} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.infoBanner, { backgroundColor: theme.isDark ? theme.surface : '#EEF2FF', borderColor: theme.divider }]}>
          <MaterialCommunityIcons name="shield-check" size={24} color={theme.primary} />
          <Text style={[styles.infoText, { color: theme.isDark ? theme.textPrimary : '#4338CA' }]}>
            Este é um canal 100% seguro e anônimo. Suas informações não serão compartilhadas.
          </Text>
        </View>

        <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>Categoria da Denúncia</Text>
        <View style={styles.pickerContainer}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catOption,
                { backgroundColor: theme.surface, borderColor: theme.divider },
                categoria === cat && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
              onPress={() => setCategoria(cat)}
            >
              <Text style={[
                styles.catText,
                { color: theme.textSecondary },
                categoria === cat && { color: '#fff', fontWeight: '700' }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>Descrição da Ocorrência</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: theme.surface, borderColor: theme.divider, color: theme.textPrimary }]}
          placeholder="Descreva aqui o que aconteceu com o máximo de detalhes possível..."
          placeholderTextColor={theme.textHint}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={[styles.fieldLabel, { color: theme.textPrimary, marginTop: 20 }]}>Anexos (opcional)</Text>
        <TouchableOpacity 
          style={[styles.attachmentButton, { backgroundColor: theme.surface, borderColor: theme.divider }]} 
          onPress={() => setModalAnexoVisible(true)}
        >
          <MaterialCommunityIcons name="paperclip" size={24} color={theme.primary} />
          <Text style={[styles.attachmentText, { color: theme.textPrimary }]}>Adicionar Anexo</Text>
        </TouchableOpacity>

        {anexos.length > 0 && (
          <View style={styles.attachmentsList}>
            {anexos.map((anexo, index) => (
              <View key={index} style={[styles.attachmentItem, { backgroundColor: theme.surface, borderColor: theme.divider }]}>
                {anexo.type.startsWith('image/') ? (
                  <Image source={{ uri: anexo.uri }} style={styles.attachmentImage} />
                ) : (
                  <View style={[styles.attachmentIconContainer, { backgroundColor: theme.background }]}>
                    <MaterialCommunityIcons name="file-document" size={32} color={theme.primary} />
                  </View>
                )}
                <View style={styles.attachmentInfo}>
                  <Text style={[styles.attachmentName, { color: theme.textPrimary }]} numberOfLines={1}>
                    {anexo.fileName}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removerAnexo(index)}>
                  <MaterialCommunityIcons name="close-circle" size={24} color={theme.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: theme.primary }, loading && { opacity: 0.7 }]} 
          onPress={handleEnviar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>Enviar Denúncia</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalAnexoVisible} transparent animationType="fade" onRequestClose={() => setModalAnexoVisible(false)}>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalAnexoVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.divider }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Selecionar Anexo</Text>
              <TouchableOpacity onPress={() => setModalAnexoVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.textHint} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalOptions}>
              <TouchableOpacity style={styles.modalOption} onPress={capturarFoto}>
                <View style={[styles.modalOptionIcon, { backgroundColor: theme.primary + '1A' }]}>
                  <MaterialCommunityIcons name="camera" size={32} color={theme.primary} />
                </View>
                <Text style={[styles.modalOptionText, { color: theme.textPrimary }]}>Capturar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={selecionarArquivo}>
                <View style={[styles.modalOptionIcon, { backgroundColor: theme.moduleBlue + '1A' }]}>
                  <MaterialCommunityIcons name="folder" size={32} color={theme.moduleBlue} />
                </View>
                <Text style={[styles.modalOptionText, { color: theme.textPrimary }]}>Selecionar Arquivo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 2,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    flex: 1,
  },
  menuButton: {
    padding: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: AppColors.textSecondary,
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 60,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.success + '1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 15,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4338CA',
    marginLeft: 12,
    lineHeight: 20,
    fontWeight: '500',
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 10,
    marginLeft: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  catOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#fff',
  },
  catOptionActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  catText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  catTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    height: 150,
    marginBottom: 24,
    color: AppColors.textPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    height: 56,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  attachmentText: {
    fontSize: 16,
    fontWeight: '600',
  },
  attachmentsList: {
    gap: 12,
    marginBottom: 20,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  attachmentImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  attachmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalOptions: {
    padding: 24,
    gap: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  modalOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
