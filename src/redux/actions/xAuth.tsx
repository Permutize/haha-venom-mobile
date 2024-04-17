import { AuthorizeResult } from 'react-native-app-auth';
import { SET_FOLLOW_US, SET_X_AUTH } from '../Types';

export const setXAuth = (state: AuthorizeResult | null) => (dispatch: Function) => {
    dispatch({
        type: SET_X_AUTH,
        state,
    });
};

export const setFollowUs = (state: boolean) => (dispatch: Function) => {
    dispatch({
        type: SET_FOLLOW_US,
        state,
    });
};
