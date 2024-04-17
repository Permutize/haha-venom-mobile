import Venom from './graphQL/Venom';
import BaseRequest from './BaseRequest';

export default {
    claim(walletAddress: string) {
        return BaseRequest.venomRequest(Venom.CLAIM, { walletAddress });
    },
    verify(walletAddress: string) {
        return BaseRequest.venomRequest(Venom.VERIFY, { walletAddress });
    },
};
