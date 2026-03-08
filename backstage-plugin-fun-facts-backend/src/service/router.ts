import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Knex } from 'knex';

export interface RouterOptions {
    logger: Logger;
    database: Knex;
}

export async function createRouter(
    options: RouterOptions,
): Promise<express.Router> {
    const { logger, database } = options;

    const router = Router();
    router.use(express.json());

    router.get('/health', (_, response) => {
        response.json({ status: 'ok' });
    });

    router.get('/facts', async (_, response) => {
        logger.info('Fetching facts from database');
        const facts = await database('fun_facts').select('*').orderBy('id', 'asc');
        response.json(facts);
    });

    router.post('/facts', async (request, response) => {
        const { fact } = request.body;
        if (!fact) {
            response.status(400).json({ error: 'fact is required' });
            return;
        }
        const [newFact] = await database('fun_facts').insert({ fact }).returning('*');

        // Fallback for sqlite which does not support returning by default in some older Knex versions without specific config
        if (!newFact) {
            const id = await database('fun_facts').max('id as maxId').first();
            response.status(201).json({ id: id?.maxId, fact });
            return;
        }
        response.status(201).json(newFact);
    });

    router.put('/facts/:id', async (request, response) => {
        const { id } = request.params;
        const { fact } = request.body;
        const count = await database('fun_facts').where({ id }).update({ fact });
        if (count === 0) {
            response.status(404).json({ error: 'Fact not found' });
            return;
        }
        response.status(200).json({ id: Number(id), fact });
    });

    router.delete('/facts/:id', async (request, response) => {
        const { id } = request.params;
        const count = await database('fun_facts').where({ id }).delete();
        if (count === 0) {
            response.status(404).json({ error: 'Fact not found' });
            return;
        }
        response.status(204).send();
    });

    router.use(errorHandler());
    return router;
}
