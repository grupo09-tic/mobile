import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const ResponderScreen = ({ route, navigation }: any) => {
  const { readonly } = route.params || {};
  const insets = useSafeAreaInsets();
  const [scaleValue, setScaleValue] = useState<number | null>(readonly ? 4 : null);
  const [checkboxes, setCheckboxes] = useState<Record<string, boolean>>({
    'Plano de Saúde': readonly ? true : false,
    'Vale Refeição / Alimentação': readonly ? true : false,
    'Gympass / Auxílio Academia': false,
    'Auxílio Home Office': false,
  });
  const [textValue, setTextValue] = useState(readonly ? 'A comunicação interna melhorou bastante, mas ainda há espaço para evolução.' : '');
  const [shortTextValue, setShortTextValue] = useState(readonly ? 'Curta resposta de exemplo.' : '');
  const [scale10Value, setScale10Value] = useState<number | null>(readonly ? 8 : null);
  const [emojiValue, setEmojiValue] = useState<number | null>(readonly ? 4 : null);
  const [starValue, setStarValue] = useState<number | null>(readonly ? 5 : null);
  const [modalVisible, setModalVisible] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  const toggleCheck = (key: string) => {
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    Alert.alert('Sucesso', 'Questionário enviado com sucesso!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const getPlatformIcon = () => {
    if (!urlInput) return null;
    if (urlInput.includes('youtube.com') || urlInput.includes('youtu.be')) {
      return <Text style={[styles.vmBadge, styles.badgeYt]}>▶ YouTube</Text>;
    }
    if (urlInput.includes('vimeo.com')) {
      return <Text style={[styles.vmBadge, styles.badgeVimeo]}>V Vimeo</Text>;
    }
    if (urlInput.includes('drive.google.com')) {
      return <Text style={[styles.vmBadge, styles.badgeDrive]}>▲ Google Drive</Text>;
    }
    return <Text style={[styles.vmBadge, styles.badgeGeneric]}>🌐 Link Genérico</Text>;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.gfHeader, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.gfBack} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={20} color="#1A73E8" />
        </TouchableOpacity>
        <Text style={styles.gfHeaderTitle} numberOfLines={1}>Pesquisa de Clima...</Text>
        {!readonly && (
          <TouchableOpacity style={styles.gfSubmitBtnSmall} onPress={handleSubmit}>
            <Text style={styles.gfSubmitBtnSmallText}>Enviar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.gfProgressBar}>
        <View style={[styles.gfProgressFill, { width: '20%' }]} />
      </View>
      <Text style={styles.gfProgressLabel}>Página 1 de 1</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.gfVideoTip} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
          <Text style={styles.gfVtIcon}>💡</Text>
          <Text style={styles.gfVtText}>Dúvidas? Assista ao vídeo tutorial</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#1A73E8" />
        </TouchableOpacity>

        <View style={styles.gfFormTitleCard}>
          <Text style={styles.gfFormTitle}>Pesquisa de Clima Organizacional</Text>
          <Text style={styles.gfFormDesc}>Sua opinião é fundamental para melhorarmos nosso ambiente de trabalho. Responda com sinceridade.</Text>
          <Text style={styles.gfRequiredNote}>* Indica uma pergunta obrigatória</Text>
        </View>

        {/* PERGUNTA DE ESCALA */}
        <View style={styles.gfBlock}>
          <Text style={styles.gfQLabel}>1. Como você avalia a comunicação interna da empresa? <Text style={styles.req}>*</Text></Text>
          <View style={styles.gfScaleLabels}>
            <Text style={styles.gfScaleLabelsText}>Muito ruim</Text>
            <Text style={styles.gfScaleLabelsText}>Excelente</Text>
          </View>
          <View style={styles.gfScaleOpts}>
            {[1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity 
                key={val} 
                style={styles.gfScaleBtn} 
                onPress={() => !readonly && setScaleValue(val)}
                activeOpacity={readonly ? 1 : 0.2}
              >
                <View style={[styles.gfScaleDot, scaleValue === val && styles.gfScaleDotSel]}>
                  {scaleValue === val && <View style={styles.gfScaleDotInner} />}
                </View>
                <Text style={styles.gfScaleNum}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* PERGUNTA MULTIPLA ESCOLHA */}
        <View style={styles.gfBlock}>
          <Text style={styles.gfQLabel}>2. Quais benefícios você considera mais importantes? (Múltipla escolha)</Text>
          <View style={styles.gfOptions}>
            {Object.keys(checkboxes).map((key) => (
              <TouchableOpacity 
                key={key} 
                style={styles.gfCheckboxOpt} 
                onPress={() => !readonly && toggleCheck(key)} 
                activeOpacity={readonly ? 1 : 0.8}
              >
                <View style={[styles.gfCbBox, checkboxes[key] && styles.gfCbBoxChecked]}>
                  {checkboxes[key] && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
                </View>
                <Text style={styles.gfCbText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* PERGUNTA TEXTO */}
        <View style={styles.gfBlock}>
          <Text style={styles.gfQLabel}>3. Deixe um comentário ou sugestão de melhoria (Parágrafo):</Text>
          <TextInput
            style={[styles.gfTextarea, readonly && { color: '#5F6368', backgroundColor: '#f8f9fa' }]}
            placeholder="Sua resposta..."
            placeholderTextColor="#9AA0A6"
            multiline
            numberOfLines={4}
            value={textValue}
            onChangeText={setTextValue}
            textAlignVertical="top"
            editable={!readonly}
          />
        </View>

        {/* PERGUNTA TEXTO CURTO */}
        <View style={styles.gfBlock}>
          <Text style={styles.gfQLabel}>4. Resposta Curta (ex: Qual seu departamento?):</Text>
          <TextInput
            style={[styles.gfInput, readonly && { color: '#5F6368', backgroundColor: '#f8f9fa' }]}
            placeholder="Sua resposta curta..."
            placeholderTextColor="#9AA0A6"
            value={shortTextValue}
            onChangeText={setShortTextValue}
            editable={!readonly}
          />
        </View>

        {/* UPLOAD DE ARQUIVO */}
        <View style={styles.gfBlock}>
          <Text style={styles.gfQLabel}>5. Anexar documento (Upload):</Text>
          <TouchableOpacity style={styles.gfUploadBtn} disabled={readonly}>
            <MaterialCommunityIcons name="cloud-upload-outline" size={20} color={readonly ? '#9AA0A6' : '#1A73E8'} />
            <Text style={[styles.gfUploadBtnText, readonly && { color: '#9AA0A6' }]}>Adicionar arquivo</Text>
          </TouchableOpacity>
        </View>

        {/* ESCALA 0 A 10 */}
        <View style={styles.gfBlock}>
          <Text style={styles.gfQLabel}>6. De 0 a 10, o quanto você recomendaria a empresa? (NPS)</Text>
          <View style={styles.gfScaleLabels}>
            <Text style={styles.gfScaleLabelsText}>0 - Não recomendaria</Text>
            <Text style={styles.gfScaleLabelsText}>10 - Com certeza</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gfScale10Opts}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <TouchableOpacity 
                key={val} 
                style={styles.gfScale10Btn} 
                onPress={() => !readonly && setScale10Value(val)}
                activeOpacity={readonly ? 1 : 0.2}
              >
                <View style={[styles.gfScaleDot, scale10Value === val && styles.gfScaleDotSel]}>
                  {scale10Value === val && <View style={styles.gfScaleDotInner} />}
                </View>
                <Text style={styles.gfScaleNum}>{val}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* EMOJI DE SENTIMENTO */}
        <View style={styles.gfBlock}>
          <Text style={styles.gfQLabel}>7. Como você está se sentindo hoje?</Text>
          <View style={styles.gfEmojiOpts}>
            {[
              { id: 1, icon: 'emoticon-cry-outline', color: '#EA4335' },
              { id: 2, icon: 'emoticon-sad-outline', color: '#FBBC05' },
              { id: 3, icon: 'emoticon-neutral-outline', color: '#FABB05' },
              { id: 4, icon: 'emoticon-happy-outline', color: '#34A853' },
              { id: 5, icon: 'emoticon-excited-outline', color: '#1A73E8' },
            ].map((emoji) => (
              <TouchableOpacity
                key={emoji.id}
                style={[styles.gfEmojiBtn, emojiValue === emoji.id && styles.gfEmojiBtnSel]}
                onPress={() => !readonly && setEmojiValue(emoji.id)}
                disabled={readonly}
              >
                <MaterialCommunityIcons 
                  name={emoji.icon as any} 
                  size={32} 
                  color={emojiValue === emoji.id ? emoji.color : '#BDC1C6'} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CLASSIFICAÇÃO DE ESTRELAS */}
        <View style={styles.gfBlock}>
          <Text style={styles.gfQLabel}>8. Avalie o treinamento recente:</Text>
          <View style={styles.gfStarOpts}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.gfStarBtn}
                onPress={() => !readonly && setStarValue(star)}
                disabled={readonly}
              >
                <MaterialCommunityIcons 
                  name={starValue && starValue >= star ? 'star' : 'star-outline'} 
                  size={36} 
                  color={starValue && starValue >= star ? '#FBBC05' : '#BDC1C6'} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {!readonly && (
          <View style={styles.gfNav}>
            <View style={{ width: 60 }} />
            <TouchableOpacity style={styles.gfSubmitBtn} onPress={handleSubmit}>
              <Text style={styles.gfSubmitBtnText}>Enviar Respostas</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.gfSectionLabel}>Nunca envie senhas pelo Google Forms.</Text>
      </ScrollView>

      {/* Video Modal (Reused) */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.videoModal}>
            <View style={styles.vmTop}>
              <Text style={styles.vmTitle}>🎬 Vídeo explicativo</Text>
              <TouchableOpacity style={styles.vmClose} onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.vmUrlSection}>
              <Text style={styles.vmUrlLabel}>🔗 Cole a URL do vídeo abaixo</Text>
              <View style={styles.vmUrlRow}>
                <TextInput
                  style={styles.vmUrlInput}
                  placeholder="https://youtube.com/watch?v=..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={urlInput}
                  onChangeText={setUrlInput}
                  keyboardType="url"
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.vmOpenBtn} onPress={() => {
                  if (urlInput.trim()) {
                    setSavedUrl(urlInput.trim());
                    setUrlInput('');
                  }
                }}>
                  <Text style={styles.vmOpenBtnText}>Abrir</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.vmPlatform}>
                {getPlatformIcon()}
              </View>
            </View>

            {savedUrl ? (
              <>
                <View style={styles.vmSavedChip}>
                  <Text style={styles.vmChipIcon}>🔗</Text>
                  <View style={styles.vmChipInfo}>
                    <Text style={styles.vmChipLbl}>Vídeo salvo</Text>
                    <Text style={styles.vmChipUrl} numberOfLines={1}>{savedUrl}</Text>
                  </View>
                  <TouchableOpacity style={styles.vmChipOpen} onPress={() => Linking.openURL(savedUrl)}>
                    <Text style={styles.vmChipOpenText}>Assistir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSavedUrl(null)} style={{ padding: 4 }}>
                    <MaterialCommunityIcons name="close" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.vmEmpty}>
                <Text style={styles.vmEmptyIcon}>👀</Text>
                <Text style={styles.vmEmptyTitle}>Nenhum vídeo carregado</Text>
                <Text style={styles.vmEmptySub}>Cole o link do YouTube, Vimeo ou Drive acima para acessar o tutorial de preenchimento.</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EBF8',
  },
  gfHeader: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  gfBack: {
    width: 34,
    height: 34,
    backgroundColor: '#EAF1FF', // Alterado para combinar com azul
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gfHeaderTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 12,
  },
  gfSubmitBtnSmall: {
    backgroundColor: '#1A73E8', // AppColors.primary
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  gfSubmitBtnSmallText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  gfProgressBar: {
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 2,
    backgroundColor: '#E8EAED',
    borderRadius: 4,
    height: 4,
  },
  gfProgressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#1A73E8', // AppColors.primary
  },
  gfProgressLabel: {
    fontSize: 10,
    color: '#5F6368',
    textAlign: 'right',
    marginHorizontal: 12,
    marginBottom: 6,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  gfVideoTip: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: '#E8F0FE',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C5D8FD',
  },
  gfVtIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  gfVtText: {
    flex: 1,
    fontSize: 12,
    color: '#1A73E8',
    fontWeight: '500',
  },
  gfFormTitleCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderTopWidth: 7,
    borderTopColor: '#1A73E8', // AppColors.primary
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  gfFormTitle: {
    fontSize: 20,
    color: '#202124',
    marginBottom: 6,
  },
  gfFormDesc: {
    fontSize: 13,
    color: '#5F6368',
    lineHeight: 20,
  },
  gfRequiredNote: {
    fontSize: 12,
    color: '#D93025',
    marginTop: 10,
  },
  gfBlock: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  gfQLabel: {
    fontSize: 14,
    color: '#202124',
    lineHeight: 21,
    marginBottom: 14,
  },
  req: {
    color: '#D93025',
  },
  gfScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gfScaleLabelsText: {
    fontSize: 11,
    color: '#5F6368',
  },
  gfScaleOpts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gfScaleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  gfScaleDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#9E9E9E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  gfScaleDotSel: {
    borderColor: '#1A73E8', // AppColors.primary
  },
  gfScaleDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1A73E8', // AppColors.primary
  },
  gfScaleNum: {
    fontSize: 12,
    color: '#5F6368',
  },
  gfOptions: {
    flexDirection: 'column',
  },
  gfCheckboxOpt: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  gfCbBox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#757575',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gfCbBoxChecked: {
    backgroundColor: '#1A73E8', // AppColors.primary
    borderColor: '#1A73E8', // AppColors.primary
  },
  gfCbText: {
    fontSize: 14,
    color: '#202124',
  },
  gfTextarea: {
    width: '100%',
    minHeight: 72,
    borderBottomWidth: 1,
    borderBottomColor: '#DADCE0',
    paddingVertical: 4,
    fontSize: 14,
    color: '#202124',
  },
  gfInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#DADCE0',
    paddingVertical: 4,
    fontSize: 14,
    color: '#202124',
  },
  gfUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  gfUploadBtnText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '500',
  },
  gfScale10Opts: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  gfScale10Btn: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  gfEmojiOpts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  gfEmojiBtn: {
    padding: 8,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
  },
  gfEmojiBtnSel: {
    backgroundColor: '#E8F0FE',
  },
  gfStarOpts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  gfStarBtn: {
    padding: 4,
  },
  gfNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    paddingVertical: 4,
  },
  gfSubmitBtn: {
    backgroundColor: '#1A73E8', // AppColors.primary
    borderRadius: 4,
    paddingVertical: 11,
    paddingHorizontal: 28,
    shadowColor: '#1A73E8', // AppColors.primary
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  gfSubmitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  gfSectionLabel: {
    fontSize: 11,
    color: '#5F6368',
    textAlign: 'center',
    paddingVertical: 8,
  },
  
  // Modal Reused Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
    padding: 20,
  },
  videoModal: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    overflow: 'hidden',
  },
  vmTop: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  vmTitle: { fontSize: 15, fontWeight: '600', color: '#fff' },
  vmClose: {
    width: 30, height: 30, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15, justifyContent: 'center', alignItems: 'center',
  },
  vmUrlSection: {
    padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  vmUrlLabel: { fontSize: 11, fontWeight: '600', color: '#9AA0A6', marginBottom: 10 },
  vmUrlRow: { flexDirection: 'row', alignItems: 'center' },
  vmUrlInput: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 13,
    height: 42, fontSize: 13, color: '#fff', marginRight: 8,
  },
  vmOpenBtn: {
    backgroundColor: '#1A73E8', height: 42, paddingHorizontal: 16,
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  vmOpenBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  vmPlatform: { marginTop: 8, minHeight: 20 },
  vmBadge: {
    fontSize: 11, fontWeight: '500', paddingHorizontal: 9, paddingVertical: 3,
    borderRadius: 999, overflow: 'hidden', alignSelf: 'flex-start',
  },
  badgeYt: { backgroundColor: 'rgba(234,67,53,0.2)', color: '#EA4335' },
  badgeVimeo: { backgroundColor: 'rgba(26,183,234,0.2)', color: '#1AB7EA' },
  badgeDrive: { backgroundColor: 'rgba(66,133,244,0.2)', color: '#4285F4' },
  badgeGeneric: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#ccc' },
  vmSavedChip: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 10, marginBottom: 16,
    backgroundColor: 'rgba(26,115,232,0.15)', borderWidth: 1, borderColor: 'rgba(26,115,232,0.3)',
    borderRadius: 10, padding: 10,
  },
  vmChipIcon: { fontSize: 18, marginRight: 10 },
  vmChipInfo: { flex: 1, marginRight: 10 },
  vmChipLbl: { fontSize: 10, color: '#9AA0A6', marginBottom: 2 },
  vmChipUrl: { fontSize: 12, color: '#4285F4' },
  vmChipOpen: {
    backgroundColor: '#1A73E8', borderRadius: 7, paddingHorizontal: 13, paddingVertical: 6, marginRight: 8,
  },
  vmChipOpenText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  vmEmpty: { padding: 24, alignItems: 'center' },
  vmEmptyIcon: { fontSize: 38, opacity: 0.45, marginBottom: 10 },
  vmEmptyTitle: { fontSize: 14, color: '#e0e0e0', fontWeight: '500', marginBottom: 6 },
  vmEmptySub: { fontSize: 12, color: '#666', textAlign: 'center', lineHeight: 18 },
});
