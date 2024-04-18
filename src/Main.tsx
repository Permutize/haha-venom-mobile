import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { authorize } from 'react-native-app-auth';
import Config from 'react-native-config';
import VenomRequest from '../src/VenomRequest';
import FlashMessage from 'react-native-flash-message';
import CustomToast from '../src/components/CustomToast';
import { setFollowUs, setXAuth } from '../src/redux/actions';
import { useIsFollowUs, useXAuth } from '../src/redux/selectors';
import { useAppDispatch } from './redux/hooks';
import { check, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const DARK = true;
const textColor = DARK ? '#fff' : '#000';
const placeholderColor = DARK ? '#ffffff80' : '#00000080';
const backgroundColor = DARK ? '#2d1b69' : '#fff';

const X_CONFIG = {
    issuer: 'https://twitter.com/i/oauth2',
    clientId: Config.X_CLIENT_ID ?? '',
    redirectUrl: 'mau://connecttox',
    scopes: ['users.read', 'tweet.read', 'follows.read', 'offline.access'],
    serviceConfiguration: {
        authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
        tokenEndpoint: 'https://api.twitter.com/2/oauth2/token',
        revocationEndpoint: 'https://api.twitter.com/2/oauth2/revoke',
    },
};

const hitSlop = {
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
};

const openDeviceSettings = () => {
    Alert.alert(
        'Camera',
        'The permission is denied. Please grant the permision first.',
        [
            { text: 'Cancel', onPress: () => {}, style: 'cancel' },
            {
                text: 'Go to Settings',
                onPress: () => {
                    openSettings().catch(() => console.warn('Cannot open settings'));
                },
            },
        ],
        { cancelable: false },
    );
};

const viewOnVenomScan = (txtHash: string, message: string) => {
    Alert.alert('', message, [
        {
            text: 'Close',
        },
        {
            text: 'View on VenomScan',
            onPress: async () => {
                const url = `https://venomscan.com/transactions/${txtHash}`;
                console.log('url', url);

                if (await Linking.canOpenURL(url)) {
                    Linking.openURL(url);
                }
            },
        },
    ]);
};

function Main(): React.JSX.Element {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const xAuth = useXAuth();
    const isFollowUs = useIsFollowUs();

    const [walletAddress, setWalletAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [claimTxtHash, setClaimTxtHash] = useState('');
    const [loading, setLoading] = useState(false);

    const connectToX = useCallback(async () => {
        try {
            // Connect to X
            const result = await authorize(X_CONFIG);
            dispatch(setXAuth(result));
        } catch (_error: any) {
            console.log('connectToX', _error);
        } finally {
        }
    }, [dispatch]);

    const onQRCodePress = useCallback(() => {
        check(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA)
            .then(result => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        CustomToast.showError('Camera is not available.');
                        break;
                    case RESULTS.LIMITED:
                    case RESULTS.DENIED:
                    case RESULTS.GRANTED:
                        //@ts-ignore
                        navigation.navigate('QRCodeScanner');
                        break;
                    case RESULTS.BLOCKED:
                        openDeviceSettings();
                        break;
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [navigation]);

    const onFollowUsPress = useCallback(() => {
        Linking.openURL('https://twitter.com/mautoken_xyz');
        setTimeout(() => {
            dispatch(setFollowUs(true));
        }, 2000);
    }, [dispatch]);

    const onClaimPress = useCallback(async () => {
        if (!walletAddress || walletAddress.trim() === '') {
            setErrorMessage('Wallet Address is required.');
            return;
        }

        setErrorMessage('');
        setLoading(true);
        VenomRequest.verify(walletAddress)
            .then(result => {
                if (!result.data.verify) {
                    VenomRequest.claim(walletAddress)
                        .then(claimResult => {
                            if (claimResult.data.claim) {
                                setClaimTxtHash(claimResult.data.claim);
                                viewOnVenomScan(
                                    claimResult.data.claim,
                                    'Congratulations! We sent the airdrop to your wallet!',
                                );
                                CustomToast.showSuccess('Claim airdrop succeeded.');
                            }
                        })
                        .catch(() => {})
                        .finally(() => {
                            setLoading(false);
                        });
                } else {
                    setClaimTxtHash(result.data.verify);
                    viewOnVenomScan(
                        result.data.verify,
                        'We already sent the airdrop to the wallet.',
                    );
                    setLoading(false);
                }
            })
            .catch(() => {
                setLoading(false);
            });
    }, [walletAddress]);

    useEffect(() => {
        if (claimTxtHash) {
        }
    }, [claimTxtHash]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle={DARK ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundColor}
            />
            <KeyboardAvoidingView
                style={styles.flexView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.container}>
                    <Image source={require('../src/assets/images/logo.png')} style={styles.logo} />
                    <Text style={styles.title}>MAU Coin</Text>
                    <Text style={styles.desc}>
                        To get MAU coin airdrop, please complete the steps below:
                    </Text>
                    <View style={styles.rowView}>
                        <Text style={styles.stepLb}>Step 1</Text>
                        {!!xAuth && (
                            <View style={styles.doneView}>
                                <Text style={styles.doneLb}>DONE</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity onPress={connectToX}>
                        <View style={styles.smButton}>
                            <Text style={styles.buttonLb}>
                                {xAuth ? 'Connected' : 'Connect'} To X
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.rowView}>
                        <Text style={styles.stepLb}>Step 2</Text>
                        {isFollowUs && (
                            <View style={styles.doneView}>
                                <Text style={styles.doneLb}>DONE</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.desc}>
                        Follow us and say some things about MAU project.
                    </Text>
                    <TouchableOpacity
                        style={(loading || !xAuth) && styles.disabledView}
                        disabled={loading || !xAuth}
                        onPress={onFollowUsPress}>
                        <View style={[styles.smButton, { backgroundColor: '#17B569' }]}>
                            <Text style={styles.buttonLb}>Follow & Tweet Us</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.rowView}>
                        <Text style={styles.stepLb}>Step 3</Text>
                    </View>
                    <Text style={styles.desc}>
                        Enter or Scan the QR of your Venom address to get airdrop.
                    </Text>
                    <View style={styles.inputView}>
                        <TextInput
                            editable={!loading && isFollowUs && !!xAuth}
                            value={walletAddress}
                            style={styles.input}
                            placeholderTextColor={placeholderColor}
                            onChangeText={setWalletAddress}
                            placeholder={'Venom Wallet Address'}
                            autoCorrect={false}
                            returnKeyType={'done'}
                        />
                        <TouchableOpacity
                            style={styles.qrcode}
                            activeOpacity={0.8}
                            hitSlop={hitSlop}
                            disabled
                            onPress={onQRCodePress}>
                            <Icon name={'qrcode'} size={24} color={DARK ? '#fff' : '#007bff'} />
                        </TouchableOpacity>
                    </View>
                    {errorMessage ? <Text style={styles.errorLb}>{errorMessage}</Text> : null}
                    <TouchableOpacity
                        disabled={loading || !isFollowUs || !xAuth}
                        style={[
                            styles.claimBtn,
                            (loading || !isFollowUs || !xAuth) && styles.disabledView,
                        ]}
                        onPress={onClaimPress}>
                        {loading ? (
                            <ActivityIndicator color={'#fff'} size={'small'} />
                        ) : (
                            <Text style={styles.claimLb}>CLAIM</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
            <FlashMessage position="top" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor,
    },
    flexView: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 16,
        marginBottom: 24,
        color: textColor,
    },
    desc: {
        fontSize: 14,
        fontWeight: '300',
        marginBottom: 4,
        color: textColor,
    },
    stepLb: {
        fontSize: 16,
        fontWeight: '400',
        color: textColor,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        borderRadius: 75,
        alignSelf: 'center',
        marginTop: 32,
    },
    inputView: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: textColor,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    input: {
        fontSize: 16,
        fontWeight: '400',
        height: 45,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 0,
        paddingVertical: 0,
        color: textColor,
    },
    smButton: {
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 24,
        backgroundColor: '#007bff',
        alignSelf: 'flex-start',
    },
    buttonLb: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
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
    errorLb: {
        fontSize: 16,
        fontWeight: '400',
        color: '#EB5E6C',
        marginTop: 16,
        alignSelf: 'center',
        textAlign: 'center',
    },
    openTxtBtn: {
        fontSize: 16,
        fontWeight: '400',
        color: '#17B569',
        marginTop: 16,
        alignSelf: 'center',
        textAlign: 'center',
    },
    disabledView: {
        opacity: 0.6,
    },
    doneLb: {
        fontSize: 11,
        fontWeight: '500',
        color: '#fff',
    },
    doneView: {
        marginLeft: 2,
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 1,
        backgroundColor: '#17B569',
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 6,
        borderRadius: 4,
    },
    qrcode: {
        marginLeft: 6,
        zIndex: 1,
    },
});

export default Main;
