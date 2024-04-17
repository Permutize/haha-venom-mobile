import { DocumentNode, print } from 'graphql';
import { FetchResult } from 'apollo-boost';
import Config from 'react-native-config';
import { newClient } from './ApolloClient';
import CustomToast from './components/CustomToast';

export const getErrorMessage = (e: any) => {
    let errorMessage: string = e?.message;

    if (e?.error?.message) {
        errorMessage = e?.error?.message;
    } else if (e?.networkError?.result) {
        const result = e?.networkError?.result;

        if (result.errors?.length) {
            result.errors.forEach((item: any, index: number) => {
                if (index === 0) {
                    errorMessage = item.message;
                } else {
                    errorMessage += '\n' + item.message;
                }
            });
        } else if (result.message) {
            errorMessage = result.message;
        }
    } else if (e?.graphQLErrors?.length) {
        e.graphQLErrors.forEach((item: any, index: number) => {
            if (index === 0) {
                errorMessage = item.message;
            } else {
                errorMessage += '\n' + item.message;
            }
        });
    } else if (e?.response?.data?.errors?.length) {
        e.response.data.errors.forEach((item: any, index: number) => {
            if (index === 0) {
                errorMessage = item.message;
            } else {
                errorMessage += '\n' + item.message;
            }
        });
    }

    let message = errorMessage || JSON.stringify(e);

    if (message && message.startsWith('execution reverted: ')) {
        message = message.replace('execution reverted: ', '');
    }

    return message ? message : 'Unknown error';
};

export const showErrorMessage = (e: any) => {
    if (__DEV__) {
        console.log('Network Error:', e?.networkError?.result);
        console.log('GraphQL Errors:', e?.graphQLErrors);
    }

    const message = getErrorMessage(e);
    CustomToast.showError(message);
};

const handleError = (e: any, mutation: DocumentNode, url: string) => {
    if (__DEV__) {
        console.log('-----------------');
        console.log('url:', url);
        console.log('mutation:', print(mutation));
        console.log('Network Error:', e?.networkError?.result);
        console.log('GraphQL Errors:', e?.graphQLErrors);
        console.log('--------');
    }

    const message = getErrorMessage(e);
    CustomToast.showError(message);
};

const apolloRequest = (
    url: string | undefined,
    mutation: DocumentNode,
    variables: { [key: string]: any } = {},
    showError: boolean = true,
) => {
    return new Promise<FetchResult<any, Record<string, any>, Record<string, any>>>(
        (resolve, reject) => {
            if (!url) {
                reject(new Error('Url is undefined'));
                return;
            }

            const client = newClient(url);
            client
                .mutate({ mutation, variables })
                .then(response => {
                    resolve(response);
                })
                .catch(e => {
                    // Check if the incoming token has expired
                    if (e.message === 'Network error: Network request failed') {
                        reject(e);
                    } else {
                        showError && handleError(e, mutation, url);
                        reject(e);
                    }
                });
        },
    );
};

export default {
    venomRequest: (
        mutation: DocumentNode,
        variables: { [key: string]: any } = {},
        showError: boolean = true,
    ) => apolloRequest(Config.VENOM_URL, mutation, variables, showError),
};
