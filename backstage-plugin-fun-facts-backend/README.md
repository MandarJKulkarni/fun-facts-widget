# @internal/backstage-plugin-fun-facts-backend

Welcome to the Fun Facts backend plugin!

This plugin provides a simple REST API to manage a collection of "fun facts". It uses a database to store these facts and allows you to create, read, update, and delete them.

## Installation

This is a backend plugin for Backstage and is generally meant to be installed into a Backstage app. 

### Adding the plugin to your backend

1. Add the package to your backend environment:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @internal/backstage-plugin-fun-facts-backend
```

2. Open your backend router setup (typically `packages/backend/src/index.ts`) and add the plugin:

```typescript
// packages/backend/src/index.ts
import funFacts from '@internal/backstage-plugin-fun-facts-backend';

// ...
const backend = createBackend();
// ...
backend.add(funFacts);
// ...
```

## API

The plugin exposes the following endpoints (typically prefixed with `/api/fun-facts` depending on how it's mounted in your backend):

* `GET /health`
  * Checks the health of the plugin.
  * Response: `{ status: 'ok' }`

* `GET /facts`
  * Retrieves all fun facts, ordered by ID.
  * Response: Array of fact objects `[{ id: 1, fact: '...' }, ...]`

* `POST /facts`
  * Creates a new fun fact.
  * Request Body: `{ fact: "String" }`
  * Response (201 Created): The newly created fact object.

* `PUT /facts/:id`
  * Updates an existing fun fact by its ID.
  * Request Body: `{ fact: "Updated string" }`
  * Response (200 OK): `{ id: ID, fact: "Updated string" }`

* `DELETE /facts/:id`
  * Deletes a fun fact by its ID.
  * Response (204 No Content)

## Database Configuration

This plugin uses Knex to interact with the database. It expects a table named `fun_facts` with at least two columns:
* `id` (Primary Key, integer)
* `fact` (String or Text)

Migrations should be run automatically if Backstage is configured to apply migrations on startup.

## Development

To start the plugin in a standalone development environment:

```bash
yarn start
```
