import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from 'apollo-boost';

export const newClient = (uri: string) =>
    new ApolloClient({
        link: new ApolloLink((operation, forward) => {
            operation.setContext({
                headers: {},
            });
            return forward(operation);
        }).concat(new HttpLink({ uri })),
        cache: new InMemoryCache(),
    });

export const newClientWithIdToken = (uri: string, idToken: string) =>
    new ApolloClient({
        link: new ApolloLink((operation, forward) => {
            operation.setContext({
                headers: {
                    Authorization: idToken,
                },
            });
            return forward(operation);
        }).concat(new HttpLink({ uri })),
        cache: new InMemoryCache(),
    });
