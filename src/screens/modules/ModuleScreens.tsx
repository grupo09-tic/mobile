import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '../../constants/theme';

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
  return (
    <View style={styles.container}>
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>{title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name={icon} size={64} color={iconColor + '4D'} />
            <Text style={styles.emptyText}>{emptyMessage || 'Nenhum item encontrado'}</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {items.map((item, index) => (
              <TouchableOpacity key={index} style={styles.card}>
                <View style={[styles.cardIconContainer, { backgroundColor: iconColor + '1F' }]}>
                  <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color={AppColors.textHint} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export const AvisosScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Avisos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.list}>
          {/* Item 1 - Novo */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AvisoDetalhe')}>
            <View style={[styles.cardIconContainer, { backgroundColor: AppColors.modulePurple + '1F' }]}>
              <MaterialCommunityIcons name="bullhorn-outline" size={22} color={AppColors.modulePurple} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Reunião geral amanhã às 10h</Text>
              <Text style={styles.cardSubtitle}>Hoje, 08:30</Text>
            </View>
            <View style={[styles.badge, styles.badgeUnread]}>
              <Text style={styles.badgeUnreadText}>Novo</Text>
            </View>
          </TouchableOpacity>

          {/* Item 2 - Novo */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AvisoDetalhe')}>
            <View style={[styles.cardIconContainer, { backgroundColor: AppColors.modulePurple + '1F' }]}>
              <MaterialCommunityIcons name="bullhorn-outline" size={22} color={AppColors.modulePurple} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Atualização da política de home office</Text>
              <Text style={styles.cardSubtitle}>Ontem, 14:15</Text>
            </View>
            <View style={[styles.badge, styles.badgeUnread]}>
              <Text style={styles.badgeUnreadText}>Novo</Text>
            </View>
          </TouchableOpacity>

          {/* Item 3 - Novo */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AvisoDetalhe')}>
            <View style={[styles.cardIconContainer, { backgroundColor: AppColors.modulePurple + '1F' }]}>
              <MaterialCommunityIcons name="bullhorn-outline" size={22} color={AppColors.modulePurple} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Confraternização de fim de trimestre</Text>
              <Text style={styles.cardSubtitle}>28/03/2026</Text>
            </View>
            <View style={[styles.badge, styles.badgeUnread]}>
              <Text style={styles.badgeUnreadText}>Novo</Text>
            </View>
          </TouchableOpacity>

          {/* Item 4 - Lido */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AvisoDetalhe')}>
            <View style={[styles.cardIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <MaterialCommunityIcons name="bullhorn-outline" size={22} color={AppColors.textHint} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Manutenção do sistema — Sábado</Text>
              <Text style={styles.cardSubtitle}>25/03/2026</Text>
            </View>
            <View style={[styles.badge, styles.badgeRead]}>
              <Text style={styles.badgeReadText}>Lido</Text>
            </View>
          </TouchableOpacity>

          {/* Item 5 - Lido */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AvisoDetalhe')}>
            <View style={[styles.cardIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <MaterialCommunityIcons name="bullhorn-outline" size={22} color={AppColors.textHint} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Holerite de Março disponível</Text>
              <Text style={styles.cardSubtitle}>20/03/2026</Text>
            </View>
            <View style={[styles.badge, styles.badgeRead]}>
              <Text style={styles.badgeReadText}>Lido</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export const AvisoDetalheScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Detalhe do Aviso</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.detailHeaderIcon}>
          <Text style={{ fontSize: 40 }}>📢</Text>
        </View>
        <Text style={styles.detailTitle}>Reunião Geral — Amanhã às 10h00</Text>
        <Text style={styles.detailMeta}>Publicado em 30/03/2026 às 08:30 · RH Corporativo</Text>
        
        <View style={styles.detailBodyCard}>
          <Text style={styles.detailBodyText}>
            Informamos que haverá uma reunião geral com todos os colaboradores amanhã, dia 31 de março de 2026, às 10 horas da manhã, na sala de conferências do 3º andar.{'\n\n'}
            A pauta da reunião incluirá:{'\n'}
            • Resultados do primeiro trimestre{'\n'}
            • Metas para o segundo trimestre{'\n'}
            • Novidades sobre benefícios e plano de carreira{'\n'}
            • Espaço aberto para perguntas e sugestões{'\n\n'}
            A participação é obrigatória para todos os colaboradores. Em caso de impossibilidade, favor comunicar seu gestor imediato com antecedência.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export const DocumentosScreen = ({ navigation }: any) => (
  <ModuleScaffold
    title="Documentos"
    icon="file-document-outline"
    iconColor={AppColors.moduleGreen}
    items={[]}
    emptyMessage="Nenhum documento disponível"
    onBack={() => navigation.goBack()}
  />
);

export const DenunciaScreen = ({ navigation }: any) => {
  const [categoria, setCategoria] = useState('Assédio');
  const [descricao, setDescricao] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = () => {
    if (descricao.length < 20) {
      Alert.alert('Erro', 'Por favor, descreva com mais detalhes (mín. 20 caracteres)');
      return;
    }
    setEnviado(true);
  };

  const insets = useSafeAreaInsets();

  if (enviado) {
    return (
      <View style={styles.container}>
        <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top }]}>
           <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={AppColors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Denúncia Enviada</Text>
        </View>
        <View style={[styles.scrollContent, styles.center]}>
          <View style={styles.successIconContainer}>
            <MaterialCommunityIcons name="check-circle-outline" size={40} color={AppColors.success} />
          </View>
          <Text style={styles.successTitle}>Denúncia enviada!</Text>
          <Text style={styles.successSubtitle}>
            Sua denúncia foi registrada de forma anônima e segura. Ela será analisada pela equipe responsável.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryButtonText}>Voltar ao início</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.appBar, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Denúncia Anônima</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="shield-outline" size={20} color={AppColors.info} />
          <Text style={styles.infoText}>
            Sua identidade é protegida. Esta denúncia é completamente anônima.
          </Text>
        </View>

        <Text style={styles.fieldLabel}>Categoria</Text>
        <View style={styles.pickerContainer}>
          {['Assédio', 'Discriminação', 'Irregularidade Financeira', 'Conduta Inadequada', 'Outro'].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.catOption, categoria === cat ? styles.catOptionActive : undefined]}
              onPress={() => setCategoria(cat)}
            >
              <Text style={[styles.catText, categoria === cat ? styles.catTextActive : undefined]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Descrição</Text>
        <TextInput
          style={styles.textArea}
          multiline={true}
          numberOfLines={6}
          placeholder="Descreva a ocorrência com detalhes, sem identificar a si mesmo..."
          value={descricao}
          onChangeText={setDescricao}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <MaterialCommunityIcons name="send-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>Enviar Denúncia</Text>
        </TouchableOpacity>
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeUnread: {
    backgroundColor: '#EEF2FF',
  },
  badgeUnreadText: {
    fontSize: 11,
    color: '#4338CA',
    fontWeight: '700',
  },
  badgeRead: {
    backgroundColor: '#F1F5F9',
  },
  badgeReadText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  detailHeaderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  detailMeta: {
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  detailBodyCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  detailBodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: AppColors.textSecondary,
  },
});
