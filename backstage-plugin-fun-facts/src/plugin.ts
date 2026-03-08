import {
    createPlugin,
    createComponentExtension,
    createApiFactory,
    discoveryApiRef,
    fetchApiRef
} from '@backstage/core-plugin-api';
import { funFactsApiRef } from './api/types';
import { FunFactsClient } from './api/FunFactsClient';

export const funFactsPlugin = createPlugin({
    id: 'fun-facts',
    apis: [
        createApiFactory({
            api: funFactsApiRef,
            deps: {
                discoveryApi: discoveryApiRef,
                fetchApi: fetchApiRef,
            },
            factory: ({ discoveryApi, fetchApi }) =>
                new FunFactsClient({ discoveryApi, fetchApi }),
        }),
    ],
});

export const FunFactsWidget = funFactsPlugin.provide(
    createComponentExtension({
        name: 'FunFactsWidget',
        component: {
            lazy: () =>
                import('./components/FunFactsWidget').then(m => m.FunFactsWidget),
        },
    })
);
