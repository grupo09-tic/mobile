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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '../../constants/theme';

export const QuestionariosScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

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

  const handleConfirmUrl = () => {
    if (urlInput.trim()) {
      setSavedUrl(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#1E6FE8" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Questionários</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Video Banner */}
        <TouchableOpacity style={styles.videoBanner} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
          <View style={styles.vbPlay}>
            <MaterialCommunityIcons name="play" size={20} color="#fff" />
          </View>
          <View style={styles.vbTextContainer}>
            <Text style={styles.vbTitle}>Como responder um questionário?</Text>
            <Text style={styles.vbSub}>Cole uma URL e assista ao vídeo explicativo</Text>
          </View>
        </TouchableOpacity>

        {/* Info Pill */}
        <View style={styles.infoPill}>
          <Text style={styles.infoPillText}>📋 2 questionários pendentes de resposta</Text>
        </View>

        <Text style={styles.sectionLbl}>PENDENTES</Text>

        {/* Pending Items */}
        <TouchableOpacity style={[styles.listItem, styles.pendingBorder]} onPress={() => navigation.navigate('Responder')}>
          <View style={[styles.listIconContainer, { backgroundColor: AppColors.moduleBlue + '1A' }]}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={AppColors.moduleBlue} />
          </View>
          <View style={styles.listInfo}>
            <Text style={styles.listName}>Pesquisa de Clima Organizacional</Text>
            <Text style={styles.listMeta}>Prazo: 31/03/2026 · 5 questões · ~3 min</Text>
          </View>
          <View style={[styles.listBadge, styles.badgePending]}>
            <Text style={styles.badgePendingText}>Pendente</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.listItem, styles.pendingBorder]} onPress={() => navigation.navigate('Responder')}>
          <View style={[styles.listIconContainer, { backgroundColor: AppColors.moduleBlue + '1A' }]}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={AppColors.moduleBlue} />
          </View>
          <View style={styles.listInfo}>
            <Text style={styles.listName}>Avaliação de Desempenho Q1</Text>
            <Text style={styles.listMeta}>Prazo: 05/04/2026 · 8 questões · ~5 min</Text>
          </View>
          <View style={[styles.listBadge, styles.badgePending]}>
            <Text style={styles.badgePendingText}>Pendente</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionLbl}>RESPONDIDOS</Text>

        {/* Done Items */}
        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Responder', { readonly: true })}>
          <View style={[styles.listIconContainer, { backgroundColor: AppColors.success + '1A' }]}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={24} color={AppColors.success} />
          </View>
          <View style={styles.listInfo}>
            <Text style={styles.listName}>Satisfação com Benefícios 2025</Text>
            <Text style={styles.listMeta}>Respondido em 10/01/2026</Text>
          </View>
          <View style={[styles.listBadge, styles.badgeDone]}>
            <Text style={styles.badgeDoneText}>Respondido</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Responder', { readonly: true })}>
          <View style={[styles.listIconContainer, { backgroundColor: AppColors.success + '1A' }]}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={24} color={AppColors.success} />
          </View>
          <View style={styles.listInfo}>
            <Text style={styles.listName}>NPS Interno — Dez/25</Text>
            <Text style={styles.listMeta}>Respondido em 22/12/2025</Text>
          </View>
          <View style={[styles.listBadge, styles.badgeDone]}>
            <Text style={styles.badgeDoneText}>Respondido</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Video Modal */}
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
                <TouchableOpacity style={styles.vmOpenBtn} onPress={handleConfirmUrl}>
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

                <View style={styles.vmChapters}>
                  <Text style={styles.vmChHeader}>Capítulos Sugeridos</Text>
                  <TouchableOpacity style={[styles.vmChItem, styles.vmChItemActive]}>
                    <View style={[styles.vmChNum, styles.vmChNumActive]}><Text style={styles.vmChNumTextActive}>1</Text></View>
                    <View style={styles.vmChInfo}>
                      <Text style={styles.vmChName}>Introdução ao formulário</Text>
                      <Text style={styles.vmChDur}>0:00 - 1:15</Text>
                    </View>
                    <MaterialCommunityIcons name="play" size={16} color="#555" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.vmChItem}>
                    <View style={styles.vmChNum}><Text style={styles.vmChNumText}>2</Text></View>
                    <View style={styles.vmChInfo}>
                      <Text style={styles.vmChName}>Como preencher escalas</Text>
                      <Text style={styles.vmChDur}>1:15 - 3:30</Text>
                    </View>
                    <MaterialCommunityIcons name="play" size={16} color="#555" />
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#EAF1FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  videoBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: '#1A73E8',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  vbPlay: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vbTextContainer: {
    flex: 1,
  },
  vbTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  vbSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  infoPill: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: '#EAF1FF',
    borderWidth: 1,
    borderColor: '#C2D8FF',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 13,
  },
  infoPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E6FE8',
  },
  sectionLbl: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9AA0A6',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  listItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EAED',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pendingBorder: {
    borderLeftWidth: 3,
    borderLeftColor: '#673AB7',
  },
  listIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  listName: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  listMeta: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  listBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    marginLeft: 8,
    marginTop: 2,
  },
  badgePending: {
    backgroundColor: '#FFF3E0',
  },
  badgePendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E65100',
  },
  badgeDone: {
    backgroundColor: '#E8F5E9',
  },
  badgeDoneText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1B5E20',
  },
  // Modal Styles
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.7,
    shadowRadius: 60,
    elevation: 10,
  },
  vmTop: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  vmTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  vmClose: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vmUrlSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  vmUrlLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9AA0A6',
    marginBottom: 10,
  },
  vmUrlRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vmUrlInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 13,
    height: 42,
    fontSize: 13,
    color: '#fff',
    marginRight: 8,
  },
  vmOpenBtn: {
    backgroundColor: '#1A73E8',
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vmOpenBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  vmPlatform: {
    marginTop: 8,
    minHeight: 20,
  },
  vmBadge: {
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  badgeYt: { backgroundColor: 'rgba(234,67,53,0.2)', color: '#EA4335' },
  badgeVimeo: { backgroundColor: 'rgba(26,183,234,0.2)', color: '#1AB7EA' },
  badgeDrive: { backgroundColor: 'rgba(66,133,244,0.2)', color: '#4285F4' },
  badgeGeneric: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#ccc' },
  
  vmSavedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: 'rgba(26,115,232,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(26,115,232,0.3)',
    borderRadius: 10,
    padding: 10,
  },
  vmChipIcon: { fontSize: 18, marginRight: 10 },
  vmChipInfo: { flex: 1, marginRight: 10 },
  vmChipLbl: { fontSize: 10, color: '#9AA0A6', marginBottom: 2 },
  vmChipUrl: { fontSize: 12, color: '#4285F4' },
  vmChipOpen: {
    backgroundColor: '#1A73E8',
    borderRadius: 7,
    paddingHorizontal: 13,
    paddingVertical: 6,
    marginRight: 8,
  },
  vmChipOpenText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  
  vmEmpty: {
    padding: 24,
    alignItems: 'center',
  },
  vmEmptyIcon: { fontSize: 38, opacity: 0.45, marginBottom: 10 },
  vmEmptyTitle: { fontSize: 14, color: '#e0e0e0', fontWeight: '500', marginBottom: 6 },
  vmEmptySub: { fontSize: 12, color: '#666', textAlign: 'center', lineHeight: 18 },
  
  vmChapters: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    marginTop: 10,
  },
  vmChHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777',
    marginBottom: 8,
  },
  vmChItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 2,
  },
  vmChItemActive: {
    backgroundColor: 'rgba(103,58,183,0.28)',
  },
  vmChNum: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  vmChNumActive: {
    backgroundColor: '#673AB7',
  },
  vmChNumText: { fontSize: 10, fontWeight: '700', color: '#bbb' },
  vmChNumTextActive: { fontSize: 10, fontWeight: '700', color: '#fff' },
  vmChInfo: { flex: 1 },
  vmChName: { fontSize: 12, color: '#e0e0e0', fontWeight: '500' },
  vmChDur: { fontSize: 10, color: '#777', marginTop: 1 },
});
