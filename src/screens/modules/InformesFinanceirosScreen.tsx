import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '../../constants/theme';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { financeiroService, Contracheque } from '../../api/financeiroService';

export const InformesFinanceirosScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [paystubs, setPaystubs] = useState<Contracheque[]>([]);

  useEffect(() => {
    fetchPaystubs();
  }, [selectedYear, selectedMonth]);

  const fetchPaystubs = async () => {
    try {
      setLoading(true);
      // Em uma implementação real, o backend retornaria os dados. 
      // Se falhar (ex: endpoint não existe ainda), mantemos o mock para demonstração.
      try {
        const data = await financeiroService.getContracheques(selectedYear, selectedMonth);
        setPaystubs(data);
      } catch (err) {
        console.warn('Backend offline ou erro na API, usando mock para demonstração');
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

  const handleDownload = async (paystub: Contracheque) => {
    try {
      setDownloadingId(paystub.id);
      
      const fileUri = `${FileSystem.documentDirectory}${paystub.titulo.replace(/\s+/g, '_')}_${paystub.data.replace(/\//g, '-')}.pdf`;
      
      // Se for produção, usaríamos a URL do backend
      const downloadUrl = paystub.url.startsWith('http') 
        ? paystub.url 
        : financeiroService.getDownloadUrl(paystub.id);

      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {}
      );

      const result = await downloadResumable.downloadAsync();
      
      if (result && result.uri) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result.uri);
        } else {
          Alert.alert('Sucesso', 'Arquivo baixado com sucesso!');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível baixar o arquivo.');
    } finally {
      setDownloadingId(null);
    }
  };

  const years = ['2026', '2025', '2024', '2023'];
  const months = [
    { label: 'Jan', value: '01' }, { label: 'Fev', value: '02' }, { label: 'Mar', value: '03' },
    { label: 'Abr', value: '04' }, { label: 'Mai', value: '05' }, { label: 'Jun', value: '06' },
    { label: 'Jul', value: '07' }, { label: 'Ago', value: '08' }, { label: 'Set', value: '09' },
    { label: 'Out', value: '10' }, { label: 'Nov', value: '11' }, { label: 'Dez', value: '12' },
  ];

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Informes Financeiros</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filters Section */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Selecione o período</Text>
          
          <Text style={styles.label}>Ano</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearSelector}>
            {years.map(year => (
              <TouchableOpacity
                key={year}
                style={[styles.yearOption, selectedYear === year && styles.activeOption]}
                onPress={() => setSelectedYear(year)}
              >
                <Text style={[styles.optionText, selectedYear === year && styles.activeOptionText]}>{year}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Mês</Text>
          <View style={styles.monthGrid}>
            {months.map(month => (
              <TouchableOpacity
                key={month.value}
                style={[styles.monthOption, selectedMonth === month.value && styles.activeOption]}
                onPress={() => setSelectedMonth(month.value)}
              >
                <Text style={[styles.optionText, selectedMonth === month.value && styles.activeOptionText]}>
                  {month.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Documentos Disponíveis</Text>
          {loading ? (
            <ActivityIndicator size="large" color={AppColors.primary} style={{ marginTop: 20 }} />
          ) : paystubs.length > 0 ? (
            paystubs.map(paystub => (
              <View key={paystub.id} style={styles.paystubCard}>
                <View style={styles.paystubIcon}>
                  <MaterialCommunityIcons name="file-pdf-box" size={32} color={AppColors.moduleRed} />
                </View>
                <View style={styles.paystubInfo}>
                  <Text style={styles.paystubTitle}>{paystub.titulo}</Text>
                  <Text style={styles.paystubSubtitle}>{paystub.data} • {paystub.tamanho}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.downloadButton} 
                  onPress={() => handleDownload(paystub)}
                  disabled={downloadingId === paystub.id}
                >
                  {downloadingId === paystub.id ? (
                    <ActivityIndicator size="small" color={AppColors.primary} />
                  ) : (
                    <MaterialCommunityIcons name="download" size={24} color={AppColors.primary} />
                  )}
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="file-search-outline" size={48} color={AppColors.textHint} />
              <Text style={styles.emptyText}>Nenhum contracheque encontrado para este período.</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 8,
    marginTop: 8,
  },
  yearSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  yearOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthOption: {
    width: '23%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  activeOption: {
    backgroundColor: AppColors.primary + '1A',
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  optionText: {
    fontSize: 14,
    color: AppColors.textPrimary,
  },
  activeOptionText: {
    color: AppColors.primary,
    fontWeight: '700',
  },
  resultsSection: {
    flex: 1,
  },
  paystubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  paystubIcon: {
    marginRight: 16,
  },
  paystubInfo: {
    flex: 1,
  },
  paystubTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  paystubSubtitle: {
    fontSize: 13,
    color: AppColors.textHint,
    marginTop: 2,
  },
  downloadButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.textHint,
    textAlign: 'center',
    marginTop: 12,
  },
});
