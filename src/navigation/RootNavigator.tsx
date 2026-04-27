import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../auth/authStore';
import { LoginScreen } from '../screens/auth/LoginScreen';

import { HomeScreen } from '../screens/home/HomeScreen';
import { AvisosScreen, AvisoDetalheScreen, DocumentosScreen, DenunciaScreen } from '../screens/modules/ModuleScreens';
import { QuestionariosScreen } from '../screens/questinarios/QuestionariosScreen';
import { ResponderScreen } from '../screens/questinarios/ResponderScreen';
import { ProfileScreen } from '../screens/home/ProfileScreen';
import { View, ActivityIndicator, Platform } from 'react-native';
import { AppColors } from '../constants/theme';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!!isAuthenticated === false ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Questionarios" component={QuestionariosScreen} />
            <Stack.Screen name="Responder" component={ResponderScreen} />
            <Stack.Screen name="Avisos" component={AvisosScreen} />
            <Stack.Screen name="AvisoDetalhe" component={AvisoDetalheScreen} />
            <Stack.Screen name="Documentos" component={DocumentosScreen} />
            <Stack.Screen name="Denuncia" component={DenunciaScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
