/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {authorize, AuthorizeResult} from 'react-native-app-auth';
import Config from 'react-native-config';
import axios from 'axios';

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

const getTwitterProfile = (auth: AuthorizeResult) => {
  return axios({
    method: 'GET',
    headers: {Authorization: `Bearer ${auth.accessToken}`},
    url: 'https://api.twitter.com/2/users/me',
    params: {
      'user.fields':
        'created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld',
    },
  });
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const connectToX = useCallback(async () => {
    try {
      // Connect to X
      const result = await authorize(X_CONFIG);

      // Get user profile
      const profileRes = await getTwitterProfile(result);

      // Save x auth locally
      console.log(profileRes);
    } catch (_error: any) {
      console.log('connectToX', _error);
    } finally {
    }
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Text>Mau Coin</Text>
        <TouchableOpacity onPress={connectToX}>
          <Text>Connect To X</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
