import React, { useEffect, createRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../auth/authStore';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { QuestionariosScreen, AvisosScreen, DocumentosScreen, DenunciaScreen } from '../screens/modules/ModuleScreens';
import { InformesFinanceirosScreen } from '../screens/modules/InformesFinanceirosScreen';
import { ModuleListScreen } from '../screens/modules/ModuleListScreen';
import { ProfileScreen } from '../screens/home/ProfileScreen';
import { View, ActivityIndicator, Platform } from 'react-native';
import { AppColors } from '../constants/theme';
import { SidebarProvider, useSidebar } from '../components/SidebarContext';
import { Sidebar } from '../components/Sidebar';
import { ThemeProvider, useTheme } from '../components/ThemeContext';

const Stack = createStackNavigator();
export const navigationRef = createRef<NavigationContainerRef<any>>();

const NavigatorContent = () => {
  const { isAuthenticated } = useAuthStore();
  const { setCurrentRoute } = useSidebar();
  const { theme } = useTheme();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        const routeName = navigationRef.current?.getCurrentRoute()?.name;
        if (routeName) {
          setCurrentRoute(routeName);
        }
      }}
      onStateChange={() => {
        const routeName = navigationRef.current?.getCurrentRoute()?.name;
        if (routeName) {
          setCurrentRoute(routeName);
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.background },
        }}
      >
        {!!isAuthenticated === false ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Denuncia" component={DenunciaScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ModuleList" component={ModuleListScreen} />
            <Stack.Screen name="Questionarios" component={QuestionariosScreen} />
            <Stack.Screen name="Avisos" component={AvisosScreen} />
            <Stack.Screen name="Documentos" component={DocumentosScreen} />
            <Stack.Screen name="InformesFinanceiros" component={InformesFinanceirosScreen} />
            <Stack.Screen name="Denuncia" component={DenunciaScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
      <Sidebar />
    </NavigationContainer>
  );
};

export const RootNavigator = () => {
  const { isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: AppColors.background }}>
        <ActivityIndicator size={Platform.OS === 'android' ? 48 : 'large'} color={AppColors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <NavigatorContent />
      </SidebarProvider>
    </ThemeProvider>
  );
};
