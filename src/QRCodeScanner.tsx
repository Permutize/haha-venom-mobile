import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Scanner from 'react-native-qrcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarCodeReadEvent } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';

export default React.memo(props => {
    const navigation = useNavigation();
    const [address, setAddress] = useState('');
    const scannerRef = useRef<Scanner>(null);

    const onBackPress = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onTryAgainPress = useCallback(() => {
        scannerRef.current && scannerRef.current.reactivate();
        setAddress('');
    }, [scannerRef]);

    const onOKPress = useCallback(async () => {
        await AsyncStorage.setItem('wallet_address', address);
        navigation.goBack();
    }, [navigation, address]);

    const onSuccess = useCallback((args: BarCodeReadEvent) => {
        if (args.data) {
            if (args.data.includes(':')) {
                const _address = args.data.split(':')[1];
                setAddress(_address);
            } else {
                setAddress(args.data);
            }
        } else {
            setAddress('');
        }
    }, []);

    useEffect(() => {}, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
                <Text style={styles.title}>Address:</Text>
                <Text ellipsizeMode={'tail'} numberOfLines={2} style={styles.value}>
                    {address}
                </Text>
            </View>
            <Scanner
                ref={scannerRef}
                onRead={onSuccess}
                containerStyle={styles.scanner}
                showMarker
                cameraStyle={styles.cameraStyle}
                markerStyle={styles.marker}
                permissionDialogTitle={'Camera'}
                permissionDialogMessage={
                    'The permission is denied. Please grant the permision first.'
                }
            />
            <View style={styles.bottomView}>
                {address ? (
                    <>
                        <TouchableOpacity style={[styles.claimBtn]} onPress={onTryAgainPress}>
                            <Text style={styles.claimLb}>TRY AGAIN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.claimBtn]} onPress={onTryAgainPress}>
                            <Text style={styles.claimLb}>OK</Text>
                        </TouchableOpacity>
                        {/* <HaHaButton
                            name={'TRY AGAIN'}
                            containerStyle={styles.button}
                            type={'secondary'}
                            onPress={onTryAgainPress}
                        />
                        <HaHaButton
                            name={'OK'}
                            containerStyle={styles.button}
                            type={'primary'}
                            onPress={onOKPress}
                        /> */}
                    </>
                ) : null}
            </View>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff', flex: 1 },
    scanner: {
        flex: 1,
        width: '100%',
        height: 500,
        overflow: 'hidden',
    },
    topView: {
        paddingHorizontal: 16,
        width: '100%',
        height: 80,
        justifyContent: 'center',
    },
    bottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        width: '100%',
        height: 80,
        alignItems: 'center',
    },
    marker: {
        borderColor: '#007bff',
        borderWidth: 2,
    },
    button: {
        width: 155,
    },
    cameraStyle: {},
    title: {
        fontSize: 16,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        fontWeight: '300',
    },
    claimBtn: {
        borderRadius: 8,
        height: 50,
        width: '100%',
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 48,
    },
    claimLb: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
