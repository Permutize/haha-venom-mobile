import React, { useCallback, useEffect, useState } from 'react';
import FlashMessage from 'react-native-flash-message';
import { Provider as ReduxProvider } from 'react-redux';
import { persistStore } from 'redux-persist';
import store from './src/redux/ReduxStore';
import Main from './src/Main';
import Navigation from './src/navigation';

function App(): React.JSX.Element {
    const [ready, setReady] = useState(false);

    const loadInitialData = useCallback(async () => {
        persistStore(store, null, async () => {
            console.log('Loaded all data.');

            setReady(true);
        });
    }, []);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    return (
        <ReduxProvider store={store}>
            {ready && <Navigation />}
            <FlashMessage position="top" />
        </ReduxProvider>
    );
}

export default App;
