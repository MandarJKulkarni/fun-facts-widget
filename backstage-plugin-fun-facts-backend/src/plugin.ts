import {
    coreServices,
    createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import path from 'path';

export const funFactsPlugin = createBackendPlugin({
    pluginId: 'fun-facts',
    register(env) {
        env.registerInit({
            deps: {
                logger: coreServices.logger,
                database: coreServices.database,
                httpRouter: coreServices.httpRouter,
            },
            async init({ logger, database, httpRouter }) {
                logger.info('Initializing fun-facts backend plugin...');

                const dbClient = await database.getClient();

                // Run database migrations on startup
                try {
                    await dbClient.migrate.latest({
                        directory: path.join(__dirname, '../migrations'),
                    });
                    logger.info('Applied database migrations');
                } catch (e) {
                    logger.error(`Migration failed: ${e}`);
                }

                const router = await createRouter({
                    logger,
                    database: dbClient,
                });

                httpRouter.use(router);
            },
        });
    },
});
