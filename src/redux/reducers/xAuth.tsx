import { AuthorizeResult } from 'react-native-app-auth';
import { SET_FOLLOW_US, SET_X_AUTH } from '../Types';

export const xAuth = (state: AuthorizeResult | null = null, action: { [key: string]: any }) => {
    switch (action.type) {
        case SET_X_AUTH:
            return action.state;

        default:
            return state;
    }
};

export const isFollowUs = (state: boolean = false, action: { [key: string]: any }) => {
    switch (action.type) {
        case SET_FOLLOW_US:
            return action.state;

        default:
            return state;
    }
};
