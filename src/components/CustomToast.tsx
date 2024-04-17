import { showMessage } from 'react-native-flash-message';

export default {
    showError: (message: string) => {
        showMessage({
            icon: 'danger',
            message: message,
            type: 'danger',
            duration: 3000,
        });
    },
    showSuccess: (message: string) => {
        showMessage({
            icon: 'success',
            message: message,
            type: 'success',
            duration: 3000,
        });
    },
};
