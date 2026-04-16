import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSidebar } from './SidebarContext';
import { useTheme } from './ThemeContext';
import { ALL_MODULES } from '../constants/modules';
import { navigationRef } from '../navigation/navigationRef';
import { ToggleSwitch } from './ToggleSwitch';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export const Sidebar = () => {
  const insets = useSafeAreaInsets();
  const { isOpen, closeSidebar, currentRoute } = useSidebar();
  const { theme, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, slideAnim, overlayAnim]);

  if (!isOpen && slideAnim._value === -SIDEBAR_WIDTH) {
    return null;
  }

  const handleNavigate = (routeTarget: string) => {
    closeSidebar();
    if (navigationRef.current) {
      navigationRef.current.navigate(routeTarget);
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={closeSidebar}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayAnim,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Sidebar Content */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: theme.surface,
          },
        ]}
      >
        <View style={[styles.header, { borderBottomColor: theme.divider }]}>
          <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={28} color={theme.textPrimary} />
          </TouchableOpacity>
          <Image
            source={require('../../assets/logo_anexo.png')}
            style={[styles.logo, isDark && { tintColor: '#fff' }]}
            resizeMode="contain"
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.menuList}>
            {ALL_MODULES.map((module) => {
              const isActive = currentRoute === module.route;
              return (
                <TouchableOpacity
                  key={module.id}
                  style={[styles.menuItem, isActive && { backgroundColor: theme.background }]}
                  onPress={() => handleNavigate(module.route)}
                  accessibilityLabel={`${module.title}, ${module.subtitle}`}
                  accessibilityRole="button"
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: isActive ? (theme as any)[module.colorName] + '1A' : theme.background },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={module.icon as any}
                      size={24}
                      color={isActive ? (theme as any)[module.colorName] : theme.textHint}
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemTitle, { color: isActive ? (theme as any)[module.colorName] : theme.textPrimary }, isActive && { fontWeight: '700' }]}>
                      {module.title}
                    </Text>
                    <Text style={[styles.itemSubtitle, { color: theme.textHint }]}>{module.subtitle}</Text>
                  </View>
                  {isActive && (
                    <View style={[styles.activeIndicator, { backgroundColor: (theme as any)[module.colorName] }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: theme.divider }]}>
          <ToggleSwitch 
            label="Modo Escuro" 
            icon={isDark ? "weather-night" : "weather-sunny"} 
          />
          <Text style={[styles.versionText, { color: theme.textHint, marginTop: 12 }]}>
            Versão 1.0.0 (Brisa)
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  logo: {
    width: 100,
    height: 32,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    flexGrow: 1,
  },
  menuList: {
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    position: 'relative',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  activeIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    position: 'absolute',
    right: 0,
  },
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    alignItems: 'stretch',
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
