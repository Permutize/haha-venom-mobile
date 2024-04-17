import { ProviderRpcClient } from 'everscale-inpage-provider';
import { EverscaleStandaloneClient } from 'everscale-standalone-client/nodejs';
import Config from 'react-native-config';

class VenomService {
    static instance: VenomService;

    constructor() {
        if (VenomService.instance) {
            return VenomService.instance;
        }

        VenomService.instance = this;
    }

    async getProvider() {
        const ever = new ProviderRpcClient({
            forceUseFallback: true,
            fallback: () =>
                EverscaleStandaloneClient.create({
                    connection: {
                        id: 1,
                        type: 'graphql',
                        data: {
                            endpoints: [Config.VENOM_RPC_URL ?? ''],
                        },
                    },
                }),
        });
        await ever.ensureInitialized();

        await ever.requestPermissions({
            permissions: ['basic'],
        });

        return ever;
    }
}

export default new VenomService();
