import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { FunFactsApi, FunFact } from './types';

export class FunFactsClient implements FunFactsApi {
    private readonly discoveryApi: DiscoveryApi;
    private readonly fetchApi: FetchApi;

    constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
        this.discoveryApi = options.discoveryApi;
        this.fetchApi = options.fetchApi;
    }

    private async getBaseUrl() {
        return await this.discoveryApi.getBaseUrl('fun-facts');
    }

    private async fetch<T>(path: string, init?: RequestInit): Promise<T> {
        const baseUrl = await this.getBaseUrl();
        const response = await this.fetchApi.fetch(`${baseUrl}${path}`, init);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${path}, status: ${response.status}`);
        }

        if (response.status === 204) {
            return undefined as any;
        }

        return response.json();
    }

    async getFacts(): Promise<FunFact[]> {
        return await this.fetch<FunFact[]>('/facts');
    }

    async createFact(fact: string): Promise<FunFact> {
        return await this.fetch<FunFact>('/facts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fact }),
        });
    }

    async updateFact(id: number, fact: string): Promise<FunFact> {
        return await this.fetch<FunFact>(`/facts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fact }),
        });
    }

    async deleteFact(id: number): Promise<void> {
        return await this.fetch<void>(`/facts/${id}`, {
            method: 'DELETE',
        });
    }
}
