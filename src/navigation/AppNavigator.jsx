import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

// Screens
import GeneralJobsScreen from '../screens/GeneralJobsScreen';
import RemoteJobsScreen from '../screens/RemoteJobsScreen';
import SalariesScreen from '../screens/SalariesScreen';
import JobDetailScreen from '../screens/JobDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for each tab
const JobsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.background,
      headerTitleStyle: {
        ...theme.typography.h3,
      },
    }}
  >
    <Stack.Screen 
      name="GeneralJobs" 
      component={GeneralJobsScreen} 
      options={{ title: 'General Jobs' }}
    />
    <Stack.Screen 
      name="JobDetail" 
      component={JobDetailScreen} 
      options={{ title: 'Job Details' }}
    />
  </Stack.Navigator>
);

const RemoteJobsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.background,
      headerTitleStyle: {
        ...theme.typography.h3,
      },
    }}
  >
    <Stack.Screen 
      name="RemoteJobs" 
      component={RemoteJobsScreen} 
      options={{ title: 'Remote Jobs' }}
    />
    <Stack.Screen 
      name="JobDetail" 
      component={JobDetailScreen} 
      options={{ title: 'Job Details' }}
    />
  </Stack.Navigator>
);

const SalariesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.background,
      headerTitleStyle: {
        ...theme.typography.h3,
      },
    }}
  >
    <Stack.Screen 
      name="Salaries" 
      component={SalariesScreen} 
      options={{ title: 'Salary Estimates' }}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'GeneralJobsTab') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'RemoteJobsTab') {
            iconName = focused ? 'globe' : 'globe-outline';
          } else if (route.name === 'SalariesTab') {
            iconName = focused ? 'cash' : 'cash-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          ...theme.typography.caption,
          marginBottom: theme.spacing.xxs,
        },
        tabBarStyle: {
          height: theme.spacing.xxl + insets.bottom,
          paddingTop: theme.spacing.xs,
          paddingBottom: insets.bottom + theme.spacing.xs,
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="GeneralJobsTab" 
        component={JobsStack} 
        options={{ title: 'Jobs' }}
      />
      <Tab.Screen 
        name="RemoteJobsTab" 
        component={RemoteJobsStack} 
        options={{ title: 'Remote' }}
      />
      <Tab.Screen 
        name="SalariesTab" 
        component={SalariesStack} 
        options={{ title: 'Salaries' }}
      />
    </Tab.Navigator>
  );
};