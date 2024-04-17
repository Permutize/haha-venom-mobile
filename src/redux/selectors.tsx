import { AuthorizeResult } from 'react-native-app-auth';
import { useAppSelector } from './hooks';

export const useXAuth = () => {
    const xAuth: AuthorizeResult = useAppSelector(state => state.xAuth);
    return xAuth;
};

export const useIsFollowUs = () => {
    const xAuth: boolean = useAppSelector(state => state.isFollowUs);
    return xAuth;
};
