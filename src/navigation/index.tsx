import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from '../Main';
import QRCodeScanner from '../QRCodeScanner';

const Stack = createStackNavigator();

export default function Navigation() {
    return (
        <NavigationContainer
            theme={{
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                },
            }}>
            <Stack.Navigator
                initialRouteName={'Main'}
                screenOptions={() => ({
                    gestureEnabled: false,
                    headerTitleAlign: 'center',
                    gestureDirection: 'horizontal',
                })}>
                <Stack.Screen
                    name={'Main'}
                    component={Main}
                    options={{ headerShown: false, gestureEnabled: true }}
                />
                <Stack.Screen
                    name={'QRCodeScanner'}
                    component={QRCodeScanner}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
