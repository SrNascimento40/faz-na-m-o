import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  const isTrainer = user?.type === 'trainer';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#e74c3c',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: isTrainer ? 'Dashboard' : 'Início',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      
      {isTrainer ? (
        <>
          <Tabs.Screen
            name="students"
            options={{
              title: 'Alunos',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="financial"
            options={{
              title: 'Financeiro',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="dollarsign.circle.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="reports"
            options={{
              title: 'Relatórios',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
            }}
          />
        </>
      ) : (
        <>
          <Tabs.Screen
            name="payments"
            options={{
              title: 'Pagamentos',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="creditcard.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="checkin"
            options={{
              title: 'Check-in',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="checkmark.circle.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="progress"
            options={{
              title: 'Progresso',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.line.uptrend.xyaxis" color={color} />,
            }}
          />
        </>
      )}
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
