import { legacy_createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer } from 'redux-persist';
import reducers from './reducers';
//@ts-ignore
import createSensitiveStorage from 'redux-persist-sensitive-storage';

const CURRENT_VERSION = 1;

// Secure storage
const secureConfig = {
    key: 'secure',
    version: CURRENT_VERSION,
    storage: createSensitiveStorage({
        keychainService: 'mauIOSKeychain',
        sharedPreferencesName: 'mauAndroidKeychain',
        encrypt: true,
    }),
    whitelist: ['xAuth', 'isFollowUs'],
};

// Combine them together
const rootReducer = combineReducers({
    ...reducers,
});

const store = legacy_createStore(
    persistReducer(secureConfig, rootReducer),
    undefined,
    compose(applyMiddleware(thunk)),
);

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = (dispatch: Function) => void;

export type AppGetState = typeof store.getState;
