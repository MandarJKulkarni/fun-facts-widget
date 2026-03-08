import { createApiRef } from '@backstage/core-plugin-api';

export interface FunFact {
    id: number;
    fact: string;
}

export interface FunFactsApi {
    getFacts(): Promise<FunFact[]>;
    createFact(fact: string): Promise<FunFact>;
    updateFact(id: number, fact: string): Promise<FunFact>;
    deleteFact(id: number): Promise<void>;
}

export const funFactsApiRef = createApiRef<FunFactsApi>({
    id: 'plugin.fun-facts.service',
});
