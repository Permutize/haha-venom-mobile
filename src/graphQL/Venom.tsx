import gql from 'graphql-tag';

const CLAIM = gql`
    mutation ($walletAddress: String!) {
        claim(walletAddress: $walletAddress)
    }
`;

const VERIFY = gql`
    query ($walletAddress: String!) {
        verify(walletAddress: $walletAddress)
    }
`;

export default {
    CLAIM,
    VERIFY,
};
