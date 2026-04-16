import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSidebar } from '../../components/SidebarContext';
import { useTheme } from '../../components/ThemeContext';
import { financeiroService, Contracheque } from '../../api/financeiroService';

const PERSISTENCE_KEY = '@financeiro_selection';

export const InformesFinanceirosScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { openSidebar } = useSidebar();
  const { theme } = useTheme();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [paystubs, setPaystubs] = useState<Contracheque[]>([]);
  
  // Modais de Seleção
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);

  // Carregar estado persistido
  useEffect(() => {
    const loadSelection = async () => {
      try {
        const saved = await AsyncStorage.getItem(PERSISTENCE_KEY);
        if (saved) {
          const { year, month } = JSON.parse(saved);
          setSelectedYear(year);
          setSelectedMonth(month);
        }
      } catch (e) {
        console.error('Erro ao carregar seleção:', e);
      }
    };
    loadSelection();
  }, []);

  // Persistir estado ao mudar
  useEffect(() => {
    const saveSelection = async () => {
      try {
        await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify({
          year: selectedYear,
          month: selectedMonth
        }));
      } catch (e) {
        console.error('Erro ao salvar seleção:', e);
      }
    };
    saveSelection();
    fetchPaystubs();
  }, [selectedYear, selectedMonth]);

  const fetchPaystubs = async () => {
    try {
      setLoading(true);
      // Validação de período futuro
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      if (parseInt(selectedYear) > currentYear || (parseInt(selectedYear) === currentYear && parseInt(selectedMonth) > currentMonth)) {
        setPaystubs([]);
        return;
      }

      try {
        const data = await financeiroService.getContracheques(selectedYear, selectedMonth);
        setPaystubs(data);
      } catch (err) {
        // Fallback mock
        setPaystubs([
          {
            id: '1',
            titulo: 'Contracheque Mensal',
            data: `05/${selectedMonth}/${selectedYear}`,
            tamanho: '1.2 MB',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
          {
            id: '2',
            titulo: 'Adiantamento Quinzenal',
            data: `20/${selectedMonth}/${selectedYear}`,
            tamanho: '0.8 MB',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];
  const months = [
    { label: 'Janeiro', value: '01' }, { label: 'Fevereiro', value: '02' }, { label: 'Março', value: '03' },
    { label: 'Abril', value: '04' }, { label: 'Maio', value: '05' }, { label: 'Junho', value: '06' },
    { label: 'Julho', value: '07' }, { label: 'Agosto', value: '08' }, { label: 'Setembro', value: '09' },
    { label: 'Outubro', value: '10' }, { label: 'Novembro', value: '11' }, { label: 'Dezembro', value: '12' },
  ];

  const getMonthLabel = (value: string) => months.find(m => m.value === value)?.label || '';

  const SelectionModal = ({ visible, title, data, selectedValue, onSelect, onClose }: any) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.divider }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={theme.textHint} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.value || item}
            renderItem={({ item }) => {
              const label = item.label || item;
              const value = item.value || item;
              const isSelected = selectedValue === value;
              return (
                <TouchableOpacity 
                  style={[styles.modalOption, isSelected && { backgroundColor: theme.background }]}
                  onPress={() => {
                    onSelect(value);
                    onClose();
                  }}
                >
                  <Text style={[styles.modalOptionText, { color: theme.textPrimary }, isSelected && { color: theme.primary, fontWeight: '700' }]}>{label}</Text>
                  {isSelected && <MaterialCommunityIcons name="check" size={20} color={theme.primary} />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const handleDownload = async (paystub: Contracheque) => {
    try {
      setDownloadingId(paystub.id);
      const fileUri = `${FileSystem.documentDirectory}${paystub.titulo.replace(/\s+/g, '_')}.pdf`;
      const downloadUrl = paystub.url.startsWith('http') ? paystub.url : financeiroService.getDownloadUrl(paystub.id);
      const result = await FileSystem.downloadAsync(downloadUrl, fileUri);
      if (result && result.uri) {
        if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(result.uri);
        else Alert.alert('Sucesso', 'Arquivo baixado com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível baixar o arquivo.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top, backgroundColor: theme.surface, borderBottomColor: theme.divider }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.appBarTitle, { color: theme.textPrimary }]}>Informes Financeiros</Text>
        <TouchableOpacity style={styles.menuButton} onPress={openSidebar}>
          <MaterialCommunityIcons name="menu" size={26} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.filterSection, { backgroundColor: theme.surface, borderColor: theme.divider }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Filtro Temporal</Text>
          <View style={styles.dropdownRow}>
            <View style={styles.dropdownContainer}>
              <Text style={[styles.fieldLabel, { color: theme.textHint }]}>Ano</Text>
              <TouchableOpacity style={[styles.dropdownTrigger, { backgroundColor: theme.background, borderColor: theme.divider }]} onPress={() => setYearModalVisible(true)}>
                <Text style={[styles.dropdownValue, { color: theme.textPrimary }]}>{selectedYear}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color={theme.textHint} />
              </TouchableOpacity>
            </View>

            <View style={styles.dropdownContainer}>
              <Text style={[styles.fieldLabel, { color: theme.textHint }]}>Mês</Text>
              <TouchableOpacity style={[styles.dropdownTrigger, { backgroundColor: theme.background, borderColor: theme.divider }]} onPress={() => setMonthModalVisible(true)}>
                <Text style={[styles.dropdownValue, { color: theme.textPrimary }]}>{getMonthLabel(selectedMonth)}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color={theme.textHint} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.resultsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Documentos para {getMonthLabel(selectedMonth)}/{selectedYear}</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textHint }]}>Buscando arquivos...</Text>
            </View>
          ) : paystubs.length > 0 ? (
            paystubs.map(paystub => (
              <View key={paystub.id} style={[styles.paystubCard, { backgroundColor: theme.surface, borderColor: theme.divider }]}>
                <View style={[styles.paystubIcon, { backgroundColor: theme.moduleRed + '1A' }]}>
                  <MaterialCommunityIcons name="file-pdf-box" size={32} color={theme.moduleRed} />
                </View>
                <View style={styles.paystubInfo}>
                  <Text style={[styles.paystubTitle, { color: theme.textPrimary }]} numberOfLines={1}>{paystub.titulo}</Text>
                  <View style={styles.paystubMeta}>
                    <Text style={[styles.paystubSubtitle, { color: theme.textHint }]}>{paystub.data}</Text>
                    <View style={[styles.metaDivider, { backgroundColor: theme.divider }]} />
                    <Text style={[styles.paystubSubtitle, { color: theme.textHint }]}>{paystub.tamanho}</Text>
                    <View style={[styles.metaDivider, { backgroundColor: theme.divider }]} />
                    <Text style={[styles.paystubSubtitle, { color: theme.moduleRed, fontWeight: '700' }]}>PDF</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.downloadButton} 
                  onPress={() => handleDownload(paystub)}
                  disabled={downloadingId === paystub.id}
                >
                  {downloadingId === paystub.id ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                  ) : (
                    <MaterialCommunityIcons name="download-circle-outline" size={30} color={theme.primary} />
                  )}
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconContainer, { backgroundColor: theme.background }]}>
                <MaterialCommunityIcons name="file-search-outline" size={64} color={theme.textHint + '4D'} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Nenhum arquivo encontrado</Text>
              <Text style={[styles.emptyText, { color: theme.textHint }]}>
                Não existem informes financeiros disponíveis para o período de {getMonthLabel(selectedMonth)} de {selectedYear}.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <SelectionModal
        visible={yearModalVisible}
        title="Selecionar Ano"
        data={years}
        selectedValue={selectedYear}
        onSelect={setSelectedYear}
        onClose={() => setYearModalVisible(false)}
      />

      <SelectionModal
        visible={monthModalVisible}
        title="Selecionar Mês"
        data={months}
        selectedValue={selectedMonth}
        onSelect={setSelectedMonth}
        onClose={() => setMonthModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  menuButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 32,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 20,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 16,
  },
  dropdownContainer: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dropdownValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  resultsSection: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  paystubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  paystubIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paystubInfo: {
    flex: 1,
  },
  paystubTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  paystubMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paystubSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  downloadButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingHorizontal: 24,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
