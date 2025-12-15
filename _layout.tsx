import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a365d',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
          contentStyle: {
            backgroundColor: '#f8fafc',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="calculator/index" 
          options={{ 
            title: 'Calculate Your Savings',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="calculator/location" 
          options={{ 
            title: 'Your Location',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="calculator/home-type" 
          options={{ 
            title: 'Home Details',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="calculator/current-system" 
          options={{ 
            title: 'Current System',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="calculator/income" 
          options={{ 
            title: 'Incentive Eligibility',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="calculator/contact" 
          options={{ 
            title: 'Get Your Results',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="calculator/results" 
          options={{ 
            title: 'Your Savings Report',
            headerBackTitle: 'Start Over',
          }} 
        />
        <Stack.Screen 
          name="playbooks/index" 
          options={{ 
            title: 'Resource Playbooks',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="playbooks/nonprofit" 
          options={{ 
            title: 'Nonprofit Playbook',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="playbooks/low-income" 
          options={{ 
            title: 'Low-Income Housing',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="playbooks/contractor" 
          options={{ 
            title: 'Contractor Resources',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="intelligence/index" 
          options={{ 
            title: 'Market Intelligence',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="consultation" 
          options={{ 
            title: 'Book Consultation',
            headerBackTitle: 'Back',
            presentation: 'modal',
          }} 
        />
      </Stack>
    </>
  );
}
